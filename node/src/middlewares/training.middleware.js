const { Training, Routine } = require('../models');

const trainingMiddleware = {
    async validateTrainingAccess(req, res, next) {
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
            if (!routine || (!routine.is_template && routine.creator_id !== req.user.id)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            req.training = training;
            req.routine = routine;
            next();
        } catch (error) {
            console.error('Error in validateTrainingAccess middleware:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async validateRoutineAccess(req, res, next) {
        try {
            const { routine_id } = req.params;
            const routine = await Routine.findByPk(routine_id);

            if (!routine) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Routine not found'
                });
            }

            if (!routine.is_template && routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            req.routine = routine;
            next();
        } catch (error) {
            console.error('Error in validateRoutineAccess middleware:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = trainingMiddleware;