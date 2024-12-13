const express = require('express');
const authController = require('../../controllers/api/authController.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const { validateRegister, validateLogin } = require('../../validators/auth.validator.js');

const router = express.Router();

// Logging para debugging
router.use((req, res, next) => {
    console.log(`Auth route: ${req.method} ${req.path}`);
    next();
});

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/profile', authMiddleware.authenticate, authController.profile);

module.exports = router;