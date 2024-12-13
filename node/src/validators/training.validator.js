const { body } = require('express-validator');

const validateTraining = [
    body('routine_id')
        .notEmpty().withMessage('Routine ID is required')
        .isInt().withMessage('Routine ID must be an integer'),

    body('exercise_id')
        .notEmpty().withMessage('Exercise ID is required')
        .isInt().withMessage('Exercise ID must be an integer'),

    body('order')
        .notEmpty().withMessage('Order is required')
        .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),

    body('training_type')
        .notEmpty().withMessage('Training type is required')
        .isIn(['strength', 'hypertrophy', 'endurance', 'power'])
        .withMessage('Invalid training type'),

    body('notes')
        .optional()
        .isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),

    body('tempo')
        .optional()
        .matches(/^\d{1}-\d{1}-\d{1}-\d{1}$/)
        .withMessage('Tempo must be in format "X-X-X-X" (e.g., "3-1-2-0")'),

    body('unilateral')
        .optional()
        .isBoolean().withMessage('Unilateral must be a boolean value'),

    body('superset_with')
        .optional()
        .isInt().withMessage('Superset reference must be an integer')
];

const validateReorder = [
    body('orders')
        .isArray().withMessage('Orders must be an array')
        .notEmpty().withMessage('Orders array cannot be empty'),

    body('orders.*.id')
        .isInt().withMessage('Training ID must be an integer'),

    body('orders.*.order')
        .isInt({ min: 0 }).withMessage('Order must be a non-negative integer')
];

module.exports = {
    validateTraining,
    validateReorder
};