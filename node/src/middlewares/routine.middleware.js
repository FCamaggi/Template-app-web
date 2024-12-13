const { Routine } = require('../models');

const routineMiddleware = {
    async checkOwnership(req, res, next) {
        try {
            const routine = await Routine.findByPk(req.params.id);

            if (!routine) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Routine not found'
                });
            }

            // Permitir acceso si es una plantilla o si el usuario es el creador
            if (routine.is_template || routine.creator_id === req.user.id) {
                req.routine = routine; // Almacenar para uso posterior
                next();
            } else {
                res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }
        } catch (error) {
            console.error('Error in checkOwnership middleware:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async validateRoutineAccess(req, res, next) {
        try {
            const routine = await Routine.findByPk(req.params.id);

            if (!routine) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Routine not found'
                });
            }

            // Solo permitir modificaciones al creador
            if (routine.creator_id === req.user.id) {
                req.routine = routine;
                next();
            } else {
                res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }
        } catch (error) {
            console.error('Error in validateRoutineAccess middleware:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = routineMiddleware;