import { useState } from 'react';
import { Plus, Minus, Save, History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Training } from '@/features/routines/types';

interface QuickSetInputProps {
  training: Training;
  previousSet?: {
    weight: number;
    reps: number;
    borg?: number;
  };
  onComplete: (data: { weight: number; reps: number; borg?: number }) => void;
}

export default function QuickSetInput({
  training,
  previousSet,
  onComplete,
}: QuickSetInputProps) {
  const [weight, setWeight] = useState(previousSet?.weight || 0);
  const [reps, setReps] = useState(previousSet?.reps || 0);
  const [borg, setBorg] = useState(previousSet?.borg || 7);

  // Incrementos predefinidos
  const WEIGHT_INCREMENT = 2.5;
  const REPS_INCREMENT = 1;
  const BORG_INCREMENT = 1;

  // Ajustadores rápidos
  const adjustWeight = (increment: boolean) => {
    setWeight((prev) =>
      Number(
        (prev + (increment ? WEIGHT_INCREMENT : -WEIGHT_INCREMENT)).toFixed(1)
      )
    );
  };

  const adjustReps = (increment: boolean) => {
    setReps((prev) => prev + (increment ? REPS_INCREMENT : -REPS_INCREMENT));
  };

  const adjustBorg = (increment: boolean) => {
    setBorg((prev) =>
      Math.min(
        Math.max(prev + (increment ? BORG_INCREMENT : -BORG_INCREMENT), 1),
        10
      )
    );
  };

  // Sugerencias basadas en el historial
  const suggestions = [
    {
      weight: previousSet?.weight || 0,
      reps: previousSet?.reps || 0,
      label: 'Previous',
    },
    {
      weight: previousSet?.weight ? previousSet.weight + 2.5 : 0,
      reps: previousSet?.reps || 0,
      label: 'Increase Weight',
    },
    {
      weight: previousSet?.weight || 0,
      reps: previousSet?.reps ? previousSet.reps + 1 : 0,
      label: 'Increase Reps',
    },
  ];

  const handleComplete = () => {
    onComplete({
      weight,
      reps,
      ...(training.exercise?.measurement_type !== 'RM' && { borg }),
    });

    // Reset después de completar
    if (!previousSet) {
      setWeight(0);
      setReps(0);
      setBorg(7);
    }
  };

  const useSuggestion = (suggestion: (typeof suggestions)[0]) => {
    setWeight(suggestion.weight);
    setReps(suggestion.reps);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Input</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Sugerencias */}
          {previousSet && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={() => useSuggestion(suggestion)}
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  <History className="w-4 h-4" />
                  {suggestion.label}
                </Button>
              ))}
            </div>
          )}

          {/* Weight Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustWeight(false)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-24 text-center p-2 border rounded-md"
                step={WEIGHT_INCREMENT}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustWeight(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Reps Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Reps</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustReps(false)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-24 text-center p-2 border rounded-md"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustReps(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Borg Scale (si es necesario) */}
          {training.exercise?.measurement_type !== 'RM' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Intensity (Borg 1-10)
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustBorg(false)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <input
                  type="number"
                  value={borg}
                  onChange={(e) => setBorg(Number(e.target.value))}
                  className="w-24 text-center p-2 border rounded-md"
                  min="1"
                  max="10"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustBorg(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Complete Button */}
          <Button
            onClick={handleComplete}
            className="w-full"
            disabled={weight === 0 || reps === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Complete Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
