const { body } = require('express-validator');

const validateRM = [
    body('weight')
        .isFloat({ min: 0 })
        .withMessage('Weight must be a positive number'),

    body('reps')
        .isInt({ min: 1, max: 12 })
        .withMessage('Reps must be between 1 and 12'),

    body('exerciseId')
        .isInt()
        .withMessage('Valid exercise ID is required')
];

module.exports = {
    validateRM
};