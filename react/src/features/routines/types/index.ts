import { Exercise } from '../../exercises/types';

export type RoutineType =
  | 'full_body'
  | 'split'
  | 'upper_lower'
  | 'push_pull_legs';
export type RoutineDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Routine {
  id: number;
  name: string;
  description: string;
  type: RoutineType;
  difficulty: RoutineDifficulty;
  estimated_time: number;
  creator_id: number;
  is_template: boolean;
  mesocycle_type?: string;
  microcycle_type?: string;
  warmup_description?: string;
  cooldown_description?: string;
  notes?: string;
  trainings?: Training[];
}

export interface Training {
  id: number;
  routine_id: number;
  exercise_id: number;
  order: number;
  training_type: 'strength' | 'hypertrophy' | 'endurance' | 'power';
  notes?: string;
  tempo?: string; // formato "X-X-X-X"
  unilateral: boolean;
  superset_with?: number; // ID del training con el que forma superset
  exercise?: Exercise; // Relación con Exercise
  sets?: Set[];
}

export interface Set {
  id: number;
  training_id: number;
  order: number;
  type: 'warmup' | 'work';
  reps: string;
  weight_type: 'RM_percentage' | 'direct_weight' | 'Borg';
  weight_value?: number;
  rm_percentage?: number;
  borg_target?: number;
  rest_time: number;
  completed?: boolean;
  actual_reps?: number;
  actual_weight?: number;
  actual_borg?: number;
}

export interface RoutineFilters {
  page?: number;
  limit?: number;
  type?: RoutineType;
  difficulty?: RoutineDifficulty;
  is_template?: boolean;
  search?: string;
}

export interface RoutineState {
  routines: Routine[];
  selectedRoutine: Routine | null;
  filters: RoutineFilters;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  isLoading: boolean;
  error: string | null;
}
