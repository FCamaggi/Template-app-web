import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  fetchExerciseProgress,
  fetchExerciseStats,
  exportProgress,
  setFilters,
  setSelectedExercise,
  clearProgress,
} from '../store/progressSlice';
import { ProgressFilters } from '../types';

export const useProgress = (exerciseId?: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const { progressData, stats, filters, selectedExerciseId, isLoading, error } =
    useSelector((state: RootState) => state.progress);

  // Cargar progreso cuando cambia el ejercicio
  useEffect(() => {
    if (exerciseId) {
      dispatch(setSelectedExercise(exerciseId));
      loadProgress();
    }
    return () => {
      dispatch(clearProgress());
    };
  }, [exerciseId]);

  // Cargar progreso con filtros
  const loadProgress = useCallback(
    async (newFilters?: Partial<ProgressFilters>) => {
      if (!selectedExerciseId) return;

      const updatedFilters = {
        ...filters,
        ...newFilters,
        exerciseId: selectedExerciseId,
      };

      dispatch(setFilters(updatedFilters));
      await dispatch(fetchExerciseProgress(updatedFilters));
    },
    [dispatch, filters, selectedExerciseId]
  );

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    if (!selectedExerciseId) return;
    await dispatch(fetchExerciseStats(selectedExerciseId));
  }, [dispatch, selectedExerciseId]);

  // Exportar datos
  const handleExport = useCallback(
    async (format: 'csv' | 'json') => {
      if (!selectedExerciseId) return;
      await dispatch(
        exportProgress({ exerciseId: selectedExerciseId, format })
      );
    },
    [dispatch, selectedExerciseId]
  );

  // Actualizar filtros
  const updateFilters = useCallback(
    (newFilters: Partial<ProgressFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  return {
    progressData,
    stats,
    filters,
    selectedExerciseId,
    isLoading,
    error,
    loadProgress,
    loadStats,
    exportData: handleExport,
    updateFilters,
  };
};
