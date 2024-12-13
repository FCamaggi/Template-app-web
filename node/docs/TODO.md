# TODO

## 8. APIs y Endpoints [En progreso]

### Autenticación [✓]

- [✓] POST /api/auth/register
- [✓] POST /api/auth/login
- [✓] GET /api/auth/profile

### Ejercicios [✓]

- [✓] GET /api/exercises
- [✓] POST /api/exercises (admin)
- [✓] PUT /api/exercises/:id (admin)
- [✓] DELETE /api/exercises/:id (admin)

### RMs y Progresiones [✓]

- [✓] POST /api/rm/calculate
- [✓] GET /api/rm/user/:userId/exercise/:exerciseId
- [✓] POST /api/rm/suggest-weight
- [✓] GET /api/rm/history/:exerciseId

### Rutinas [✓]

- [✓] GET /api/routines
- [✓] POST /api/routines
- [✓] GET /api/routines/:id
- [✓] PUT /api/routines/:id
- [✓] DELETE /api/routines/:id
- [✓] POST /api/routines/:id/duplicate

### Sesiones [✓]

- [✓] POST /api/sessions/start
- [✓] POST /api/sessions/:id/finish
- [✓] POST /api/sessions/:id/cancel
- [✓] GET /api/sessions/active
- [✓] GET /api/sessions/history

### Training [✓]

- [✓] GET /api/training/routine/:routine_id
- [✓] POST /api/training
- [✓] PUT /api/training/:id
- [✓] DELETE /api/training/:id
- [✓] POST /api/training/routine/:routine_id/reorder

### Sets [✓]

- [✓] GET /api/sets/training/:training_id
- [✓] POST /api/sets
- [✓] POST /api/sets/bulk
- [✓] PUT /api/sets/:id
- [✓] DELETE /api/sets/:id
- [✓] POST /api/sets/:id/complete

### Progress [✓]

- [✓] POST /api/progress
- [✓] GET /api/progress/exercise/:exercise_id
- [✓] GET /api/progress/session/:session_id
- [✓] PUT /api/progress/:id
- [✓] DELETE /api/progress/:id
