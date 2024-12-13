import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from '@/features/sessions/hooks/useSession';
import SessionTimer from '@/features/sessions/components/SessionTimer';
import ExerciseDisplay from '@/features/sessions/components/ExerciseDisplay';
import SessionControls from '@/features/sessions/components/SessionControls';
import { AlertCircle, StopCircle } from 'lucide-react';
import { useOffline } from '@/features/sessions/hooks/useOffline';
import { offlineService } from '@/features/sessions/services/offlineService';
import OfflineIndicator from '@/features/sessions/components/OfflineIndicator';

export default function ActiveSessionPage() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const {
    session,
    currentExerciseIndex,
    currentSetIndex,
    isResting,
    restTimeRemaining,
    completedSets,
    isLoading,
    startSession,
    completeSet,
    finishSession,
    nextExercise,
    skipRest,
  } = useSession(routineId ? parseInt(routineId) : undefined);

  const { isOnline, saveSetOffline } = useOffline();
  const [showEndDialog, setShowEndDialog] = useState(false);

  // Cargar sesión desde almacenamiento local si existe
  useEffect(() => {
    if (!session && !isLoading) {
      const savedSession = offlineService.getActiveSession();
      if (savedSession) {
        // Restaurar sesión guardada
      } else if (routineId) {
        startSession();
      }
    }
  }, [session, isLoading, routineId, startSession]);

  // Guardar sesión en almacenamiento local cuando cambie
  useEffect(() => {
    if (session) {
      offlineService.saveActiveSession(session);
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session || !session.routine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold mb-4">No active session found</h2>
        <Button onClick={() => navigate('/routines')}>Back to Routines</Button>
      </div>
    );
  }

  const currentTraining = session.routine.trainings?.[currentExerciseIndex];
  const isLastExercise =
    currentExerciseIndex === (session.routine.trainings?.length ?? 0) - 1;

  const handleSetComplete = async (data: {
    weight: number;
    reps: number;
    borg?: number;
  }) => {
    if (!session || !session.routine?.trainings?.[currentExerciseIndex]) return;

    const training = session.routine.trainings[currentExerciseIndex];
    const setData = {
      exerciseId: training.exercise_id,
      trainingId: training.id,
      setId: currentSetIndex,
      weight: data.weight,
      reps: data.reps,
      borgRating: data.borg,
      sessionId: session.id, // Agregar sessionId aquí
    };

    if (isOnline) {
      await completeSet(setData);
    } else {
      saveSetOffline(setData);
    }
  };

  const [sessionEndData, setSessionEndData] = useState({
    overallDifficulty: 7,
    energyLevel: 6,
    notes: '',
  });

  const handleEndSession = () => {
    if (showEndDialog) {
      finishSession(sessionEndData);
    } else {
      setShowEndDialog(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header con información de la sesión */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{session.routine.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda: Timer y controles */}
        <div className="space-y-6">
          {isResting ? (
            <SessionTimer
              duration={restTimeRemaining}
              onComplete={skipRest}
              autoStart={true}
            />
          ) : currentTraining ? (
            <ExerciseDisplay
              training={currentTraining}
              currentSetIndex={currentSetIndex}
              completedSets={completedSets}
              onSetComplete={handleSetComplete}
            />
          ) : null}
        </div>

        {/* Columna derecha: Información y navegación */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Workout Progress</div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (currentExerciseIndex /
                          (session.routine.trainings?.length ?? 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <SessionControls
            routine={session.routine}
            currentExerciseIndex={currentExerciseIndex}
            onNextExercise={nextExercise}
            onFinishSession={finishSession}
            onRequestEndSession={handleEndSession}
            isLastExercise={isLastExercise}
            showConfirmEndDialog={showEndDialog}
          />
        </div>
      </div>

      {/* Diálogo de confirmación para finalizar la sesión */}
      {showEndDialog && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">End session early?</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">
                Overall Difficulty (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sessionEndData.overallDifficulty}
                onChange={(e) =>
                  setSessionEndData((prev) => ({
                    ...prev,
                    overallDifficulty: parseInt(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="text-sm text-center">
                {sessionEndData.overallDifficulty}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Energy Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sessionEndData.energyLevel}
                onChange={(e) =>
                  setSessionEndData((prev) => ({
                    ...prev,
                    energyLevel: parseInt(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="text-sm text-center">
                {sessionEndData.energyLevel}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Notes (optional)</label>
              <textarea
                value={sessionEndData.notes}
                onChange={(e) =>
                  setSessionEndData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                className="w-full mt-1 text-sm"
                placeholder="Why are you ending the session early?"
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleEndSession}
              className="flex-1"
            >
              <StopCircle className="w-4 h-4 mr-2" />
              End Session
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowEndDialog(false)}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
      {/* Indicador de estado offline */}
      <OfflineIndicator />
    </div>
  );
}
