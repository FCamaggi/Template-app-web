// src/features/exercises/hooks/useExercises.ts
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  fetchExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  setFilters,
  setSelectedExercise,
  clearSelectedExercise,
} from '../store/exerciseSlice';
import { Exercise, ExerciseFilters } from '../types';
import { toast } from 'react-hot-toast';

export const useExercises = () => {
  const dispatch = useDispatch();
  const { exercises, selectedExercise, filters, pagination, isLoading, error } =
    useSelector((state: RootState) => state.exercises);

  // Cargar ejercicios
  const loadExercises = useCallback(
    async (newFilters?: Partial<ExerciseFilters>) => {
      try {
        const updatedFilters = { ...filters, ...newFilters };
        dispatch(setFilters(updatedFilters));
        (await dispatch(
          fetchExercises(updatedFilters) as any
        ).unwrap()) as Exercise[];
      } catch (error) {
        toast.error('Failed to load exercises');
      }
    },
    [dispatch, filters]
  );

  // Crear ejercicio
  const handleCreateExercise = async (exerciseData: Omit<Exercise, 'id'>) => {
    try {
      (await dispatch(
        createExercise(exerciseData) as any
      ).unwrap()) as Exercise;
      toast.success('Exercise created successfully');
      loadExercises();
    } catch (error) {
      toast.error('Failed to create exercise');
      throw error;
    }
  };

  // Actualizar ejercicio
  const handleUpdateExercise = async (
    id: number,
    exerciseData: Partial<Exercise>
  ) => {
    try {
      await dispatch(
        updateExercise({ id, exercise: exerciseData }) as any
      ).unwrap();
      toast.success('Exercise updated successfully');
      loadExercises();
    } catch (error) {
      toast.error('Failed to update exercise');
      throw error;
    }
  };

  // Eliminar ejercicio
  const handleDeleteExercise = async (id: number) => {
    try {
      await dispatch(deleteExercise(id) as any).unwrap();
      toast.success('Exercise deleted successfully');
      loadExercises();
    } catch (error) {
      toast.error('Failed to delete exercise');
      throw error;
    }
  };

  // Seleccionar ejercicio
  const selectExercise = (exercise: Exercise | null) => {
    dispatch(setSelectedExercise(exercise));
  };

  // Limpiar selección
  const clearSelection = () => {
    dispatch(clearSelectedExercise());
  };

  // Cambiar filtros
  const updateFilters = (newFilters: Partial<ExerciseFilters>) => {
    dispatch(setFilters({ ...filters, ...newFilters }));
  };

  // Cargar ejercicios al montar el componente
  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  return {
    exercises,
    selectedExercise,
    filters,
    pagination,
    isLoading,
    error,
    loadExercises,
    createExercise: handleCreateExercise,
    updateExercise: handleUpdateExercise,
    deleteExercise: handleDeleteExercise,
    selectExercise,
    clearSelection,
    updateFilters,
  };
};
