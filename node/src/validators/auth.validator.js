const { body } = require('express-validator');

const validateRegister = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('name')
        .notEmpty()
        .withMessage('Name is required')
];

const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

module.exports = {
    validateRegister,
    validateLogin
};