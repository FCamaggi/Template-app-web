const { Router } = require('express');
const router = Router();
const { create, getExerciseProgress, getSessionProgress, update, delete: deleteProgress } = require('../../controllers/api/progressController.js');
const { authenticate } = require('../../middlewares/auth.middleware.js');
const { validateActiveSession, validateProgressAccess } = require('../../middlewares/progress.middleware.js');
const { validateProgress, validateProgressQuery } = require('../../validators/progress.validator.js');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Crear nuevo progreso
router.post('/',
    validateProgress,
    validateActiveSession,
    create
);

// Ver progreso por ejercicio
router.get('/exercise/:exercise_id',
    validateProgressQuery,
    getExerciseProgress
);

// Ver progreso por sesión
router.get('/session/:session_id',
    getSessionProgress
);

// Operaciones sobre un progreso específico
router.put('/:id',
    validateProgressAccess,
    validateProgress,
    update
);

router.delete('/:id',
    validateProgressAccess,
    deleteProgress
);

module.exports = router;