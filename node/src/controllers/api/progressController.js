const { Progress, Exercise, Session, User, RepMax } = require('../../models');
const { ValidationError, DatabaseError, Op } = require('sequelize');
const { calculateBrzyckiRM } = require('../../services/rmCalculator');

const progressController = {
    async create(req, res) {
        try {
            const {
                exercise_id,
                session_id,
                weight_used,
                reps_performed,
                borg_rating,
                technique_rating,
                perceived_difficulty,
                notes
            } = req.body;

            // Verificar sesión activa y acceso
            const session = await Session.findByPk(session_id);
            if (!session || session.user_id !== req.user.id || session.status !== 'in_progress') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Invalid or inactive session'
                });
            }

            const progress = await Progress.create({
                user_id: req.user.id,
                exercise_id,
                session_id,
                weight_used,
                reps_performed,
                borg_rating,
                technique_rating,
                perceived_difficulty,
                notes
            });

            // Si es un ejercicio de RM y los valores son válidos, actualizar RM
            const exercise = await Exercise.findByPk(exercise_id);
            if (exercise.is_rm_exercise && weight_used && reps_performed && reps_performed <= 12) {
                const rmValue = calculateBrzyckiRM(weight_used, reps_performed);
                await RepMax.findOrCreate({
                    where: { user_id: req.user.id, exercise_id },
                    defaults: {
                        rm_value: rmValue,
                        weight_used,
                        reps_performed
                    }
                });
            }

            // Actualizar contador de ejercicios completados en la sesión
            await session.increment('completed_exercises');

            res.status(201).json({
                status: 'success',
                data: progress
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation error',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            console.error('Error creating progress:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async update(req, res) {
        try {
            const progress = await Progress.findByPk(req.params.id);

            if (!progress || progress.user_id !== req.user.id) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Progress record not found'
                });
            }

            const {
                weight_used,
                reps_performed,
                borg_rating,
                technique_rating,
                perceived_difficulty,
                notes
            } = req.body;

            await progress.update({
                weight_used,
                reps_performed,
                borg_rating,
                technique_rating,
                perceived_difficulty,
                notes
            });

            res.json({
                status: 'success',
                data: progress
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation error',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            console.error('Error updating progress:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async delete(req, res) {
        try {
            const progress = await Progress.findByPk(req.params.id);

            if (!progress || progress.user_id !== req.user.id) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Progress record not found'
                });
            }

            await progress.destroy();

            res.json({
                status: 'success',
                message: 'Progress record deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting progress:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async getExerciseProgress(req, res) {
        try {
            const { exercise_id } = req.params;
            const { startDate, endDate, limit = 10 } = req.query;

            const where = {
                user_id: req.user.id,
                exercise_id
            };

            if (startDate && endDate) {
                where.createdAt = {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                };
            }

            const progress = await Progress.findAll({
                where,
                limit: parseInt(limit),
                order: [['createdAt', 'DESC']],
                include: [{
                    model: Session,
                    attributes: ['id', 'start_time', 'status']
                }]
            });

            // Calcular estadísticas
            const stats = progress.length > 0 ? {
                maxWeight: Math.max(...progress.map(p => p.weight_used)),
                avgWeight: progress.reduce((sum, p) => sum + p.weight_used, 0) / progress.length,
                maxReps: Math.max(...progress.map(p => p.reps_performed)),
                avgReps: progress.reduce((sum, p) => sum + p.reps_performed, 0) / progress.length,
                totalSets: progress.length
            } : null;

            res.json({
                status: 'success',
                data: {
                    progress,
                    stats
                }
            });
        } catch (error) {
            console.error('Error getting exercise progress:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async getSessionProgress(req, res) {
        try {
            const { session_id } = req.params;

            const session = await Session.findByPk(session_id);
            if (!session || session.user_id !== req.user.id) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Session not found'
                });
            }

            const progress = await Progress.findAll({
                where: { session_id },
                include: [{
                    model: Exercise,
                    attributes: ['id', 'name', 'measurement_type']
                }],
                order: [['createdAt', 'ASC']]
            });

            res.json({
                status: 'success',
                data: progress
            });
        } catch (error) {
            console.error('Error getting session progress:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = progressController;