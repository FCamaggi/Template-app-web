const { body } = require('express-validator');

const validateExercise = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),

    body('exercise_type')
        .notEmpty().withMessage('Exercise type is required')
        .isLength({ max: 50 }).withMessage('Exercise type must be less than 50 characters'),

    body('main_muscle_group')
        .notEmpty().withMessage('Main muscle group is required')
        .isLength({ max: 50 }).withMessage('Main muscle group must be less than 50 characters'),

    body('required_equipment')
        .optional()
        .isLength({ max: 100 }).withMessage('Required equipment must be less than 100 characters'),

    body('tutorial_url')
        .optional()
        .isURL().withMessage('Invalid URL format'),

    body('measurement_type')
        .isIn(['RM', 'Borg', 'both']).withMessage('Invalid measurement type'),

    body('is_rm_exercise')
        .isBoolean().withMessage('is_rm_exercise must be a boolean value'),

    body('technical_instructions')
        .optional()
        .isLength({ max: 1000 }).withMessage('Technical instructions must be less than 1000 characters'),

    body('observations')
        .optional()
        .isLength({ max: 500 }).withMessage('Observations must be less than 500 characters')
];

module.exports = {
    validateExercise
};