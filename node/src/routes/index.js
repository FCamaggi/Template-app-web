const { Router } = require('express');
const authRoutes = require('./api/auth.routes.js');
const exerciseRoutes = require('./api/exercise.routes.js');
const routineRoutes = require('./api/routine.routes.js');
const rmRoutes = require('./api/rm.routes.js');
const trainingRoutes = require('./api/training.routes.js');
const sessionRoutes = require('./api/session.routes.js');
const progressRoutes = require('./api/progress.routes.js');
const setRoutes = require('./api/set.routes.js');

const router = Router();

// Agregar logging para debugging
router.use((req, res, next) => {
    console.log(`Route handler: ${req.method} ${req.path}`);
    next();
});

// Rutas API
router.use('/auth', authRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/routines', routineRoutes);
router.use('/rm', rmRoutes);
router.use('/trainings', trainingRoutes);
router.use('/sessions', sessionRoutes);
router.use('/progress', progressRoutes);
router.use('/sets', setRoutes);

module.exports = router;