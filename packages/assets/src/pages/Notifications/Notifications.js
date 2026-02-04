import React, {useEffect, useMemo, useState} from 'react';
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
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useDeleteApi from '@assets/hooks/api/useDeleteApi';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import NotificationItem from '@assets/pages/Notifications/components/NotificationItem';
import {cleanDate} from '@assets/pages/Notifications/utils/timeFormater';

export default function Notifications() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const [localNotifications, setLocalNotifications] = useState([]);

  const {data: notifications, loading} = useFetchApi({
    url: '/notifications',
    defaultData: []
  });

  const {deleting, handleDelete} = useDeleteApi({
    url: '/notifications',
    successCallback: () => {
      setLocalNotifications(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  });

  const {modal: confirmModal, openModal} = useConfirmModal({
    title: `Delete ${selectedItems.length} notifications?`,
    content: 'Are you sure you want to delete these notifications? This action cannot be undone.',
    buttonTitle: 'Delete',
    destructive: true,
    loading: deleting,
    confirmAction: async () => {
      return await handleDelete({
        data: {ids: selectedItems}
      });
    }
  });

  useEffect(() => {
    if (notifications) setLocalNotifications(notifications);
  }, [notifications]);

  const sortedNotifications = useMemo(() => {
    if (!Array.isArray(localNotifications)) return [];
    return [...localNotifications].sort((a, b) => {
      const diff = cleanDate(a.timestamp) - cleanDate(b.timestamp);
      return sortValue === 'DATE_MODIFIED_DESC' ? -diff : diff;
    });
  }, [localNotifications, sortValue]);

  const promotedBulkActions = [
    {
      content: 'Delete notifications',
      onAction: openModal,
      destructive: true
    }
  ];

  return (
    <Page title="Notifications" subtitle="List of sales notification from Shopify">
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card padding="0">
              <ResourceList
                resourceName={{singular: 'notification', plural: 'notifications'}}
                items={sortedNotifications}
                renderItem={item => <NotificationItem item={item} />}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                selectable
                promotedBulkActions={promotedBulkActions}
                sortValue={sortValue}
                sortOptions={[
                  {label: 'Newest update', value: 'DATE_MODIFIED_DESC'},
                  {label: 'Oldest update', value: 'DATE_MODIFIED_ASC'}
                ]}
                onSortChange={setSortValue}
                loading={loading}
                emptyState={
                  <EmptyState
                    heading="No notifications yet"
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                  >
                    <p>Track your sales and they will show up here.</p>
                  </EmptyState>
                }
              />
            </Card>

            <InlineStack align="center">
              <Pagination
                hasPrevious={currentPage > 1}
                onPrevious={() => setCurrentPage(currentPage - 1)}
                hasNext={true}
                onNext={() => setCurrentPage(currentPage + 1)}
              />
            </InlineStack>
          </BlockStack>
        </Layout.Section>
      </Layout>

      {confirmModal}
    </Page>
  );
}
