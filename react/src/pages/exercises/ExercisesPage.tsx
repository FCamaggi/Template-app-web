// src/pages/exercises/ExercisesPage.tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useExercises } from '@/features/exercises/hooks/useExercises';
import ExerciseTable from '@/features/exercises/components/ExerciseTable';
import ExerciseForm from '@/features/exercises/components/ExerciseForm';
import { Exercise as ExerciseType } from '@/features/exercises/types';

const ExercisesPage = () => {
  const {
    exercises,
    isLoading,
    filters,
    loadExercises,
    createExercise,
    updateExercise,
    selectExercise,
    selectedExercise,
    clearSelection,
  } = useExercises();

  const [showForm, setShowForm] = useState(false);

  const handleFilterChange = async (newFilters: typeof filters) => {
    await loadExercises(newFilters);
  };

  const handleCreateExercise = async (data: Omit<ExerciseType, 'id'>) => {
    await createExercise(data);
    setShowForm(false);
  };

  const handleUpdateExercise = async (data: Omit<ExerciseType, 'id'>) => {
    if (selectedExercise) {
      await updateExercise(selectedExercise.id, data);
      clearSelection();
      setShowForm(false);
    }
  };

  const handleExerciseClick = (exercise: ExerciseType) => {
    selectExercise(exercise);
    setShowForm(true);
  };

  const handleCancel = () => {
    clearSelection();
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            {selectedExercise ? 'Edit Exercise' : 'Create Exercise'}
          </h1>
        </div>
        <ExerciseForm
          exercise={selectedExercise || undefined}
          onSubmit={
            selectedExercise ? handleUpdateExercise : handleCreateExercise
          }
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Exercises</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Add Exercise
        </button>
      </div>

      <ExerciseTable
        exercises={exercises}
        isLoading={isLoading}
        onExerciseClick={handleExerciseClick}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default ExercisesPage;
