import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, GripHorizontal, X, Settings } from 'lucide-react';
import { Exercise } from '@/features/exercises/types';
import { Training } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { useExercises } from '@/features/exercises/hooks/useExercises';
import TrainingSettings from './TrainingSettings';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface TrainingEditorProps {
  trainings: Training[];
  onTrainingsChange: (trainings: Training[]) => void;
}

const TrainingEditor: React.FC<TrainingEditorProps> = ({
  trainings,
  onTrainingsChange,
}) => {
  const { exercises } = useExercises();
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(trainings);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for each item
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    onTrainingsChange(updatedItems);
  };

  const addExercise = (exercise: Exercise) => {
    const newTraining: Training = {
      id: Date.now(), // Temporary ID, will be replaced by backend
      routine_id: 0, // Will be set when saving
      exercise_id: exercise.id,
      order: trainings.length + 1,
      training_type: 'strength',
      unilateral: false,
      exercise: exercise,
      sets: [],
    };

    onTrainingsChange([...trainings, newTraining]);
    setShowExerciseSelector(false);
  };

  const removeTraining = (trainingId: number) => {
    const updatedTrainings = trainings
      .filter((t) => t.id !== trainingId)
      .map((t, index) => ({
        ...t,
        order: index + 1,
      }));
    onTrainingsChange(updatedTrainings);
  };

  const updateTraining = (training: Training) => {
    const updatedTrainings = trainings.map((t) =>
      t.id === training.id ? training : t
    );
    onTrainingsChange(updatedTrainings);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Exercises</h3>
        <Button
          onClick={() => setShowExerciseSelector(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Exercise
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="trainings">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {trainings.map((training, index) => (
                <Draggable
                  key={training.id}
                  draggableId={training.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab"
                            >
                              <GripHorizontal className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {training.exercise?.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {training.sets?.length || 0} sets •{' '}
                                {training.training_type}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => setSelectedTraining(training)}
                                variant="ghost"
                                size="sm"
                              >
                                <Settings className="h-5 w-5 text-gray-600" />
                              </Button>
                              <Button
                                onClick={() => removeTraining(training.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                              >
                                <X className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <ExerciseSelector
          exercises={exercises}
          onSelect={addExercise}
          onClose={() => setShowExerciseSelector(false)}
        />
      )}

      {/* Training Settings Modal */}
      {selectedTraining && (
        <TrainingSettings
          training={selectedTraining}
          onSave={(updatedTraining) => {
            updateTraining(updatedTraining);
            setSelectedTraining(null);
          }}
          onClose={() => setSelectedTraining(null)}
        />
      )}
    </div>
  );
};

// Modal para seleccionar ejercicios
const ExerciseSelector: React.FC<{
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}> = ({ exercises, onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      !selectedType || exercise.exercise_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Select Exercise</DialogTitle>
      <DialogContent>
        <div className="space-y-4">
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
          </Select>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredExercises.map((exercise) => (
              <Button
                key={exercise.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onSelect(exercise);
                  onClose();
                }}
              >
                <div className="text-left">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-sm text-gray-500">
                    {exercise.main_muscle_group} • {exercise.exercise_type}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingEditor;
