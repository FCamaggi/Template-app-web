import React from 'react';
import { Info, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Training, Set } from '@/features/routines/types';
import QuickSetInput from './QuickSetInput';

interface ExerciseDisplayProps {
  training: Training;
  currentSetIndex: number;
  completedSets: Array<{
    training_id: number;
    set_id: number;
    actual_reps: number;
    actual_weight: number;
    actual_borg?: number;
  }>;
  onSetComplete: (data: {
    weight: number;
    reps: number;
    borg?: number;
  }) => void;
}

export default function ExerciseDisplay({
  training,
  currentSetIndex,
  completedSets,
  onSetComplete,
}: ExerciseDisplayProps) {
  const [showInstructions, setShowInstructions] = React.useState(false);
  const currentSet = training.sets?.[currentSetIndex];

  const isSetCompleted = (setId: number) => {
    return completedSets.some(
      (set) => set.training_id === training.id && set.set_id === setId
    );
  };

  // Obtener el último set completado para sugerencias
  const previousSet = completedSets
    .filter((set) => set.training_id === training.id)
    .slice(-1)[0];

  const getSetTypeColor = (set: Set) => {
    if (isSetCompleted(set.id)) return 'bg-green-100 text-green-800';
    if (set.type === 'warmup') return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">
          {training.exercise?.name}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          <Info className="w-5 h-5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Instructions Panel */}
        {showInstructions && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">Technical Instructions</h4>
            <p className="text-sm text-gray-600">
              {training.exercise?.technical_instructions}
            </p>
            {training.notes && (
              <>
                <h4 className="font-medium pt-2">Notes</h4>
                <p className="text-sm text-gray-600">{training.notes}</p>
              </>
            )}
          </div>
        )}

        {/* Sets Overview */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {training.sets?.map((set, index) => (
            <div
              key={set.id}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${getSetTypeColor(
                set
              )}`}
            >
              {set.type === 'warmup' ? 'W' : index + 1}
              {isSetCompleted(set.id) && (
                <CheckCircle className="inline-block w-4 h-4 ml-1" />
              )}
            </div>
          ))}
        </div>

        {/* Target Info */}
        {currentSet && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Target Reps</p>
              <p className="text-lg font-bold">{currentSet.reps}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">
                {currentSet.weight_type === 'RM_percentage'
                  ? 'Target RM%'
                  : currentSet.weight_type === 'Borg'
                  ? 'Target Borg'
                  : 'Target Weight'}
              </p>
              <p className="text-lg font-bold">
                {currentSet.weight_type === 'RM_percentage'
                  ? `${currentSet.rm_percentage}%`
                  : currentSet.weight_type === 'Borg'
                  ? currentSet.borg_target
                  : `${currentSet.weight_value}kg`}
              </p>
            </div>
          </div>
        )}

        {/* Quick Input */}
        {currentSet && (
          <QuickSetInput
            training={training}
            previousSet={
              previousSet
                ? {
                    weight: previousSet.actual_weight,
                    reps: previousSet.actual_reps,
                    borg: previousSet.actual_borg,
                  }
                : undefined
            }
            onComplete={onSetComplete}
          />
        )}
      </CardContent>
    </Card>
  );
}
