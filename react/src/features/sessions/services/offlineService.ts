import { Session } from '../types';

const STORAGE_KEYS = {
  ACTIVE_SESSION: 'gym_active_session',
  PENDING_SYNCS: 'gym_pending_syncs',
  LAST_SYNC: 'gym_last_sync',
};

export const offlineService = {
  // Guardar sesión activa
  saveActiveSession: (session: Session): void => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.ACTIVE_SESSION,
        JSON.stringify(session)
      );
    } catch (error) {
      console.error('Error saving session to localStorage:', error);
    }
  },

  // Obtener sesión activa
  getActiveSession: (): Session | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading session from localStorage:', error);
      return null;
    }
  },

  // Guardar set completado para sincronización posterior
  savePendingSet: (data: {
    exerciseId: number;
    sessionId: number;
    weight: number;
    reps: number;
    borg_rating?: number;
  }): void => {
    try {
      const pending = offlineService.getPendingSets();
      pending.push({
        ...data,
        data: {
          weight_used: data.weight,
          reps_performed: data.reps,
          borg_rating: data.borg_rating,
          completed_at: new Date().toISOString(),
        },
      });
      localStorage.setItem(STORAGE_KEYS.PENDING_SYNCS, JSON.stringify(pending));
    } catch (error) {
      console.error('Error saving pending set:', error);
    }
  },

  // Obtener sets pendientes de sincronización
  getPendingSets: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PENDING_SYNCS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading pending sets:', error);
      return [];
    }
  },

  // Limpiar sets sincronizados
  clearSyncedSets: (syncedIds: number[]): void => {
    try {
      const pending = offlineService.getPendingSets();
      const remaining = pending.filter(
        (set: any) => !syncedIds.includes(set.id)
      );
      localStorage.setItem(
        STORAGE_KEYS.PENDING_SYNCS,
        JSON.stringify(remaining)
      );
    } catch (error) {
      console.error('Error clearing synced sets:', error);
    }
  },

  // Actualizar timestamp de última sincronización
  updateLastSync: (): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Error updating last sync:', error);
    }
  },

  // Limpiar todos los datos de la sesión
  clearSessionData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      localStorage.removeItem(STORAGE_KEYS.PENDING_SYNCS);
    } catch (error) {
      console.error('Error clearing session data:', error);
    }
  },
};
