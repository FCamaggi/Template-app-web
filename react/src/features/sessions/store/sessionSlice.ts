import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sessionService } from '../services/sessionService';
import { SessionState } from '../types';

const initialState: SessionState = {
  activeSession: null,
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  isResting: false,
  restTimeRemaining: 0,
  completedSets: [],
  isLoading: false,
  error: null,
};

export const startSession = createAsyncThunk(
  'sessions/start',
  async (routineId: number) => {
    const response = await sessionService.startSession(routineId);
    return response.data;
  }
);

export const getActiveSession = createAsyncThunk(
  'sessions/getActive',
  async () => {
    const response = await sessionService.getActiveSession();
    return response.data;
  }
);

export const finishSession = createAsyncThunk(
  'sessions/finish',
  async ({
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
    const response = await sessionService.finishSession({ sessionId, data });
    return response;
  }
);

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setCurrentExercise(state, action) {
      state.currentExerciseIndex = action.payload;
      state.currentSetIndex = 0;
      state.isResting = false;
    },
    setCurrentSet(state, action) {
      state.currentSetIndex = action.payload;
      state.isResting = false;
    },
    startRest(state, action: { payload: number }) {
      state.isResting = true;
      state.restTimeRemaining = action.payload;
    },
    updateRestTime(state, action) {
      state.restTimeRemaining = action.payload;
    },
    endRest(state) {
      state.isResting = false;
      state.restTimeRemaining = 0;
    },
    addCompletedSet(state, action) {
      state.completedSets.push(action.payload);
    },
    resetSession(_state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSession = action.payload;
        state.currentExerciseIndex = 0;
        state.currentSetIndex = 0;
        state.completedSets = [];
      })
      .addCase(startSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to start session';
      })
      .addCase(getActiveSession.fulfilled, (state, action) => {
        state.activeSession = action.payload;
      })
      .addCase(finishSession.fulfilled, (_state) => {
        return initialState;
      });
  },
});

export const {
  setCurrentExercise,
  setCurrentSet,
  startRest,
  updateRestTime,
  endRest,
  addCompletedSet,
  resetSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
