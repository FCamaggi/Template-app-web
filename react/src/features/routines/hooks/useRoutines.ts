import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  fetchRoutines,
  fetchRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  duplicateRoutine,
  setFilters,
  setSelectedRoutine,
  clearSelectedRoutine,
} from '../store/routineSlice';
import { Routine, RoutineFilters } from '../types';
import { toast } from 'react-hot-toast';

export const useRoutines = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { routines, selectedRoutine, filters, pagination, isLoading, error } =
    useSelector((state: RootState) => state.routines);

  // Cargar rutinas con filtros
  const loadRoutines = useCallback(
    async (newFilters?: Partial<RoutineFilters>) => {
      try {
        const updatedFilters = { ...filters, ...newFilters };
        dispatch(setFilters(updatedFilters));
        await dispatch(fetchRoutines(updatedFilters)).unwrap();
      } catch (error) {
        toast.error('Failed to load routines');
      }
    },
    [dispatch, filters]
  );

  // Cargar una rutina específica
  const loadRoutine = useCallback(
    async (id: number) => {
      try {
        await dispatch(fetchRoutineById(id)).unwrap();
      } catch (error) {
        toast.error('Failed to load routine details');
        throw error;
      }
    },
    [dispatch]
  );

  // Crear nueva rutina
  const handleCreateRoutine = async (routineData: Omit<Routine, 'id'>) => {
    try {
      await dispatch(createRoutine(routineData)).unwrap();
      toast.success('Routine created successfully');
      loadRoutines(); // Recargar lista
    } catch (error) {
      toast.error('Failed to create routine');
      throw error;
    }
  };

  // Actualizar rutina
  const handleUpdateRoutine = async (
    id: number,
    routineData: Partial<Routine>
  ) => {
    try {
      await dispatch(updateRoutine({ id, routine: routineData })).unwrap();
      toast.success('Routine updated successfully');
      loadRoutines(); // Recargar lista
    } catch (error) {
      toast.error('Failed to update routine');
      throw error;
    }
  };

  // Eliminar rutina
  const handleDeleteRoutine = async (id: number) => {
    try {
      await dispatch(deleteRoutine(id)).unwrap();
      toast.success('Routine deleted successfully');
      loadRoutines(); // Recargar lista
    } catch (error) {
      toast.error('Failed to delete routine');
      throw error;
    }
  };

  // Duplicar rutina
  const handleDuplicateRoutine = async (id: number) => {
    try {
      await dispatch(duplicateRoutine(id)).unwrap();
      toast.success('Routine duplicated successfully');
      loadRoutines(); // Recargar lista
    } catch (error) {
      toast.error('Failed to duplicate routine');
      throw error;
    }
  };

  // Seleccionar rutina para edición
  const selectRoutine = (routine: Routine | null) => {
    dispatch(setSelectedRoutine(routine));
  };

  // Limpiar selección
  const clearSelection = () => {
    dispatch(clearSelectedRoutine());
  };

  // Actualizar filtros
  const updateFilters = (newFilters: Partial<RoutineFilters>) => {
    dispatch(setFilters({ ...filters, ...newFilters }));
  };

  // Cargar rutinas al montar el componente
  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  // Limpiar selección al desmontar
  useEffect(() => {
    return () => {
      clearSelection();
    };
  }, []);

  return {
    // Estado
    routines,
    selectedRoutine,
    filters,
    pagination,
    isLoading,
    error,

    // Acciones
    loadRoutines,
    loadRoutine,
    createRoutine: handleCreateRoutine,
    updateRoutine: handleUpdateRoutine,
    deleteRoutine: handleDeleteRoutine,
    duplicateRoutine: handleDuplicateRoutine,
    selectRoutine,
    clearSelection,
    updateFilters,
  };
};
