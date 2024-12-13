const { Router } = require('express');
const router = Router();
const { list, create, bulkCreate, update, delete: deleteSet, completeSet } = require('../../controllers/api/setController.js');
const { authenticate } = require('../../middlewares/auth.middleware.js');
const { validateTrainingAccess, validateSetAccess } = require('../../middlewares/set.middleware.js');
const { validateSet, validateBulkCreate, validateSetCompletion } = require('../../validators/set.validator.js');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas para training específico
router.get('/training/:training_id',
    validateTrainingAccess,
    list
);

// Creación individual y masiva
router.post('/',
    validateSet,
    create
);

router.post('/bulk',
    validateBulkCreate,
    bulkCreate
);

// Operaciones sobre un set específico
router.put('/:id',
    validateSetAccess,
    validateSet,
    update
);

router.delete('/:id',
    validateSetAccess,
    deleteSet
);

// Completar set (registrar resultados reales)
router.post('/:id/complete',
    validateSetAccess,
    validateSetCompletion,
    completeSet
);

module.exports = router;