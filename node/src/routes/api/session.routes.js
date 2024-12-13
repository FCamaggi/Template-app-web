const { Router } = require('express');
const router = Router();
const { getActiveSession, getSessionHistory, start, getSessionDetails, finish, cancel } = require('../../controllers/api/sessionController.js');
const { authenticate } = require('../../middlewares/auth.middleware.js');
const { checkActiveSession, validateSessionAccess, validateSessionStatus } = require('../../middlewares/session.middleware.js');
const { validateSessionStart, validateSessionFinish, validateHistoryQuery } = require('../../validators/session.validator.js');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener sesión activa y historial
router.get('/active', getActiveSession);
router.get('/history', validateHistoryQuery, getSessionHistory);

// Iniciar nueva sesión
router.post('/start',
    validateSessionStart,
    checkActiveSession,
    start
);

// Operaciones sobre una sesión específica
router.get('/:id',
    validateSessionAccess,
    getSessionDetails
);

router.post('/:id/finish',
    validateSessionStatus,
    validateSessionFinish,
    finish
);

router.post('/:id/cancel',
    validateSessionStatus,
    cancel
);

module.exports = router;