import React, {useState} from 'react';
import {BlockStack, Box, Card, Layout, Page, SkeletonBodyText, Tabs} from '@shopify/polaris';
import useSettingsLogic from '@assets/hooks/settings/useSetting';
import NotificationPopupPreview from '@assets/pages/Settings/components/NotificationPopupPreview';

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    settings,
    isFetching,
    isSaving,
    isDirty,
    openSaveModal,
    openUndoModal,
    modals,
    tabs
  } = useSettingsLogic();

  if (isFetching) return <LoadingState />;

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

      {modals}
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
