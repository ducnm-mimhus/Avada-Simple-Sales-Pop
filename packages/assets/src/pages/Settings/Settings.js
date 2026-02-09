import React, {useState} from 'react';
import {BlockStack, Box, Card, Layout, Page, SkeletonBodyText, Tabs} from '@shopify/polaris';
import NotificationPopupPreview from '@assets/pages/Settings/components/NotificationPopupPreview';
import useSettings from '@assets/hooks/settings/useSetting';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import DisplayTab from '@assets/pages/Settings/components/DisplayTab';
import TriggersTab from '@assets/pages/Settings/components/TriggerTab';

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    settings,
    isFetching,
    isSaving,
    isDirty,
    updateSetting,
    saveSettings,
    undoChanges
  } = useSettings();

  const {modal: saveModal, openModal: openSaveModal} = useConfirmModal({
    title: 'Save changes?',
    confirmAction: saveSettings
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
