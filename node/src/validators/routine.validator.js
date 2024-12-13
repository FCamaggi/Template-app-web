const { body } = require('express-validator');

const validateRoutine = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),

    body('type')
        .notEmpty().withMessage('Type is required')
        .isIn(['full_body', 'split', 'upper_lower', 'push_pull_legs'])
        .withMessage('Invalid routine type'),

    body('difficulty')
        .notEmpty().withMessage('Difficulty is required')
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Invalid difficulty level'),

    body('estimated_time')
        .notEmpty().withMessage('Estimated time is required')
        .isInt({ min: 1 }).withMessage('Estimated time must be a positive number'),

    body('mesocycle_type')
        .optional()
        .isLength({ max: 50 }).withMessage('Mesocycle type must be less than 50 characters'),

    body('microcycle_type')
        .optional()
        .isLength({ max: 50 }).withMessage('Microcycle type must be less than 50 characters'),

    body('warmup_description')
        .optional()
        .isLength({ max: 500 }).withMessage('Warmup description must be less than 500 characters'),

    body('cooldown_description')
        .optional()
        .isLength({ max: 500 }).withMessage('Cooldown description must be less than 500 characters'),

    body('notes')
        .optional()
        .isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters'),

    body('is_template')
        .optional()
        .isBoolean().withMessage('is_template must be a boolean value'),

    body('active')
        .optional()
        .isBoolean().withMessage('active must be a boolean value')
];

module.exports = {
    validateRoutine
};