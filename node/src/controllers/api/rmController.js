const { RepMax, Exercise, User } = require('../../models');
const { calculateBrzyckiRM, calculatePercentageWeight } = require('../../services/rmCalculator');

const rmController = {
    async calculateRM(req, res) {
        try {
            const { weight, reps, exerciseId } = req.body;
            const userId = req.user.id; // Asumimos que viene del middleware de auth

            // Validar que el ejercicio exista y sea tipo RM
            const exercise = await Exercise.findByPk(exerciseId);
            if (!exercise || !exercise.is_rm_exercise) {
                return res.status(400).json({
                    error: 'Exercise not found or not compatible with RM calculation'
                });
            }

            // Calcular RM
            const rmValue = calculateBrzyckiRM(weight, reps);

            // Guardar o actualizar RM
            const [repMax, created] = await RepMax.findOrCreate({
                where: { user_id: userId, exercise_id: exerciseId },
                defaults: {
                    rm_value: rmValue,
                    calculation_method: 'Brzycki',
                    weight_used: weight,
                    reps_performed: reps
                }
            });

            if (!created) {
                await repMax.update({
                    rm_value: rmValue,
                    weight_used: weight,
                    reps_performed: reps
                });
            }

            // Calcular tabla de porcentajes comunes
            const percentages = [50, 60, 70, 80, 85, 90, 95];
            const rmTable = percentages.map(percentage => ({
                percentage,
                weight: calculatePercentageWeight(rmValue, percentage)
            }));

            return res.json({
                rm: rmValue,
                rmTable,
                savedRecord: repMax
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getUserRM(req, res) {
        try {
            const { userId, exerciseId } = req.params;

            const repMax = await RepMax.findOne({
                where: { user_id: userId, exercise_id: exerciseId },
                include: [
                    { model: Exercise, attributes: ['name', 'is_rm_exercise'] }
                ]
            });

            if (!repMax) {
                return res.status(404).json({ error: 'RM record not found' });
            }

            return res.json(repMax);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    async suggestWeight(req, res) {
        try {
            const { exerciseId, targetReps, targetBorg } = req.body;
            const userId = req.user.id;

            const repMax = await RepMax.findOne({
                where: { user_id: userId, exercise_id: exerciseId }
            });

            if (!repMax) {
                return res.status(404).json({
                    error: 'No RM record found. Please calculate RM first.'
                });
            }

            // Sugerir peso basado en RM y objetivo
            let suggestedWeight;
            if (targetReps <= 6) {  // Fuerza
                suggestedWeight = calculatePercentageWeight(repMax.rm_value, 80);
            } else if (targetReps <= 12) {  // Hipertrofia
                suggestedWeight = calculatePercentageWeight(repMax.rm_value, 70);
            } else {  // Resistencia
                suggestedWeight = calculatePercentageWeight(repMax.rm_value, 60);
            }

            return res.json({
                suggestedWeight,
                originalRM: repMax.rm_value,
                targetReps,
                estimatedBorg: targetBorg || 7 // Estimación por defecto
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = rmController;