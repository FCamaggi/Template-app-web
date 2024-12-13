import React from 'react';
import {
  SkipForward,
  ChevronRight,
  CheckCircle,
  StopCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Routine } from '@/features/routines/types';

interface SessionControlsProps {
  routine: Routine;
  currentExerciseIndex: number;
  onNextExercise: () => void;
  onFinishSession: () => void;
  onRequestEndSession: () => void;
  isLastExercise: boolean;
  showConfirmEndDialog?: boolean;
}

export default function SessionControls({
  routine,
  currentExerciseIndex,
  onNextExercise,
  onFinishSession,
  onRequestEndSession,
  isLastExercise,
  showConfirmEndDialog = false,
}: SessionControlsProps) {
  const nextExercise = routine.trainings?.[currentExerciseIndex + 1]?.exercise;

  const [showConfirm, setShowConfirm] = React.useState(showConfirmEndDialog);

  return (
    <Card>
      <CardContent className="p-4">
        {showConfirm ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">End session early?</p>
            </div>
            <p className="text-sm text-gray-600">
              Your progress will be saved, but the session will be marked as
              incomplete.
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={onFinishSession}
                className="flex-1"
              >
                <StopCircle className="w-4 h-4 mr-2" />
                End Session
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowConfirm(false)}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress Info */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Exercise {currentExerciseIndex + 1} of{' '}
                {routine.trainings?.length}
              </div>
              <Button
                variant="ghost"
                onClick={onRequestEndSession}
                className="text-gray-500 hover:text-red-600"
              >
                <StopCircle className="w-4 h-4 mr-2" />
                End Session
              </Button>
            </div>

            {/* Navigation Controls */}
            {!isLastExercise ? (
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={onNextExercise}
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip Exercise
                </Button>
                <Button className="flex-1 group" onClick={onNextExercise}>
                  <span className="flex-1">Next: {nextExercise?.name}</span>
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : (
              <Button className="w-full" onClick={onFinishSession}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Workout
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
