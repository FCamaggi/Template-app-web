import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '../services/dashboardService';
import { DashboardState } from '../types';

const initialState: DashboardState = {
  stats: {
    workoutsCompleted: 0,
    currentStreak: 0,
    totalTime: 0,
    achievements: 0,
    monthlyGoalProgress: 0,
    averageWorkoutTime: 0,
  },
  recentActivity: [],
  upcomingWorkouts: [],
  progress: {
    volumeByMuscleGroup: [],
    recentPRs: [],
    monthlyProgress: [],
  },
  isLoading: false,
  error: null,
};

// Thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    const response = await dashboardService.getDashboardData();
    return response;
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchActivity',
  async (limit: number) => {
    const response = await dashboardService.getRecentActivity(limit);
    return response;
  }
);

export const fetchUpcomingWorkouts = createAsyncThunk(
  'dashboard/fetchUpcoming',
  async () => {
    const response = await dashboardService.getUpcomingWorkouts();
    return response;
  }
);

export const fetchProgressOverview = createAsyncThunk(
  'dashboard/fetchProgress',
  async () => {
    const response = await dashboardService.getProgressOverview();
    return response;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (_state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDashboardData
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.recentActivity = action.payload.recentActivity;
        state.upcomingWorkouts = action.payload.upcomingWorkouts;
        state.progress = action.payload.progress;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load dashboard data';
      })
      // fetchRecentActivity
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.recentActivity = action.payload;
      })
      // fetchUpcomingWorkouts
      .addCase(fetchUpcomingWorkouts.fulfilled, (state, action) => {
        state.upcomingWorkouts = action.payload;
      })
      // fetchProgressOverview
      .addCase(fetchProgressOverview.fulfilled, (state, action) => {
        state.progress = action.payload;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
