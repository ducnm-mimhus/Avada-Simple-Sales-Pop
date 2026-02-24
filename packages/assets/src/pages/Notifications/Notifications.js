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
import React, {useMemo, useState} from 'react';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useDeleteApi from '@assets/hooks/api/useDeleteApi';

export default function Notifications() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {data: notifications, loading, setData: setNotifications} = useFetchApi({
    url: '/notifications',
    defaultData: []
  });

  const {deleting, handleDelete} = useDeleteApi({
    url: '/notifications',
    successCallback: () => {
      setNotifications(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      setCurrentPage(1);
    }
  });

  const sortedData = useMemo(() => {
    const data = [...notifications];
    return sortValue === 'DATE_MODIFIED_DESC' ? data : data.reverse();
  }, [notifications, sortValue]);

  const pagedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  const {modal: confirmModal, openModal} = useConfirmModal({
    title: `Delete ${selectedItems.length} notifications?`,
    destructive: true,
    loading: deleting,
    confirmAction: () => handleDelete({data: {ids: selectedItems}})
  });

  return (
    <Page title="Notifications" subtitle="List of sales notification from Shopify">
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card padding="0">
              <ResourceList
                resourceName={{singular: 'notification', plural: 'notifications'}}
                items={pagedNotifications}
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
                onSortChange={value => {
                  setSortValue(value);
                  setCurrentPage(1);
                }}
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
