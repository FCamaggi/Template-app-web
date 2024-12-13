export interface Exercise {
  id: number;
  name: string;
  description: string;
  exercise_type: string;
  main_muscle_group: string;
  required_equipment: string;
  tutorial_url: string;
  technical_instructions: string;
  observations: string;
  measurement_type: 'RM' | 'Borg' | 'both';
  is_rm_exercise: boolean;
}

export interface ExerciseFilters {
  page?: number;
  limit?: number;
  type?: string;
  muscle_group?: string;
  measurement_type?: string;
  is_rm_exercise?: boolean;
  search?: string;
}

export interface ExerciseState {
  exercises: Exercise[];
  selectedExercise: Exercise | null;
  filters: ExerciseFilters;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  isLoading: boolean;
  error: string | null;
}
