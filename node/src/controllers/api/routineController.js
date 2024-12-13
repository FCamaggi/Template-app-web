const { Routine, Training, Exercise } = require('../../models');
const { ValidationError, DatabaseError } = require('sequelize');

const routineController = {
    async create(req, res) {
        try {
            const {
                name,
                description,
                type,
                difficulty,
                estimated_time,
                mesocycle_type,
                microcycle_type,
                warmup_description,
                cooldown_description,
                notes,
                is_template
            } = req.body;

            const routine = await Routine.create({
                name,
                description,
                creator_id: req.user.id, // Del middleware de auth
                type,
                difficulty,
                estimated_time,
                mesocycle_type,
                microcycle_type,
                warmup_description,
                cooldown_description,
                notes,
                is_template: is_template || false
            });

            res.status(201).json({
                status: 'success',
                data: routine
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation error',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            console.error('Error creating routine:', error);
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
                difficulty,
                is_template,
                search
            } = req.query;

            const where = {
                [Op.or]: [
                    { creator_id: req.user.id },
                    { is_template: true }
                ]
            };

            if (type) where.type = type;
            if (difficulty) where.difficulty = difficulty;
            if (is_template !== undefined) where.is_template = is_template === 'true';
            if (search) {
                where[Op.or] = [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const { count, rows } = await Routine.findAndCountAll({
                where,
                include: [{
                    model: Training,
                    include: [Exercise]
                }],
                limit: parseInt(limit),
                offset: (parseInt(page) - 1) * parseInt(limit),
                order: [['createdAt', 'DESC']]
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
            console.error('Error listing routines:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async get(req, res) {
        try {
            const routine = await Routine.findByPk(req.params.id, {
                include: [{
                    model: Training,
                    include: [Exercise]
                }]
            });

            if (!routine) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Routine not found'
                });
            }

            // Verificar acceso
            if (!routine.is_template && routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            res.json({
                status: 'success',
                data: routine
            });
        } catch (error) {
            console.error('Error getting routine:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async update(req, res) {
        try {
            const routine = await Routine.findByPk(req.params.id);

            if (!routine) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Routine not found'
                });
            }

            // Verificar propiedad
            if (routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            const {
                name,
                description,
                type,
                difficulty,
                estimated_time,
                mesocycle_type,
                microcycle_type,
                warmup_description,
                cooldown_description,
                notes,
                is_template,
                active
            } = req.body;

            await routine.update({
                name,
                description,
                type,
                difficulty,
                estimated_time,
                mesocycle_type,
                microcycle_type,
                warmup_description,
                cooldown_description,
                notes,
                is_template,
                active
            });

            res.json({
                status: 'success',
                data: routine
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation error',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            console.error('Error updating routine:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async delete(req, res) {
        try {
            const routine = await Routine.findByPk(req.params.id);

            if (!routine) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Routine not found'
                });
            }

            // Verificar propiedad
            if (routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            await routine.destroy();

            res.json({
                status: 'success',
                message: 'Routine deleted successfully'
            });
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Cannot delete routine - it may be referenced by other records'
                });
            }
            console.error('Error deleting routine:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async duplicate(req, res) {
        try {
            const sourceRoutine = await Routine.findByPk(req.params.id, {
                include: [{
                    model: Training,
                    include: [Exercise]
                }]
            });

            if (!sourceRoutine) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Routine not found'
                });
            }

            // Verificar acceso a la rutina fuente
            if (!sourceRoutine.is_template && sourceRoutine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            // Duplicar rutina
            const newRoutine = await Routine.create({
                ...sourceRoutine.toJSON(),
                id: undefined,
                creator_id: req.user.id,
                name: `Copy of ${sourceRoutine.name}`,
                is_template: false,
                createdAt: undefined,
                updatedAt: undefined
            });

            // Duplicar entrenamientos asociados
            if (sourceRoutine.Trainings) {
                for (const training of sourceRoutine.Trainings) {
                    await Training.create({
                        ...training.toJSON(),
                        id: undefined,
                        routine_id: newRoutine.id,
                        createdAt: undefined,
                        updatedAt: undefined
                    });
                }
            }

            res.status(201).json({
                status: 'success',
                data: newRoutine,
                message: 'Routine duplicated successfully'
            });
        } catch (error) {
            console.error('Error duplicating routine:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = routineController;