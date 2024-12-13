class RoutineGenerator {
    static generateTrainingSession(exercise, userRM, targetBorg) {
        const sets = [];

        // Si es ejercicio RM y tenemos RM del usuario
        if (exercise.is_rm_exercise && userRM) {
            sets.push(
                { type: 'warmup', reps: 10, weight: 'bar' },
                { type: 'warmup', reps: 8, weight: `${50}%` },
                { type: 'work', reps: 6, weight: `${70}%` },
                { type: 'work', reps: 4, weight: `${80}%`, sets: 3 }
            );
        } else {
            // Usando escala de Borg
            const warmupSets = ProgressionService.calculateWarmupSets(0, targetBorg);
            sets.push(...warmupSets);
            sets.push({ type: 'work', reps: '8-12', borg: targetBorg, sets: 3 });
        }

        return sets;
    }
}

module.exports = RoutineGenerator;