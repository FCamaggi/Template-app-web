// Tipos base
export interface WorkoutSummary {
  id: number;
  routineId: number;
  routineName: string;
  date: string;
  duration: number;
  difficulty: number;
  completed: boolean;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  earnedDate: string;
  icon: string;
}

export interface MuscleGroupVolume {
  muscleGroup: string;
  sets: number;
  percentage: number;
}

export interface StrengthProgress {
  exerciseId: number;
  exerciseName: string;
  maxWeight: number;
  previousMax: number;
  percentage: number;
}

// Stats y métricas
export interface DashboardStats {
  workoutsCompleted: number;
  currentStreak: number;
  totalTime: number;
  achievements: number;
  monthlyGoalProgress: number;
  averageWorkoutTime: number;
}

// Actividad reciente
export interface ActivityLog {
  date: string;
  duration: number;
  routineName: string;
  type: 'workout' | 'pr' | 'achievement';
  details?: {
    exerciseName?: string;
    weight?: number;
    achievementName?: string;
  };
}

// Próximos entrenamientos
export interface UpcomingWorkout {
  id: number;
  routineName: string;
  scheduledDate: string;
  estimatedDuration: number;
  type: string;
  lastCompleted?: string;
}

// Progress overview
export interface ProgressOverview {
  volumeByMuscleGroup: MuscleGroupVolume[];
  recentPRs: StrengthProgress[];
  monthlyProgress: {
    date: string;
    workouts: number;
    volume: number;
  }[];
}

// Dashboard state completo
export interface DashboardState {
  stats: DashboardStats;
  recentActivity: ActivityLog[];
  upcomingWorkouts: UpcomingWorkout[];
  progress: ProgressOverview;
  isLoading: boolean;
  error: string | null;
}
