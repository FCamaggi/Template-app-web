const { Session, Routine, Progress, Training, Exercise } = require('../../models');

const sessionController = {
    async start(req, res) {
        try {
            const { routine_id } = req.body;

            // Verificar acceso a la rutina
            const routine = await Routine.findByPk(routine_id);
            if (!routine || (!routine.is_template && routine.creator_id !== req.user.id)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Access denied or routine not found'
                });
            }

            // Verificar si hay una sesión activa
            const activeSession = await Session.findOne({
                where: {
                    user_id: req.user.id,
                    status: 'in_progress'
                }
            });

            if (activeSession) {
                return res.status(400).json({
                    status: 'error',
                    message: 'There is already an active session'
                });
            }

            const session = await Session.create({
                user_id: req.user.id,
                routine_id,
                start_time: new Date(),
                status: 'in_progress'
            });

            res.status(201).json({
                status: 'success',
                data: session
            });
        } catch (error) {
            console.error('Error starting session:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async finish(req, res) {
        try {
            const {
                overall_difficulty,
                energy_level,
                notes,
                calories_burned
            } = req.body;

            const session = await Session.findByPk(req.params.id);

            if (!session || session.user_id !== req.user.id) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Session not found'
                });
            }

            if (session.status !== 'in_progress') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Session is not in progress'
                });
            }

            await session.update({
                status: 'completed',
                end_time: new Date(),
                overall_difficulty,
                energy_level,
                notes,
                calories_burned
            });

            res.json({
                status: 'success',
                data: session
            });
        } catch (error) {
            console.error('Error finishing session:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async cancel(req, res) {
        try {
            const session = await Session.findByPk(req.params.id);

            if (!session || session.user_id !== req.user.id) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Session not found'
                });
            }

            if (session.status !== 'in_progress') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Session is not in progress'
                });
            }

            await session.update({
                status: 'cancelled',
                end_time: new Date()
            });

            res.json({
                status: 'success',
                message: 'Session cancelled successfully'
            });
        } catch (error) {
            console.error('Error cancelling session:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async getActiveSession(req, res) {
        try {
            const session = await Session.findOne({
                where: {
                    user_id: req.user.id,
                    status: 'in_progress'
                },
                include: [{
                    model: Routine,
                    include: [{
                        model: Training,
                        include: [Exercise]
                    }]
                }]
            });

            if (!session) {
                return res.json({
                    status: 'success',
                    data: null
                });
            }

            res.json({
                status: 'success',
                data: session
            });
        } catch (error) {
            console.error('Error getting active session:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async getSessionHistory(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                status,
                startDate,
                endDate
            } = req.query;

            const where = {
                user_id: req.user.id
            };

            if (status) where.status = status;
            if (startDate && endDate) {
                where.start_time = {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                };
            }

            const { count, rows } = await Session.findAndCountAll({
                where,
                include: [{
                    model: Routine,
                    attributes: ['id', 'name', 'type']
                }],
                order: [['start_time', 'DESC']],
                limit: parseInt(limit),
                offset: (parseInt(page) - 1) * parseInt(limit)
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
            console.error('Error getting session history:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async getSessionDetails(req, res) {
        try {
            const session = await Session.findByPk(req.params.id, {
                include: [
                    {
                        model: Routine,
                        include: [{
                            model: Training,
                            include: [Exercise]
                        }]
                    },
                    {
                        model: Progress,
                        include: [Exercise]
                    }
                ]
            });

            if (!session || session.user_id !== req.user.id) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Session not found'
                });
            }

            res.json({
                status: 'success',
                data: session
            });
        } catch (error) {
            console.error('Error getting session details:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = sessionController;