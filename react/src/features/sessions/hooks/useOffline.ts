import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { sessionService } from '../services/sessionService';
import { offlineService } from '../services/offlineService';
import { addCompletedSet } from '../store/sessionSlice';
import { toast } from 'react-hot-toast';

export function useOffline() {
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // Monitorear el estado de la conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored');
      void syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Working offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sincronizar datos pendientes
  const syncPendingData = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    const pendingSets = offlineService.getPendingSets();
    if (pendingSets.length === 0) return;

    setIsSyncing(true);
    const syncedIds: number[] = [];

    try {
      for (const set of pendingSets) {
        await sessionService.recordProgress(set);
        syncedIds.push(set.id);
        dispatch(addCompletedSet(set.data));
      }

      offlineService.clearSyncedSets(syncedIds);
      offlineService.updateLastSync();
      toast.success(`Synced ${syncedIds.length} sets`);
    } catch (error) {
      console.error('Error syncing data:', error);
      toast.error('Error syncing some data');
    } finally {
      setIsSyncing(false);
    }
  }, [dispatch, isOnline, isSyncing]);

  // Guardar set completado
  const saveSetOffline = useCallback(
    (data: {
      exerciseId: number;
      sessionId: number;
      weight: number;
      reps: number;
      borg_rating?: number;
    }) => {
      offlineService.savePendingSet(data);
      dispatch(addCompletedSet({
        exerciseId: data.exerciseId,
        sessionId: data.sessionId,
        weight: data.weight,
        reps: data.reps,
        borg_rating: data.borg_rating,
      }));

      if (!isOnline) {
        toast.success('Set saved offline');
      } else {
        void syncPendingData();
      }
    },
    [dispatch, isOnline, syncPendingData]
  );

  return {
    isOnline,
    isSyncing,
    saveSetOffline,
    syncPendingData,
  };
}
