const { Training, Exercise, Set, Routine } = require('../../models');
const { ValidationError, DatabaseError, Op } = require('sequelize');

const trainingController = {
    async create(req, res) {
        try {
            const {
                routine_id,
                exercise_id,
                order,
                training_type,
                notes,
                tempo,
                unilateral,
                superset_with
            } = req.body;

            // Verificar que la rutina pertenezca al usuario
            const routine = await Routine.findByPk(routine_id);
            if (!routine || routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied or routine not found'
                });
            }

            // Verificar que el ejercicio existe
            const exercise = await Exercise.findByPk(exercise_id);
            if (!exercise) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Exercise not found'
                });
            }

            // Si es un superset, verificar que el training referenciado existe
            if (superset_with) {
                const supersetTraining = await Training.findOne({
                    where: {
                        id: superset_with,
                        routine_id
                    }
                });
                if (!supersetTraining) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Superset training not found in this routine'
                    });
                }
            }

            const training = await Training.create({
                routine_id,
                exercise_id,
                order,
                training_type,
                notes,
                tempo,
                unilateral,
                superset_with
            });

            // Cargar las relaciones
            const trainingWithRelations = await Training.findByPk(training.id, {
                include: [Exercise]
            });

            res.status(201).json({
                status: 'success',
                data: trainingWithRelations
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation error',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            console.error('Error creating training:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async list(req, res) {
        try {
            const { routine_id } = req.params;

            // Verificar acceso a la rutina
            const routine = await Routine.findByPk(routine_id);
            if (!routine || (!routine.is_template && routine.creator_id !== req.user.id)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied or routine not found'
                });
            }

            const trainings = await Training.findAll({
                where: { routine_id },
                include: [
                    {
                        model: Exercise,
                        attributes: ['id', 'name', 'measurement_type', 'is_rm_exercise']
                    },
                    {
                        model: Set,
                        attributes: ['id', 'type', 'reps', 'weight_type', 'weight_value', 'rm_percentage', 'rest_time']
                    }
                ],
                order: [['order', 'ASC']]
            });

            res.json({
                status: 'success',
                data: trainings
            });
        } catch (error) {
            console.error('Error listing trainings:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async get(req, res) {
        try {
            const training = await Training.findByPk(req.params.id, {
                include: [
                    {
                        model: Exercise,
                        attributes: ['id', 'name', 'measurement_type', 'is_rm_exercise']
                    },
                    {
                        model: Set,
                        attributes: ['id', 'type', 'reps', 'weight_type', 'weight_value', 'rm_percentage', 'rest_time']
                    }
                ]
            });

            if (!training) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Training not found'
                });
            }

            // Verificar acceso a través de la rutina
            const routine = await Routine.findByPk(training.routine_id);
            if (!routine || (!routine.is_template && routine.creator_id !== req.user.id)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            res.json({
                status: 'success',
                data: training
            });
        } catch (error) {
            console.error('Error getting training:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async update(req, res) {
        try {
            const training = await Training.findByPk(req.params.id);

            if (!training) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Training not found'
                });
            }

            // Verificar acceso a través de la rutina
            const routine = await Routine.findByPk(training.routine_id);
            if (!routine || routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            const {
                exercise_id,
                order,
                training_type,
                notes,
                tempo,
                unilateral,
                superset_with
            } = req.body;

            // Si cambia el ejercicio, verificar que existe
            if (exercise_id && exercise_id !== training.exercise_id) {
                const exercise = await Exercise.findByPk(exercise_id);
                if (!exercise) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Exercise not found'
                    });
                }
            }

            // Si actualiza el superset, verificar que existe
            if (superset_with) {
                const supersetTraining = await Training.findOne({
                    where: {
                        id: superset_with,
                        routine_id: training.routine_id
                    }
                });
                if (!supersetTraining) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Superset training not found in this routine'
                    });
                }
            }

            await training.update({
                exercise_id,
                order,
                training_type,
                notes,
                tempo,
                unilateral,
                superset_with
            });

            // Recargar con relaciones
            const updatedTraining = await Training.findByPk(training.id, {
                include: [Exercise, Set]
            });

            res.json({
                status: 'success',
                data: updatedTraining
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation error',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            console.error('Error updating training:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async delete(req, res) {
        try {
            const training = await Training.findByPk(req.params.id);

            if (!training) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Training not found'
                });
            }

            // Verificar acceso a través de la rutina
            const routine = await Routine.findByPk(training.routine_id);
            if (!routine || routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            // Eliminar el training y sus sets asociados
            await training.destroy();

            res.json({
                status: 'success',
                message: 'Training deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting training:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async reorderTrainings(req, res) {
        try {
            const { routine_id } = req.params;
            const { orders } = req.body; // Array de {id: number, order: number}

            // Verificar acceso a la rutina
            const routine = await Routine.findByPk(routine_id);
            if (!routine || routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied or routine not found'
                });
            }

            // Actualizar órdenes
            await Promise.all(
                orders.map(({ id, order }) =>
                    Training.update(
                        { order },
                        { where: { id, routine_id } }
                    )
                )
            );

            // Obtener trainings actualizados
            const trainings = await Training.findAll({
                where: { routine_id },
                order: [['order', 'ASC']],
                include: [Exercise]
            });

            res.json({
                status: 'success',
                data: trainings,
                message: 'Training order updated successfully'
            });
        } catch (error) {
            console.error('Error reordering trainings:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = trainingController;