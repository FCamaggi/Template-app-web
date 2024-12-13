import { useState } from 'react';
import { useRoutines } from '@/features/routines/hooks/useRoutines';
import RoutinesList from '@/features/routines/components/RoutinesList';
import RoutineForm from '@/features/routines/components/RoutineForm';
import type { Routine } from '@/features/routines/types';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RoutinesPage() {
  const { user } = useAuth(); // Obtener el usuario autenticado

  const {
    selectedRoutine,
    createRoutine,
    updateRoutine,
    isLoading,
    clearSelection,
  } = useRoutines();
  const [showForm, setShowForm] = useState(false);

  const handleCreateRoutine = async (
    data: Omit<Routine, 'id' | 'creator_id'>
  ) => {
    if (!user?.id) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const routineData = {
        ...data,
        creator_id: user.id,
      };
      await createRoutine(routineData);
      setShowForm(false);
    } catch (error) {
      // Error is handled by the service
      console.error(error);
    }
  };

  const handleUpdateRoutine = async (
    data: Omit<Routine, 'id' | 'creator_id'>
  ) => {
    if (selectedRoutine) {
      try {
        await updateRoutine(selectedRoutine.id, data);
        setShowForm(false);
      } catch (error) {
        // Error is handled by the service
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    clearSelection();
    setShowForm(false);
  };

  if (showForm || selectedRoutine) {
    return (
      <div className="container mx-auto px-4 py-8">
        <RoutineForm
          routine={selectedRoutine || undefined}
          onSubmit={selectedRoutine ? handleUpdateRoutine : handleCreateRoutine}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RoutinesList onCreateNew={() => setShowForm(true)} />
    </div>
  );
}
