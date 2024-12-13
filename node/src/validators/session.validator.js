const { body, query } = require('express-validator');

const validateSessionStart = [
    body('routine_id')
        .notEmpty().withMessage('Routine ID is required')
        .isInt().withMessage('Routine ID must be an integer')
];

const validateSessionFinish = [
    body('overall_difficulty')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Overall difficulty must be between 1 and 10'),

    body('energy_level')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Energy level must be between 1 and 10'),

    body('notes')
        .optional()
        .isString()
        .isLength({ max: 500 })
        .withMessage('Notes must be less than 500 characters'),

    body('calories_burned')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Calories burned must be a positive integer')
];

const validateHistoryQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('status')
        .optional()
        .isIn(['in_progress', 'completed', 'cancelled'])
        .withMessage('Invalid status'),

    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO date'),

    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO date')
        .custom((endDate, { req }) => {
            if (req.query.startDate && new Date(endDate) < new Date(req.query.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        })
];

module.exports = {
    validateSessionStart,
    validateSessionFinish,
    validateHistoryQuery
};