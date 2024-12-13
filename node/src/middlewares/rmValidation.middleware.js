const { Exercise } = require('../models');

const rmValidation = {
    async validateExerciseType(req, res, next) {
        try {
            const { exerciseId } = req.body;
            const exercise = await Exercise.findByPk(exerciseId);

            if (!exercise) {
                return res.status(404).json({ error: 'Exercise not found' });
            }

            if (!exercise.is_rm_exercise) {
                return res.status(400).json({
                    error: 'This exercise does not support RM calculations'
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    },

    validateAccess(req, res, next) {
        const { userId } = req.params;
        // Si el usuario es admin o es su propio RM
        if (req.user.role === 'admin' || req.user.id === parseInt(userId)) {
            next();
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
};

module.exports = rmValidation;