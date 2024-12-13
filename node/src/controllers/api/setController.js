const { Set, Training, Routine, Exercise } = require('../../models');
const { ValidationError, DatabaseError } = require('sequelize');

const setController = {
    async create(req, res) {
        try {
            const {
                training_id,
                order,
                type,
                reps,
                weight_type,
                weight_value,
                rm_percentage,
                borg_target,
                rest_time
            } = req.body;

            // Verificar acceso a través del training y la rutina
            const training = await Training.findByPk(training_id, {
                include: [{
                    model: Routine,
                    attributes: ['creator_id']
                }]
            });

            if (!training || training.Routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied or training not found'
                });
            }

            const set = await Set.create({
                training_id,
                order,
                type,
                reps,
                weight_type,
                weight_value,
                rm_percentage,
                borg_target,
                rest_time
            });

            res.status(201).json({
                status: 'success',
                data: set
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation error',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            console.error('Error creating set:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async list(req, res) {
        try {
            const { training_id } = req.params;

            // Verificar acceso
            const training = await Training.findByPk(training_id, {
                include: [{
                    model: Routine,
                    attributes: ['creator_id', 'is_template']
                }]
            });

            if (!training || (!training.Routine.is_template && training.Routine.creator_id !== req.user.id)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied or training not found'
                });
            }

            const sets = await Set.findAll({
                where: { training_id },
                order: [['order', 'ASC'], ['type', 'ASC']]
            });

            res.json({
                status: 'success',
                data: sets
            });
        } catch (error) {
            console.error('Error listing sets:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async update(req, res) {
        try {
            const {
                type,
                reps,
                weight_type,
                weight_value,
                rm_percentage,
                borg_target,
                rest_time,
                completed,
                actual_reps,
                actual_weight,
                actual_borg
            } = req.body;

            const set = await Set.findByPk(req.params.id);

            if (!set) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Set not found'
                });
            }

            // Verificar acceso
            const training = await Training.findByPk(set.training_id, {
                include: [{
                    model: Routine,
                    attributes: ['creator_id']
                }]
            });

            if (!training || training.Routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            await set.update({
                type,
                reps,
                weight_type,
                weight_value,
                rm_percentage,
                borg_target,
                rest_time,
                completed,
                actual_reps,
                actual_weight,
                actual_borg
            });

            res.json({
                status: 'success',
                data: set
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation error',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            console.error('Error updating set:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async delete(req, res) {
        try {
            const set = await Set.findByPk(req.params.id);

            if (!set) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Set not found'
                });
            }

            // Verificar acceso
            const training = await Training.findByPk(set.training_id, {
                include: [{
                    model: Routine,
                    attributes: ['creator_id']
                }]
            });

            if (!training || training.Routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            await set.destroy();

            res.json({
                status: 'success',
                message: 'Set deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting set:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async bulkCreate(req, res) {
        try {
            const { training_id, sets } = req.body;

            // Verificar acceso
            const training = await Training.findByPk(training_id, {
                include: [{
                    model: Routine,
                    attributes: ['creator_id']
                }]
            });

            if (!training || training.Routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied or training not found'
                });
            }

            // Crear todos los sets
            const createdSets = await Set.bulkCreate(
                sets.map(set => ({
                    ...set,
                    training_id
                }))
            );

            res.status(201).json({
                status: 'success',
                data: createdSets
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation error',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            console.error('Error in bulk creating sets:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async completeSet(req, res) {
        try {
            const { actual_reps, actual_weight, actual_borg } = req.body;
            const set = await Set.findByPk(req.params.id);

            if (!set) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Set not found'
                });
            }

            // Verificar acceso
            const training = await Training.findByPk(set.training_id, {
                include: [{
                    model: Routine,
                    attributes: ['creator_id']
                }]
            });

            if (!training || training.Routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            await set.update({
                completed: true,
                actual_reps,
                actual_weight,
                actual_borg
            });

            res.json({
                status: 'success',
                data: set
            });
        } catch (error) {
            console.error('Error completing set:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = setController;