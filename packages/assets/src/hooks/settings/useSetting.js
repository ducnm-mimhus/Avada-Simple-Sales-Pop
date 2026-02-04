import {React, useCallback, useEffect, useMemo, useState} from 'react';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import DisplayTab from '@assets/pages/Settings/components/DisplayTab';
import TriggersTab from '@assets/pages/Settings/components/TriggerTab';
import {INITIAL_SETTINGS} from '../../../../INTINAL_SETTING';

export default function useSettingsLogic() {
  const {data: fetchedSettings, loading: isFetching, setData: setFetchedSettings} = useFetchApi({
    url: '/settings',
    defaultData: INITIAL_SETTINGS
  });

  const [settings, setSettings] = useState(fetchedSettings);
  const {editing: isSaving, handleEdit} = useEditApi({url: '/settings'});

  useEffect(() => {
    if (fetchedSettings) setSettings(fetchedSettings);
  }, [fetchedSettings]);

  const isDirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(fetchedSettings), [
    settings,
    fetchedSettings
  ]);

  const handleSettingChange = useCallback((key, value) => {
    setSettings(prev => ({...prev, [key]: value}));
  }, []);

  const {modal: saveModal, openModal: openSaveModal} = useConfirmModal({
    title: 'Save changes?',
    confirmAction: async () => {
      const success = await handleEdit(settings);
      if (success) setFetchedSettings(settings);
      return success;
    }
  });

  const {modal: undoModal, openModal: openUndoModal} = useConfirmModal({
    title: 'Discard changes?',
    destructive: true,
    confirmAction: () => {
      setSettings(fetchedSettings);
      return true;
    }
  });

  const tabs = [
    {
      id: 'display',
      content: 'Display',
      component: <DisplayTab settings={settings} onChange={handleSettingChange} />
    },
    {
      id: 'triggers',
      content: 'Triggers',
      component: <TriggersTab settings={settings} onChange={handleSettingChange} />
    }
  ];

  return {
    settings,
    isFetching,
    isSaving,
    isDirty,
    handleSettingChange,
    openSaveModal,
    openUndoModal,
    modals: (
      <>
        {saveModal}
        {undoModal}
      </>
    ),
    tabs
  };
}
