const { Exercise } = require('../../models');
const { ValidationError, DatabaseError, Op } = require('sequelize');

const exerciseController = {
    async create(req, res) {
        try {
            const {
                name,
                description,
                exercise_type,
                main_muscle_group,
                required_equipment,
                tutorial_url,
                technical_instructions,
                observations,
                measurement_type,
                is_rm_exercise
            } = req.body;

            const exercise = await Exercise.create({
                name,
                description,
                exercise_type,
                main_muscle_group,
                required_equipment,
                tutorial_url,
                technical_instructions,
                observations,
                measurement_type,
                is_rm_exercise
            });

            res.status(201).json({
                status: 'success',
                data: exercise
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation error',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            console.error('Error creating exercise:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async list(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                type,
                muscle_group,
                measurement_type,
                is_rm_exercise,
                search
            } = req.query;

            const where = {};

            if (type) where.exercise_type = type;
            if (muscle_group) where.main_muscle_group = muscle_group;
            if (measurement_type) where.measurement_type = measurement_type;
            if (is_rm_exercise !== undefined) where.is_rm_exercise = is_rm_exercise === 'true';
            if (search) {
                where[Op.or] = [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const { count, rows } = await Exercise.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: (parseInt(page) - 1) * parseInt(limit),
                order: [['name', 'ASC']]
            });

            res.json({
                status: 'success',
                data: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit)
                }
            });
        } catch (error) {
            console.error('Error listing exercises:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async get(req, res) {
        try {
            const exercise = await Exercise.findByPk(req.params.id);

            if (!exercise) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Exercise not found'
                });
            }

            res.json({
                status: 'success',
                data: exercise
            });
        } catch (error) {
            console.error('Error getting exercise:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async update(req, res) {
        try {
            const exercise = await Exercise.findByPk(req.params.id);

            if (!exercise) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Exercise not found'
                });
            }

            const {
                name,
                description,
                exercise_type,
                main_muscle_group,
                required_equipment,
                tutorial_url,
                technical_instructions,
                observations,
                measurement_type,
                is_rm_exercise
            } = req.body;

            await exercise.update({
                name,
                description,
                exercise_type,
                main_muscle_group,
                required_equipment,
                tutorial_url,
                technical_instructions,
                observations,
                measurement_type,
                is_rm_exercise
            });

            res.json({
                status: 'success',
                data: exercise
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation error',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            console.error('Error updating exercise:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async delete(req, res) {
        try {
            const exercise = await Exercise.findByPk(req.params.id);

            if (!exercise) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Exercise not found'
                });
            }

            await exercise.destroy();

            res.json({
                status: 'success',
                message: 'Exercise deleted successfully'
            });
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Cannot delete exercise - it may be referenced by other records'
                });
            }
            console.error('Error deleting exercise:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = exerciseController;