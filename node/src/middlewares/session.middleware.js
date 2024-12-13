const { Session } = require('../models');

const sessionMiddleware = {
    async validateSessionAccess(req, res, next) {
        try {
            const session = await Session.findByPk(req.params.id);

            if (!session) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Session not found'
                });
            }

            if (session.user_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            req.session = session;
            next();
        } catch (error) {
            console.error('Error in validateSessionAccess middleware:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async checkActiveSession(req, res, next) {
        try {
            const activeSession = await Session.findOne({
                where: {
                    user_id: req.user.id,
                    status: 'in_progress'
                }
            });

            if (activeSession) {
                return res.status(400).json({
                    status: 'error',
                    message: 'There is already an active session',
                    activeSession: {
                        id: activeSession.id,
                        startTime: activeSession.start_time,
                        routineId: activeSession.routine_id
                    }
                });
            }

            next();
        } catch (error) {
            console.error('Error in checkActiveSession middleware:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async validateSessionStatus(req, res, next) {
        try {
            const session = await Session.findByPk(req.params.id);

            if (!session) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Session not found'
                });
            }

            if (session.user_id !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied'
                });
            }

            if (session.status !== 'in_progress') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Session is not in progress'
                });
            }

            req.session = session;
            next();
        } catch (error) {
            console.error('Error in validateSessionStatus middleware:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = sessionMiddleware;