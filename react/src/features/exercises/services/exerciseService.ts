import axios from '@/lib/axios';
import { Exercise, ExerciseFilters } from '../types';

export const exerciseService = {
  getExercises: async (params: ExerciseFilters) => {
    const response = await axios.get('/exercises', { params });
    return response.data;
  },

  getExercise: async (id: number) => {
    const response = await axios.get(`/exercises/${id}`);
    return response.data;
  },

  createExercise: async (exercise: Omit<Exercise, 'id'>) => {
    const response = await axios.post('/exercises', exercise);
    return response.data;
  },

  updateExercise: async (id: number, exercise: Partial<Exercise>) => {
    const response = await axios.put(`/exercises/${id}`, exercise);
    return response.data;
  },

  deleteExercise: async (id: number) => {
    const response = await axios.delete(`/exercises/${id}`);
    return response.data;
  },
};
