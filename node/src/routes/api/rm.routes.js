const { Router } = require('express');
const router = Router();
const { calculateRM, getUserRM, suggestWeight } = require('../../controllers/api/rmController.js');
const { validateExerciseType, validateAccess } = require('../../middlewares/rmValidation.middleware.js');
const { validateRM } = require('../../validators/rm.validator.js');

router.post('/calculate',
    validateRM,
    validateExerciseType,
    calculateRM
);

router.get('/user/:userId/exercise/:exerciseId',
    validateAccess,
    getUserRM
);

router.post('/suggest-weight',
    validateExerciseType,
    suggestWeight
);

module.exports = router;