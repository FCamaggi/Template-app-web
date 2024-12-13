import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { routineService } from '../services/routineService';
import { RoutineState, RoutineFilters, Routine } from '../types';

const initialState: RoutineState = {
  routines: [],
  selectedRoutine: null,
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

// Thunks
export const fetchRoutines = createAsyncThunk(
  'routines/fetchRoutines',
  async (filters: RoutineFilters) => {
    const response = await routineService.getRoutines(filters);
    return response;
  }
);

export const fetchRoutineById = createAsyncThunk(
  'routines/fetchRoutineById',
  async (id: number) => {
    const response = await routineService.getRoutine(id);
    return response.data;
  }
);

export const createRoutine = createAsyncThunk(
  'routines/createRoutine',
  async (routine: Omit<Routine, 'id'>) => {
    const response = await routineService.createRoutine(routine);
    return response.data;
  }
);

export const updateRoutine = createAsyncThunk(
  'routines/updateRoutine',
  async ({ id, routine }: { id: number; routine: Partial<Routine> }) => {
    const response = await routineService.updateRoutine(id, routine);
    return response.data;
  }
);

export const deleteRoutine = createAsyncThunk(
  'routines/deleteRoutine',
  async (id: number) => {
    await routineService.deleteRoutine(id);
    return id;
  }
);

export const duplicateRoutine = createAsyncThunk(
  'routines/duplicateRoutine',
  async (id: number) => {
    const response = await routineService.duplicateRoutine(id);
    return response.data;
  }
);

const routineSlice = createSlice({
  name: 'routines',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedRoutine: (state, action) => {
      state.selectedRoutine = action.payload;
    },
    clearSelectedRoutine: (state) => {
      state.selectedRoutine = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchRoutines
      .addCase(fetchRoutines.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoutines.fulfilled, (state, action) => {
        state.isLoading = false;
        state.routines = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRoutines.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch routines';
      })
      // fetchRoutineById
      .addCase(fetchRoutineById.fulfilled, (state, action) => {
        state.selectedRoutine = action.payload;
      })
      // createRoutine
      .addCase(createRoutine.fulfilled, (state, action) => {
        state.routines.push(action.payload);
      })
      // updateRoutine
      .addCase(updateRoutine.fulfilled, (state, action) => {
        const index = state.routines.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.routines[index] = action.payload;
        }
        if (state.selectedRoutine?.id === action.payload.id) {
          state.selectedRoutine = action.payload;
        }
      })
      // deleteRoutine
      .addCase(deleteRoutine.fulfilled, (state, action) => {
        state.routines = state.routines.filter((r) => r.id !== action.payload);
        if (state.selectedRoutine?.id === action.payload) {
          state.selectedRoutine = null;
        }
      })
      // duplicateRoutine
      .addCase(duplicateRoutine.fulfilled, (state, action) => {
        state.routines.push(action.payload);
      });
  },
});

export const { setFilters, setSelectedRoutine, clearSelectedRoutine } =
  routineSlice.actions;

export default routineSlice.reducer;
