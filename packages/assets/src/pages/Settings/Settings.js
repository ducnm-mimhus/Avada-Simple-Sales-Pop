import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {BlockStack, Box, Card, Layout, Page, SkeletonBodyText, Tabs} from '@shopify/polaris';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import NotificationPopupPreview from '@assets/pages/Settings/components/NotificationPopupPreview';
import DisplayTab from '@assets/pages/Settings/components/DisplayTab';
import TriggersTab from '@assets/pages/Settings/components/TriggerTab';
import {INITIAL_SETTINGS} from '../../../../INTINAL_SETTING';

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState(0);

  const {data: fetchedSettings, loading: isFetching, setData: setFetchedSettings} = useFetchApi({
    url: '/settings',
    defaultData: INITIAL_SETTINGS
  });

  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const {editing: isSaving, handleEdit} = useEditApi({url: '/settings'});

  useEffect(() => {
    if (fetchedSettings) setSettings(fetchedSettings);
  }, [fetchedSettings]);

  const isDirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(fetchedSettings), [
    settings,
    fetchedSettings
  ]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({...prev, [key]: value}));
  }, []);

  const saveSettings = async () => {
    const success = await handleEdit(settings);
    if (success) setFetchedSettings(settings);
    return success;
  };

  const undoChanges = () => setSettings(fetchedSettings);

  const {modal: saveModal, openModal: openSaveModal} = useConfirmModal({
    title: 'Save changes?',
    confirmAction: saveSettings,
    disabled: isSaving
  });

  const {modal: undoModal, openModal: openUndoModal} = useConfirmModal({
    title: 'Discard changes?',
    destructive: true,
    confirmAction: () => {
      undoChanges();
      return true;
    }
  });

  if (isFetching) return <LoadingState />;

  const tabs = [
    {
      id: 'display',
      content: 'Display',
      component: <DisplayTab settings={settings} onChange={updateSetting} />
    },
    {
      id: 'triggers',
      content: 'Triggers',
      component: <TriggersTab settings={settings} onChange={updateSetting} />
    }
  ];

  return (
    <Page
      title="Settings"
      subtitle="Decide how your notifications will display"
      primaryAction={{
        content: 'Save',
        onAction: openSaveModal,
        loading: isSaving,
        disabled: !isDirty
      }}
      secondaryActions={[{content: 'Undo', onAction: openUndoModal, disabled: !isDirty}]}
    >
      <Layout>
        <Layout.Section variant="oneThird">
          <Card padding="400">
            <BlockStack gap="200">
              <NotificationPopupPreview settings={settings} />
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
            <Box paddingBlockStart="400">{tabs[selectedTab].component}</Box>
          </Tabs>
        </Layout.Section>
      </Layout>

      {/* Render các Modals */}
      {saveModal}
      {undoModal}
    </Page>
  );
}

const LoadingState = () => (
  <Page title="Settings" subtitle="Decide how your notifications will display">
    <Layout>
      <Layout.Section>
        <Card>
          <SkeletonBodyText lines={5} />
        </Card>
      </Layout.Section>
    </Layout>
  </Page>
);
