import axios from '@/lib/axios';
import {
  DashboardStats,
  ActivityLog,
  UpcomingWorkout,
  ProgressOverview,
  WorkoutSummary,
} from '../types';

export const dashboardService = {
  // Obtener todos los datos del dashboard
  getDashboardData: async () => {
    // Temporal mientras se implementa el endpoint
    return {
      stats: {
        workoutsCompleted: 10,
        currentStreak: 5,
        totalTime: 120,
        achievements: 3,
        monthlyGoalProgress: 50,
        averageWorkoutTime: 30,
      },
      recentActivity: [],
      upcomingWorkouts: [],
      progress: {
        volumeByMuscleGroup: [],
        recentPRs: [],
        monthlyProgress: [],
      },
    };
  },

  // Obtener solo las estadísticas
  getStats: async (): Promise<DashboardStats> => {
    const response = await axios.get('/dashboard/stats');
    return response.data;
  },

  // Obtener actividad reciente
  getRecentActivity: async (limit: number = 10): Promise<ActivityLog[]> => {
    const response = await axios.get('/dashboard/activity', {
      params: { limit },
    });
    return response.data;
  },

  // Obtener próximos entrenamientos
  getUpcomingWorkouts: async (): Promise<UpcomingWorkout[]> => {
    const response = await axios.get('/dashboard/upcoming');
    return response.data;
  },

  // Obtener resumen de progreso
  getProgressOverview: async (): Promise<ProgressOverview> => {
    const response = await axios.get('/dashboard/progress');
    return response.data;
  },

  // Marcar workout como completado
  completeWorkout: async (workoutSummary: WorkoutSummary) => {
    const response = await axios.post(
      '/dashboard/workouts/complete',
      workoutSummary
    );
    return response.data;
  },

  // Actualizar preferencias del dashboard
  updatePreferences: async (preferences: {
    showUpcoming: boolean;
    showProgress: boolean;
    showAchievements: boolean;
  }) => {
    const response = await axios.put('/dashboard/preferences', preferences);
    return response.data;
  },

  // Exportar datos del dashboard
  exportDashboardData: async (format: 'csv' | 'json' = 'json') => {
    const response = await axios.get(`/dashboard/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Obtener datos para gráficos específicos
  getChartData: async (
    metric: string,
    timeframe: 'week' | 'month' | 'year'
  ) => {
    const response = await axios.get('/dashboard/charts', {
      params: { metric, timeframe },
    });
    return response.data;
  },
};
