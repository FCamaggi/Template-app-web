const { Router } = require('express');
const router = Router();
const { list, reorderTrainings, create, get, update, delete: deleteTraining } = require('../../controllers/api/trainingController.js');
const { authenticate } = require('../../middlewares/auth.middleware.js');
const { validateRoutineAccess, validateTrainingAccess } = require('../../middlewares/training.middleware.js');
const { validateTraining, validateReorder } = require('../../validators/training.validator.js');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas para rutina específica
router.get('/routine/:routine_id',
    validateRoutineAccess,
    list
);

router.post('/routine/:routine_id/reorder',
    validateRoutineAccess,
    validateReorder,
    reorderTrainings
);

// Operaciones individuales de training
router.post('/',
    validateTraining,
    create
);

router.get('/:id',
    validateTrainingAccess,
    get
);

router.put('/:id',
    validateTrainingAccess,
    validateTraining,
    update
);

router.delete('/:id',
    validateTrainingAccess,
    deleteTraining
);

module.exports = router;