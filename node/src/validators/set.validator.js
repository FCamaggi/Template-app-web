const { body } = require('express-validator');

const validateSet = [
    body('training_id')
        .notEmpty().withMessage('Training ID is required')
        .isInt().withMessage('Training ID must be an integer'),

    body('order')
        .notEmpty().withMessage('Order is required')
        .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),

    body('type')
        .isIn(['warmup', 'work']).withMessage('Invalid set type'),

    body('reps')
        .notEmpty().withMessage('Reps is required')
        .matches(/^\d+(-\d+)?$/).withMessage('Reps must be a number or range (e.g., "12" or "8-12")'),

    body('weight_type')
        .isIn(['RM_percentage', 'direct_weight', 'Borg'])
        .withMessage('Invalid weight type'),

    body('weight_value')
        .if(body('weight_type').equals('direct_weight'))
        .isFloat({ min: 0 }).withMessage('Weight value must be a positive number'),

    body('rm_percentage')
        .if(body('weight_type').equals('RM_percentage'))
        .isInt({ min: 1, max: 100 }).withMessage('RM percentage must be between 1 and 100'),

    body('borg_target')
        .if(body('weight_type').equals('Borg'))
        .isInt({ min: 1, max: 10 }).withMessage('Borg target must be between 1 and 10'),

    body('rest_time')
        .notEmpty().withMessage('Rest time is required')
        .isInt({ min: 0 }).withMessage('Rest time must be a non-negative integer')
];

const validateBulkCreate = [
    body('training_id')
        .notEmpty().withMessage('Training ID is required')
        .isInt().withMessage('Training ID must be an integer'),

    body('sets')
        .isArray().withMessage('Sets must be an array')
        .notEmpty().withMessage('Sets array cannot be empty'),

    body('sets.*.order')
        .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),

    body('sets.*.type')
        .isIn(['warmup', 'work']).withMessage('Invalid set type'),

    body('sets.*.reps')
        .matches(/^\d+(-\d+)?$/).withMessage('Reps must be a number or range'),

    body('sets.*.weight_type')
        .isIn(['RM_percentage', 'direct_weight', 'Borg'])
        .withMessage('Invalid weight type'),

    body('sets.*.rest_time')
        .isInt({ min: 0 }).withMessage('Rest time must be a non-negative integer')
];

const validateSetCompletion = [
    body('actual_reps')
        .notEmpty().withMessage('Actual reps is required')
        .isInt({ min: 0 }).withMessage('Actual reps must be a non-negative integer'),

    body('actual_weight')
        .optional()
        .isFloat({ min: 0 }).withMessage('Actual weight must be a positive number'),

    body('actual_borg')
        .optional()
        .isInt({ min: 1, max: 10 }).withMessage('Actual Borg must be between 1 and 10')
];

module.exports = {
    validateSet,
    validateBulkCreate,
    validateSetCompletion
};