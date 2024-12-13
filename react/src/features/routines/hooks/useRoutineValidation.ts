import { useState, useCallback, useEffect } from 'react';
import { RoutineValidator } from '../services/routineValidator';
import { Routine } from '../types';

export const useRoutineValidation = (routine: Partial<Routine>) => {
  const [validation, setValidation] = useState(() =>
    RoutineValidator.validateRoutine(routine as Routine)
  );

  const validateRoutine = useCallback(() => {
    const result = RoutineValidator.validateRoutine(routine as Routine);
    setValidation(result);
    return result;
  }, [routine]);

  useEffect(() => {
    validateRoutine();
  }, [validateRoutine]);

  return {
    ...validation,
    validateRoutine,
    hasWarnings: validation.warnings.length > 0,
    hasErrors: validation.errors.length > 0,
  };
};
