import useNotifications from '@assets/hooks/notifications/useNotifications';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import {
  BlockStack,
  Card,
  EmptyState,
  InlineStack,
  Layout,
  Page,
  Pagination,
  ResourceList
} from '@shopify/polaris';
import NotificationItem from '@assets/pages/Notifications/components/NotificationItem';
import React from 'react';

export default function Notifications() {
  const {
    notifications,
    loading,
    deleting,
    selectedItems,
    setSelectedItems,
    sortValue,
    setSortValue,
    currentPage,
    setCurrentPage,
    totalPages,
    handleDelete
  } = useNotifications();

  const {modal: confirmModal, openModal} = useConfirmModal({
    title: `Delete ${selectedItems.length} notifications?`,
    destructive: true,
    loading: deleting,
    confirmAction: handleDelete
  });

  return (
    <Page title="Notifications" subtitle="List of sales notification from Shopify">
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card padding="0">
              <ResourceList
                resourceName={{singular: 'notification', plural: 'notifications'}}
                items={notifications}
                renderItem={item => <NotificationItem item={item} />}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                selectable
                promotedBulkActions={[
                  {
                    content: 'Delete notifications',
                    onAction: openModal,
                    destructive: true
                  }
                ]}
                sortValue={sortValue}
                sortOptions={[
                  {label: 'Newest update', value: 'DATE_MODIFIED_DESC'},
                  {label: 'Oldest update', value: 'DATE_MODIFIED_ASC'}
                ]}
                onSortChange={setSortValue}
                loading={loading}
                emptyState={<EmptyStateHeading />}
              />
            </Card>

            {totalPages > 1 && (
              <InlineStack align="center">
                <Pagination
                  hasPrevious={currentPage > 1}
                  onPrevious={() => setCurrentPage(prev => prev - 1)}
                  hasNext={currentPage < totalPages}
                  onNext={() => setCurrentPage(prev => prev + 1)}
                />
              </InlineStack>
            )}
          </BlockStack>
        </Layout.Section>
      </Layout>
      {confirmModal}
    </Page>
  );
}
const EmptyStateHeading = () => (
  <EmptyState
    heading="No notifications yet"
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Track your sales and they will show up here.</p>
  </EmptyState>
);
