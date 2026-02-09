import useFetchApi from '@assets/hooks/api/useFetchApi';
import {useMemo, useState} from 'react';
import useDeleteApi from '@assets/hooks/api/useDeleteApi';

export default function useNotifications() {
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

  return {
    notifications: pagedNotifications,
    loading,
    deleting,
    selectedItems,
    setSelectedItems,
    sortValue,
    setSortValue,
    currentPage,
    setCurrentPage,
    totalPages,
    handleDelete: () => handleDelete({data: {ids: selectedItems}})
  };
}
