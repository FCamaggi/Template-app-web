import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { Set, Training } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SetEditorProps {
  training: Training;
  onSetsChange: (sets: Set[]) => void;
}

const SetEditor: React.FC<SetEditorProps> = ({ training, onSetsChange }) => {
  const addSet = (type: 'warmup' | 'work' = 'work') => {
    const newSet: Set = {
      id: Date.now(), // Temporal ID
      training_id: training.id,
      order: (training.sets?.length || 0) + 1,
      type,
      reps: '',
      weight_type: training.exercise?.is_rm_exercise
        ? 'RM_percentage'
        : 'direct_weight',
      weight_value: 0,
      rm_percentage: type === 'warmup' ? 50 : 70,
      rest_time: type === 'warmup' ? 60 : 90,
      borg_target: 7,
    };

    onSetsChange([...(training.sets || []), newSet]);
  };

  const updateSet = (index: number, updates: Partial<Set>) => {
    if (!training.sets) return;

    const updatedSets = training.sets.map((set, i) =>
      i === index ? { ...set, ...updates } : set
    );
    onSetsChange(updatedSets);
  };

  const removeSet = (index: number) => {
    if (!training.sets) return;

    const updatedSets = training.sets
      .filter((_, i) => i !== index)
      .map((set, i) => ({ ...set, order: i + 1 }));
    onSetsChange(updatedSets);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Sets Configuration</span>
          <div className="flex gap-2">
            <button
              onClick={() => addSet('warmup')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Add Warm-up
            </button>
            <button
              onClick={() => addSet('work')}
              className="px-3 py-1 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded-md"
            >
              Add Working Set
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!training.sets || training.sets.length === 0 ? (
          <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-md text-gray-500">
            <AlertCircle className="h-5 w-5" />
            <span>
              No sets configured. Add warm-up or working sets to start.
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {training.sets.map((set, index) => (
              <div
                key={set.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-md"
              >
                <div className="w-20">
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      set.type === 'warmup'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-primary-100 text-primary-700'
                    }`}
                  >
                    {set.type === 'warmup' ? 'Warm-up' : `Set ${index + 1}`}
                  </span>
                </div>

                <div className="flex-1 grid grid-cols-4 gap-4">
                  {/* Reps */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1">Reps</label>
                    <input
                      type="text"
                      value={set.reps}
                      onChange={(e) =>
                        updateSet(index, { reps: e.target.value })
                      }
                      className="w-full px-2 py-1 border rounded"
                      placeholder="e.g., 8-12"
                    />
                  </div>

                  {/* Weight Configuration */}
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 mb-1">Weight</label>
                    <div className="flex gap-2">
                      <select
                        value={set.weight_type}
                        onChange={(e) =>
                          updateSet(index, {
                            weight_type: e.target.value as Set['weight_type'],
                          })
                        }
                        className="w-1/3 px-2 py-1 border rounded"
                      >
                        {training.exercise?.is_rm_exercise && (
                          <option value="RM_percentage">RM%</option>
                        )}
                        <option value="direct_weight">kg</option>
                        {training.exercise?.measurement_type !== 'RM' && (
                          <option value="Borg">Borg</option>
                        )}
                      </select>

                      {set.weight_type === 'RM_percentage' ? (
                        <input
                          type="number"
                          value={set.rm_percentage || ''}
                          onChange={(e) =>
                            updateSet(index, {
                              rm_percentage: Number(e.target.value),
                            })
                          }
                          className="w-2/3 px-2 py-1 border rounded"
                          placeholder="% of 1RM"
                        />
                      ) : set.weight_type === 'direct_weight' ? (
                        <input
                          type="number"
                          value={set.weight_value || ''}
                          onChange={(e) =>
                            updateSet(index, {
                              weight_value: Number(e.target.value),
                            })
                          }
                          className="w-2/3 px-2 py-1 border rounded"
                          placeholder="Weight in kg"
                        />
                      ) : (
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={set.borg_target || ''}
                          onChange={(e) =>
                            updateSet(index, {
                              borg_target: Number(e.target.value),
                            })
                          }
                          className="w-2/3 px-2 py-1 border rounded"
                          placeholder="Borg Scale (1-10)"
                        />
                      )}
                    </div>
                  </div>

                  {/* Rest Time */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1">
                      Rest (sec)
                    </label>
                    <input
                      type="number"
                      value={set.rest_time}
                      onChange={(e) =>
                        updateSet(index, {
                          rest_time: Number(e.target.value),
                        })
                      }
                      className="w-full px-2 py-1 border rounded"
                      placeholder="Rest time"
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeSet(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SetEditor;
