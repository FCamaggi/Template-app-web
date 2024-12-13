const { Router } = require('express');
const router = Router();
const { list, create, get, update, delete: deleteRoutine, duplicate } = require('../../controllers/api/routineController.js');
const { authenticate } = require('../../middlewares/auth.middleware.js');
const { checkOwnership, validateRoutineAccess } = require('../../middlewares/routine.middleware.js');
const { validateRoutine } = require('../../validators/routine.validator.js');

// Rutas protegidas - requieren autenticación
router.use(authenticate);

// Listado y creación
router.get('/', list);
router.post('/', validateRoutine, create);

// Operaciones sobre una rutina específica
router.get('/:id', checkOwnership, get);
router.put('/:id',
    validateRoutineAccess,
    validateRoutine,
    update
);
router.delete('/:id',
    validateRoutineAccess,
    deleteRoutine
);

// Duplicar rutina
router.post('/:id/duplicate',
    checkOwnership,
    duplicate
);

module.exports = router;