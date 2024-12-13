import { Routine } from '@/features/routines/types';

export interface Session {
  id: number;
  routine_id: number;
  start_time: string;
  end_time?: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  overall_difficulty?: number;
  energy_level?: number;
  notes?: string;
  calories_burned?: number;
  routine?: Routine;
}

export interface CompletedSet {
  training_id: number;
  set_id: number;
  actual_reps: number;
  actual_weight: number;
  actual_borg?: number;
  completed_at: string;
}

export interface SessionState {
  activeSession: Session | null;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restTimeRemaining: number;
  completedSets: CompletedSet[];
  isLoading: boolean;
  error: string | null;
}
