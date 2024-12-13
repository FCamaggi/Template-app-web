import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import exerciseReducer from '@/features/exercises/store/exerciseSlice';
import routineReducer from '@/features/routines/store/routineSlice';
import sessionReducer from '@/features/sessions/store/sessionSlice';
import progressReducer from '@/features/progress/store/progressSlice';
import dashboardReducer from '@/features/dashboard/store/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exerciseReducer,
    routines: routineReducer,
    sessions: sessionReducer,
    progress: progressReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
