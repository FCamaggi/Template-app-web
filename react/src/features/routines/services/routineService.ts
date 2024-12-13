import axios from '@/lib/axios';
import { Routine, RoutineFilters, Training, Set } from '../types';

export const routineService = {
  getRoutines: async (params: RoutineFilters) => {
    const response = await axios.get('/routines', { params });
    return response.data;
  },

  getRoutine: async (id: number) => {
    const response = await axios.get(`/routines/${id}`);
    return response.data;
  },

  createRoutine: async (routine: Omit<Routine, 'id'>) => {
    const response = await axios.post('/routines', routine);
    return response.data;
  },

  updateRoutine: async (id: number, routine: Partial<Routine>) => {
    const response = await axios.put(`/routines/${id}`, routine);
    return response.data;
  },

  deleteRoutine: async (id: number) => {
    const response = await axios.delete(`/routines/${id}`);
    return response.data;
  },

  duplicateRoutine: async (id: number) => {
    const response = await axios.post(`/routines/${id}/duplicate`);
    return response.data;
  },

  // Training management
  getTrainings: async (routineId: number) => {
    const response = await axios.get(`/training/routine/${routineId}`);
    return response.data;
  },

  createTraining: async (training: Omit<Training, 'id'>) => {
    const response = await axios.post('/training', training);
    return response.data;
  },

  updateTraining: async (id: number, training: Partial<Training>) => {
    const response = await axios.put(`/training/${id}`, training);
    return response.data;
  },

  deleteTraining: async (id: number) => {
    const response = await axios.delete(`/training/${id}`);
    return response.data;
  },

  // Sets management
  getSets: async (trainingId: number) => {
    const response = await axios.get(`/sets/training/${trainingId}`);
    return response.data;
  },

  createSets: async (data: {
    training_id: number;
    sets: Omit<Set, 'id'>[];
  }) => {
    const response = await axios.post('/sets/bulk', data);
    return response.data;
  },

  updateSet: async (id: number, set: Partial<Set>) => {
    const response = await axios.put(`/sets/${id}`, set);
    return response.data;
  },

  deleteSet: async (id: number) => {
    const response = await axios.delete(`/sets/${id}`);
    return response.data;
  },
};
