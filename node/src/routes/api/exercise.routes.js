const express = require('express');
const exerciseController = require('../../controllers/api/exerciseController.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const { validateExercise } = require('../../validators/exercise.validator.js');

const router = express.Router();

// Rutas públicas
router.get('/', exerciseController.list);
router.get('/:id', exerciseController.get);

// Rutas protegidas para administradores
router.post('/',
    authMiddleware.authenticate,
    authMiddleware.checkRole(['admin']),
    validateExercise,
    exerciseController.create
);

router.put('/:id',
    authMiddleware.authenticate,
    authMiddleware.checkRole(['admin']),
    validateExercise,
    exerciseController.update
);

router.delete('/:id',
    authMiddleware.authenticate,
    authMiddleware.checkRole(['admin']),
    exerciseController.delete
);

module.exports = router;