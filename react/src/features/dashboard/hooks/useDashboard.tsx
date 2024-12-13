import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

interface DashboardData {
  stats: {
    workoutsCompleted: number;
    currentStreak: number;
    totalTime: number;
    achievements: number;
  };
  recentLogs?: {
    date: string;
    duration: number;
    routineName: string;
  }[];
}

export function useDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    stats: {
      workoutsCompleted: 0,
      currentStreak: 0,
      totalTime: 0,
      achievements: 0,
    },
    recentLogs: [],
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch dashboard data
        const response = await dashboardService.getDashboardData();
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard data'
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboardData();
  }, []);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await dashboardService.getDashboardData();
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to refresh dashboard data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    stats: data.stats,
    recentLogs: data.recentLogs,
    refreshData,
  };
}
