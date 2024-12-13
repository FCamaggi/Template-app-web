import { Routine, Training, Set } from '../types';

interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  errors: ValidationError[];
}

interface ValidationWarning {
  type: 'volume' | 'frequency' | 'rest' | 'intensity';
  message: string;
  context?: any;
}

interface ValidationError {
  type: 'volume' | 'frequency' | 'rest' | 'intensity';
  message: string;
  context?: any;
}

interface MuscleGroupVolume {
  [key: string]: {
    sets: number;
    exercises: string[];
    intensity: number;
  };
}

export class RoutineValidator {
  private static MAX_SETS_PER_MUSCLE = 30;
  private static MIN_SETS_PER_MUSCLE = 10;
  private static MAX_EXERCISES_PER_MUSCLE = 4;
  private static MIN_REST_TIME = 30;
  private static MAX_INTENSITY_PERCENTAGE = 90;

  static validateRoutine(routine: Routine): ValidationResult {
    const warnings: ValidationWarning[] = [];
    const errors: ValidationError[] = [];

    // Validar volumen por grupo muscular
    const muscleGroupVolumes = this.calculateMuscleGroupVolumes(
      routine.trainings || []
    );
    this.validateMuscleGroupVolumes(muscleGroupVolumes, warnings, errors);

    // Validar frecuencia de ejercicios
    this.validateExerciseFrequency(routine.trainings || [], warnings, errors);

    // Validar tiempos de descanso
    this.validateRestTimes(routine.trainings || [], warnings, errors);

    // Validar intensidades
    this.validateIntensities(routine.trainings || [], warnings, errors);

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
    };
  }

  private static calculateMuscleGroupVolumes(
    trainings: Training[]
  ): MuscleGroupVolume {
    const volumes: MuscleGroupVolume = {};

    trainings.forEach((training) => {
      const muscleGroup = training.exercise?.main_muscle_group;
      if (!muscleGroup) return;

      if (!volumes[muscleGroup]) {
        volumes[muscleGroup] = {
          sets: 0,
          exercises: [],
          intensity: 0,
        };
      }

      // Contar sets
      const workingSets = (training.sets || []).filter(
        (set) => set.type === 'work'
      ).length;
      volumes[muscleGroup].sets += workingSets;

      // Registrar ejercicio único
      if (
        !volumes[muscleGroup].exercises.includes(training.exercise?.name || '')
      ) {
        volumes[muscleGroup].exercises.push(training.exercise?.name || '');
      }

      // Calcular intensidad promedio
      const avgIntensity = this.calculateAverageIntensity(training.sets || []);
      if (avgIntensity > volumes[muscleGroup].intensity) {
        volumes[muscleGroup].intensity = avgIntensity;
      }
    });

    return volumes;
  }

  private static validateMuscleGroupVolumes(
    volumes: MuscleGroupVolume,
    warnings: ValidationWarning[],
    errors: ValidationError[]
  ) {
    Object.entries(volumes).forEach(([muscleGroup, data]) => {
      // Validar cantidad de sets
      if (data.sets > this.MAX_SETS_PER_MUSCLE) {
        errors.push({
          type: 'volume',
          message: `Too many sets (${data.sets}) for ${muscleGroup}. Maximum recommended is ${this.MAX_SETS_PER_MUSCLE}.`,
          context: { muscleGroup, sets: data.sets },
        });
      } else if (data.sets < this.MIN_SETS_PER_MUSCLE) {
        warnings.push({
          type: 'volume',
          message: `Low volume (${data.sets} sets) for ${muscleGroup}. Minimum recommended is ${this.MIN_SETS_PER_MUSCLE}.`,
          context: { muscleGroup, sets: data.sets },
        });
      }

      // Validar cantidad de ejercicios
      if (data.exercises.length > this.MAX_EXERCISES_PER_MUSCLE) {
        warnings.push({
          type: 'frequency',
          message: `High number of different exercises (${data.exercises.length}) for ${muscleGroup}.`,
          context: { muscleGroup, exercises: data.exercises },
        });
      }
    });
  }

  private static validateExerciseFrequency(
    trainings: Training[],
    warnings: ValidationWarning[],
    _errors: ValidationError[]
  ) {
    const exerciseCounts = new Map<string, number>();

    trainings.forEach((training) => {
      const exerciseId = String(training.exercise_id);
      exerciseCounts.set(exerciseId, (exerciseCounts.get(exerciseId) || 0) + 1);
    });

    exerciseCounts.forEach((count, exerciseId) => {
      if (count > 1) {
        warnings.push({
          type: 'frequency',
          message: `Exercise appears ${count} times in the routine.`,
          context: { exerciseId, count },
        });
      }
    });
  }

  private static validateRestTimes(
    trainings: Training[],
    warnings: ValidationWarning[],
    _errors: ValidationError[]
  ) {
    trainings.forEach((training) => {
      (training.sets || []).forEach((set) => {
        if (set.rest_time < this.MIN_REST_TIME) {
          warnings.push({
            type: 'rest',
            message: `Rest time (${set.rest_time}s) might be too short for ${training.exercise?.name}.`,
            context: {
              exercise: training.exercise?.name,
              restTime: set.rest_time,
            },
          });
        }
      });
    });
  }

  private static validateIntensities(
    trainings: Training[],
    _warnings: ValidationWarning[],
    errors: ValidationError[]
  ) {
    trainings.forEach((training) => {
      const avgIntensity = this.calculateAverageIntensity(training.sets || []);

      if (avgIntensity > this.MAX_INTENSITY_PERCENTAGE) {
        errors.push({
          type: 'intensity',
          message: `Average intensity (${avgIntensity}%) for ${training.exercise?.name} is too high.`,
          context: {
            exercise: training.exercise?.name,
            intensity: avgIntensity,
          },
        });
      }
    });
  }

  private static calculateAverageIntensity(sets: Set[]): number {
    const workingSets = sets.filter((set) => set.type === 'work');
    if (workingSets.length === 0) return 0;

    const totalIntensity = workingSets.reduce((sum, set) => {
      if (set.weight_type === 'RM_percentage') {
        return sum + (set.rm_percentage || 0);
      }
      return sum;
    }, 0);

    return Math.round(totalIntensity / workingSets.length);
  }
}
