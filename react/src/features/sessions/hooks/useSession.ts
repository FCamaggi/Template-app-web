import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/store';
import { toast } from 'react-hot-toast';
import {
  startSession,
  getActiveSession,
  finishSession,
  setCurrentExercise,
  setCurrentSet,
  startRest,
  updateRestTime,
  endRest,
  addCompletedSet,
} from '../store/sessionSlice';
import { sessionService } from '../services/sessionService';

export const useSession = (routineId?: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    activeSession,
    currentExerciseIndex,
    currentSetIndex,
    isResting,
    restTimeRemaining,
    completedSets,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.sessions);

  // Verificar si hay una sesión activa al montar el componente
  useEffect(() => {
    if (!activeSession) {
      void dispatch(getActiveSession());
    }
  }, [dispatch, activeSession]);

  // Iniciar una nueva sesión
  const handleStartSession = useCallback(async () => {
    if (!routineId) return;

    try {
      await dispatch(startSession(routineId)).unwrap();
      toast.success('Session started successfully!');
    } catch (error) {
      toast.error('Failed to start session');
      navigate('/routines');
    }
  }, [dispatch, navigate, routineId]);

  // Registrar un set completado
  const handleCompleteSet = useCallback(
    async (data: {
      exerciseId: number;
      trainingId: number;
      setId: number;
      weight: number;
      reps: number;
      borgRating?: number;
    }) => {
      if (!activeSession) return;

      try {
        await sessionService.recordProgress({
          exerciseId: data.exerciseId,
          sessionId: activeSession.id,
          data: {
            weight_used: data.weight,
            reps_performed: data.reps,
            borg_rating: data.borgRating,
          },
        });

        dispatch(
          addCompletedSet({
            training_id: data.trainingId,
            set_id: data.setId,
            actual_reps: data.reps,
            actual_weight: data.weight,
            actual_borg: data.borgRating,
            completed_at: new Date().toISOString(),
          })
        );

        // Iniciar tiempo de descanso
        const restTime = 90; // TODO: Hacer configurable
        dispatch(startRest(restTime));

        toast.success('Set completed!');
      } catch (error) {
        toast.error('Failed to record set progress');
      }
    },
    [dispatch, activeSession]
  );

  // Finalizar la sesión
  const handleFinishSession = useCallback(
    async (data?: {
      overallDifficulty?: number;
      energyLevel?: number;
      notes?: string;
      caloriesBurned?: number;
    }) => {
      if (!activeSession) return;

      try {
        await dispatch(
          finishSession({
            sessionId: activeSession.id,
            data: data || {},
          })
        ).unwrap();

        toast.success('Session completed successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to finish session');
      }
    },
    [dispatch, navigate, activeSession]
  );

  // Manejar el temporizador de descanso
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isResting && restTimeRemaining > 0) {
      interval = setInterval(() => {
        if (restTimeRemaining <= 1) {
          dispatch(endRest());
        } else {
          dispatch(updateRestTime(restTimeRemaining - 1));
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [dispatch, isResting, restTimeRemaining]);

  return {
    // Estado
    session: activeSession,
    currentExerciseIndex,
    currentSetIndex,
    isResting,
    restTimeRemaining,
    completedSets,
    isLoading,
    error,

    // Acciones
    startSession: handleStartSession,
    completeSet: handleCompleteSet,
    finishSession: handleFinishSession,
    nextExercise: () => dispatch(setCurrentExercise(currentExerciseIndex + 1)),
    nextSet: () => dispatch(setCurrentSet(currentSetIndex + 1)),
    skipRest: () => dispatch(endRest()),
  };
};
