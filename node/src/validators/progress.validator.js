const { body, query } = require('express-validator');

const validateProgress = [
    body('exercise_id')
        .notEmpty().withMessage('Exercise ID is required')
        .isInt().withMessage('Exercise ID must be an integer'),

    body('session_id')
        .notEmpty().withMessage('Session ID is required')
        .isInt().withMessage('Session ID must be an integer'),

    body('weight_used')
        .notEmpty().withMessage('Weight used is required')
        .isFloat({ min: 0 }).withMessage('Weight must be a positive number'),

    body('reps_performed')
        .notEmpty().withMessage('Reps performed is required')
        .isInt({ min: 1 }).withMessage('Reps must be a positive integer'),

    body('borg_rating')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Borg rating must be between 1 and 10'),

    body('technique_rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Technique rating must be between 1 and 5'),

    body('perceived_difficulty')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Perceived difficulty must be between 1 and 10'),

    body('notes')
        .optional()
        .isString()
        .isLength({ max: 500 })
        .withMessage('Notes must be less than 500 characters')
];

const validateProgressQuery = [
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
        }),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
];

module.exports = {
    validateProgress,
    validateProgressQuery
};