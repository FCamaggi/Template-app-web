const { Progress, Session } = require('../models');

const progressMiddleware = {
    async validateProgressAccess(req, res, next) {
        try {
            const progress = await Progress.findByPk(req.params.id);

            if (!progress) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Progress record not found'
                });
            }

            if (progress.user_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            req.progress = progress;
            next();
        } catch (error) {
            console.error('Error in validateProgressAccess middleware:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async validateActiveSession(req, res, next) {
        try {
            const { session_id } = req.body;
            const session = await Session.findByPk(session_id);

            if (!session || session.user_id !== req.user.id) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Session not found'
                });
            }

            if (session.status !== 'in_progress') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Session is not active'
                });
            }

            req.session = session;
            next();
        } catch (error) {
            console.error('Error in validateActiveSession middleware:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = progressMiddleware;