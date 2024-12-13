const { Set, Training, Routine } = require('../models');

const setMiddleware = {
    async validateSetAccess(req, res, next) {
        try {
            const set = await Set.findByPk(req.params.id);

            if (!set) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Set not found'
                });
            }

            // Verificar acceso a través del training y la rutina
            const training = await Training.findByPk(set.training_id, {
                include: [{
                    model: Routine,
                    attributes: ['creator_id', 'is_template']
                }]
            });

            if (!training || (!training.Routine.is_template && training.Routine.creator_id !== req.user.id)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            req.set = set;
            req.training = training;
            next();
        } catch (error) {
            console.error('Error in validateSetAccess middleware:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async validateTrainingAccess(req, res, next) {
        try {
            const { training_id } = req.params;
            const training = await Training.findByPk(training_id, {
                include: [{
                    model: Routine,
                    attributes: ['creator_id', 'is_template']
                }]
            });

            if (!training) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Training not found'
                });
            }

            if (!training.Routine.is_template && training.Routine.creator_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            req.training = training;
            next();
        } catch (error) {
            console.error('Error in validateTrainingAccess middleware:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = setMiddleware;