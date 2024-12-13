import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { exerciseService } from '../services/exerciseService';
import { ExerciseState, ExerciseFilters, Exercise } from '../types';

const initialState: ExerciseState = {
  exercises: [],
  selectedExercise: null,
  filters: {
    page: 1,
    limit: 10,
  },
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
  isLoading: false,
  error: null,
};

export const fetchExercises = createAsyncThunk(
  'exercises/fetchExercises',
  async (filters: ExerciseFilters) => {
    const response = await exerciseService.getExercises(filters);
    return response;
  }
);

export const createExercise = createAsyncThunk(
  'exercises/createExercise',
  async (exercise: Omit<Exercise, 'id'>) => {
    const response = await exerciseService.createExercise(exercise);
    return response.data;
  }
);

export const updateExercise = createAsyncThunk(
  'exercises/updateExercise',
  async ({ id, exercise }: { id: number; exercise: Partial<Exercise> }) => {
    const response = await exerciseService.updateExercise(id, exercise);
    return response.data;
  }
);

export const deleteExercise = createAsyncThunk(
  'exercises/deleteExercise',
  async (id: number) => {
    await exerciseService.deleteExercise(id);
    return id;
  }
);

const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedExercise: (state, action) => {
      state.selectedExercise = action.payload;
    },
    clearSelectedExercise: (state) => {
      state.selectedExercise = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exercises = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch exercises';
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.exercises.push(action.payload);
      })
      .addCase(updateExercise.fulfilled, (state, action) => {
        const index = state.exercises.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.exercises[index] = action.payload;
        }
      })
      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.exercises = state.exercises.filter(
          (e) => e.id !== action.payload
        );
      });
  },
});

export const { setFilters, setSelectedExercise, clearSelectedExercise } =
  exerciseSlice.actions;
export default exerciseSlice.reducer;
