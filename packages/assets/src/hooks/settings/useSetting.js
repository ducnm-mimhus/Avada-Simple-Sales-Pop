import {useCallback, useEffect, useMemo, useState} from 'react';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import {INITIAL_SETTINGS} from '../../../../INTINAL_SETTING';

export default function useSettings(url = '/settings', initialData = INITIAL_SETTINGS) {
  const {data: fetchedSettings, loading: isFetching, setData: setFetchedSettings} = useFetchApi({
    url,
    defaultData: initialData
  });

  const [settings, setSettings] = useState(initialData);
  const {editing: isSaving, handleEdit} = useEditApi({url});

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

  return {
    settings,
    isFetching,
    isSaving,
    isDirty,
    updateSetting,
    saveSettings,
    undoChanges
  };
}
