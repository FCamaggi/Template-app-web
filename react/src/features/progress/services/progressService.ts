import axios from '@/lib/axios';
import { ExerciseProgress, ProgressStats, ProgressFilters } from '../types';

export const progressService = {
  getExerciseProgress: async (filters: ProgressFilters) => {
    const response = await axios.get<{
      data: ExerciseProgress[];
      stats: ProgressStats;
    }>(`/progress/exercise/${filters.exerciseId}`, {
      params: {
        startDate: filters.startDate,
        endDate: filters.endDate,
        limit: filters.limit,
      },
    });
    return response.data;
  },

  getExerciseStats: async (exerciseId: number) => {
    const response = await axios.get<ProgressStats>(
      `/progress/exercise/${exerciseId}/stats`
    );
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await axios.get<{
      recentProgress: ExerciseProgress[];
      overallStats: {
        totalWorkouts: number;
        totalVolume: number;
        mostWorkedMuscleGroups: { muscleGroup: string; count: number }[];
        strongestLifts: { exercise: string; weight: number }[];
      };
    }>('/progress/dashboard');
    return response.data;
  },

  exportProgress: async (exerciseId: number, format: 'csv' | 'json') => {
    const response = await axios.get(
      `/progress/exercise/${exerciseId}/export/${format}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
};
