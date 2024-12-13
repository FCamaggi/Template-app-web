import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '../services/progressService';
import { ProgressState, ProgressFilters } from '../types';
import { toast } from 'react-hot-toast';

const initialState: ProgressState = {
  progressData: [],
  stats: null,
  filters: {
    limit: 10,
  },
  selectedExerciseId: null,
  isLoading: false,
  error: null,
};

// Thunks
export const fetchExerciseProgress = createAsyncThunk(
  'progress/fetchExerciseProgress',
  async (filters: ProgressFilters) => {
    try {
      const response = await progressService.getExerciseProgress(filters);
      return response;
    } catch (error) {
      toast.error('Failed to fetch exercise progress');
      throw error;
    }
  }
);

export const fetchExerciseStats = createAsyncThunk(
  'progress/fetchExerciseStats',
  async (exerciseId: number) => {
    try {
      const response = await progressService.getExerciseStats(exerciseId);
      return response;
    } catch (error) {
      toast.error('Failed to fetch exercise statistics');
      throw error;
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'progress/fetchDashboardStats',
  async () => {
    try {
      const response = await progressService.getDashboardStats();
      return response;
    } catch (error) {
      toast.error('Failed to fetch dashboard statistics');
      throw error;
    }
  }
);

export const exportProgress = createAsyncThunk(
  'progress/exportProgress',
  async ({
    exerciseId,
    format,
  }: {
    exerciseId: number;
    format: 'csv' | 'json';
  }) => {
    try {
      const data = await progressService.exportProgress(exerciseId, format);

      // Crear un objeto URL para la descarga
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `progress-exercise-${exerciseId}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Progress data exported successfully');
    } catch (error) {
      toast.error('Failed to export progress data');
      throw error;
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedExercise: (state, action) => {
      state.selectedExerciseId = action.payload;
    },
    clearProgress: (state) => {
      state.progressData = [];
      state.stats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchExerciseProgress
      .addCase(fetchExerciseProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExerciseProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progressData = action.payload.data;
        state.stats = action.payload.stats;
      })
      .addCase(fetchExerciseProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch progress';
      })
      // fetchExerciseStats
      .addCase(fetchExerciseStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchExerciseStats.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export const { setFilters, setSelectedExercise, clearProgress } =
  progressSlice.actions;

export default progressSlice.reducer;
