export interface ExerciseProgress {
  id: number;
  exercise_id: number;
  session_id: number;
  weight_used: number;
  reps_performed: number;
  borg_rating?: number;
  technique_rating?: number;
  perceived_difficulty?: number;
  notes?: string;
  created_at: string;
  session?: {
    start_time: string;
    routine?: {
      name: string;
    };
  };
}

export interface ProgressStats {
  maxWeight: number;
  avgWeight: number;
  maxReps: number;
  avgReps: number;
  totalSets: number;
  bestBorg?: number;
  avgBorg?: number;
  volumeProgression: {
    date: string;
    volume: number;
  }[];
  weightProgression: {
    date: string;
    weight: number;
  }[];
}

export interface ProgressFilters {
  exerciseId?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface ProgressState {
  progressData: ExerciseProgress[];
  stats: ProgressStats | null;
  filters: ProgressFilters;
  selectedExerciseId: number | null;
  isLoading: boolean;
  error: string | null;
}
