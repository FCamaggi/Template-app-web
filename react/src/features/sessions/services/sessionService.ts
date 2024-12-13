import axios from '@/lib/axios';
import { Session } from '../types';

export const sessionService = {
  startSession: async (routineId: number) => {
    const response = await axios.post<{ status: string; data: Session }>(
      '/sessions/start',
      {
        routine_id: routineId,
      }
    );
    return response.data;
  },

  getActiveSession: async () => {
    const response = await axios.get<{ status: string; data: Session }>(
      '/sessions/active'
    );
    return response.data;
  },

  finishSession: async ({
    sessionId,
    data,
  }: {
    sessionId: number;
    data: {
      overall_difficulty?: number;
      energy_level?: number;
      notes?: string;
      calories_burned?: number;
    };
  }) => {
    const response = await axios.post<{ status: string; message: string }>(
      `/sessions/${sessionId}/finish`,
      data
    );
    return response.data;
  },

  recordProgress: async ({
    exerciseId,
    sessionId,
    data,
  }: {
    exerciseId: number;
    sessionId: number;
    data: {
      weight_used: number;
      reps_performed: number;
      borg_rating?: number;
      technique_rating?: number;
      perceived_difficulty?: number;
      notes?: string;
    };
  }) => {
    const response = await axios.post('/progress', {
      exercise_id: exerciseId,
      session_id: sessionId,
      ...data,
    });
    return response.data;
  },
};
