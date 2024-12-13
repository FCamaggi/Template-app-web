# GymRoutine API Documentation

## Base URL

```
http://localhost:3000/api
```

## Autenticación

Todas las rutas (excepto auth) requieren el header de autenticación:

```
Authorization: Bearer <token>
```

### Endpoints de Autenticación

#### Registro de Usuario

```
POST /auth/register

Body:
{
    "email": "string",
    "password": "string",
    "name": "string"
}

Response: {
    "message": "User registered successfully",
    "user": {
        "id": number,
        "email": "string",
        "name": "string",
        "role": "user" | "admin" | "guest"
    },
    "token": "string"
}
```

#### Login

```
POST /auth/login

Body:
{
    "email": "string",
    "password": "string"
}

Response: {
    "message": "Login successful",
    "user": {
        "id": number,
        "email": "string",
        "name": "string",
        "role": "string"
    },
    "token": "string"
}
```

#### Perfil

```
GET /auth/profile

Response: {
    "user": {
        "id": number,
        "email": "string",
        "name": "string",
        "role": "string",
        "preferred_measurement": "RM" | "Borg",
        "experience_level": "beginner" | "intermediate" | "advanced"
    }
}
```

### Ejercicios

#### Listar Ejercicios

```
GET /exercises?page=1&limit=10&type=string&muscle_group=string&measurement_type=string&is_rm_exercise=boolean&search=string

Response: {
    "status": "success",
    "data": [
        {
            "id": number,
            "name": "string",
            "description": "string",
            "exercise_type": "string",
            "main_muscle_group": "string",
            "required_equipment": "string",
            "tutorial_url": "string",
            "technical_instructions": "string",
            "observations": "string",
            "measurement_type": "RM" | "Borg" | "both",
            "is_rm_exercise": boolean
        }
    ],
    "pagination": {
        "total": number,
        "page": number,
        "pages": number
    }
}
```

#### Crear Ejercicio (Admin)

```
POST /exercises

Body: {
    "name": "string",
    "description": "string",
    "exercise_type": "string",
    "main_muscle_group": "string",
    "required_equipment": "string",
    "tutorial_url": "string",
    "technical_instructions": "string",
    "observations": "string",
    "measurement_type": "RM" | "Borg" | "both",
    "is_rm_exercise": boolean
}
```

#### Actualizar Ejercicio (Admin)

```
PUT /exercises/:id

Body: [Mismos campos que en create]
```

#### Eliminar Ejercicio (Admin)

```
DELETE /exercises/:id
```

### Rutinas

#### Listar Rutinas

```
GET /routines?page=1&limit=10&type=string&difficulty=string&is_template=boolean&search=string

Response: {
    "status": "success",
    "data": [
        {
            "id": number,
            "name": "string",
            "description": "string",
            "type": "full_body" | "split" | "upper_lower" | "push_pull_legs",
            "difficulty": "beginner" | "intermediate" | "advanced",
            "estimated_time": number,
            "creator_id": number,
            "is_template": boolean,
            "Trainings": [
                {
                    "id": number,
                    "exercise_id": number,
                    "order": number,
                    "Exercise": {
                        "id": number,
                        "name": "string"
                    }
                }
            ]
        }
    ],
    "pagination": {
        "total": number,
        "page": number,
        "pages": number
    }
}
```

#### Crear Rutina

```
POST /routines

Body: {
    "name": "string",
    "description": "string",
    "type": "full_body" | "split" | "upper_lower" | "push_pull_legs",
    "difficulty": "beginner" | "intermediate" | "advanced",
    "estimated_time": number,
    "mesocycle_type": "string",
    "microcycle_type": "string",
    "warmup_description": "string",
    "cooldown_description": "string",
    "notes": "string",
    "is_template": boolean
}
```

#### Duplicar Rutina

```
POST /routines/:id/duplicate

Response: {
    "status": "success",
    "data": "Routine Object",
    "message": "Routine duplicated successfully"
}
```

### Entrenamientos (Trainings)

#### Listar Entrenamientos de Rutina

```
GET /training/routine/:routine_id

Response: {
    "status": "success",
    "data": [
        {
            "id": number,
            "routine_id": number,
            "exercise_id": number,
            "order": number,
            "training_type": "strength" | "hypertrophy" | "endurance" | "power",
            "notes": "string",
            "tempo": "string",
            "unilateral": boolean,
            "superset_with": number,
            "Exercise": {
                "id": number,
                "name": "string"
            },
            "Sets": [
                "Set Objects..."
            ]
        }
    ]
}
```

#### Crear Entrenamiento

```
POST /training

Body: {
    "routine_id": number,
    "exercise_id": number,
    "order": number,
    "training_type": "strength" | "hypertrophy" | "endurance" | "power",
    "notes": "string",
    "tempo": "string", // formato "X-X-X-X"
    "unilateral": boolean,
    "superset_with": number
}
```

### Series (Sets)

#### Listar Series de Entrenamiento

```
GET /sets/training/:training_id

Response: {
    "status": "success",
    "data": [
        {
            "id": number,
            "training_id": number,
            "order": number,
            "type": "warmup" | "work",
            "reps": "string",
            "weight_type": "RM_percentage" | "direct_weight" | "Borg",
            "weight_value": number,
            "rm_percentage": number,
            "borg_target": number,
            "rest_time": number,
            "completed": boolean,
            "actual_reps": number,
            "actual_weight": number,
            "actual_borg": number
        }
    ]
}
```

#### Crear Series en Bulk

```
POST /sets/bulk

Body: {
    "training_id": number,
    "sets": [
        {
            "order": number,
            "type": "warmup" | "work",
            "reps": "string",
            "weight_type": "RM_percentage" | "direct_weight" | "Borg",
            "weight_value": number,
            "rm_percentage": number,
            "borg_target": number,
            "rest_time": number
        }
    ]
}
```

### Sesiones

#### Iniciar Sesión

```
POST /sessions/start

Body: {
    "routine_id": number
}
```

#### Obtener Sesión Activa

```
GET /sessions/active

Response: {
    "status": "success",
    "data": {
        "id": number,
        "routine_id": number,
        "start_time": "datetime",
        "status": "in_progress",
        "Routine": {
            "id": number,
            "name": "string",
            "Trainings": [
                "Training Objects with Exercises..."
            ]
        }
    }
}
```

#### Finalizar Sesión

```
POST /sessions/:id/finish

Body: {
    "overall_difficulty": number,
    "energy_level": number,
    "notes": "string",
    "calories_burned": number
}
```

### Progreso

#### Registrar Progreso

```
POST /progress

Body: {
    "exercise_id": number,
    "session_id": number,
    "weight_used": number,
    "reps_performed": number,
    "borg_rating": number,
    "technique_rating": number,
    "perceived_difficulty": number,
    "notes": "string"
}
```

#### Ver Progreso de Ejercicio

```
GET /progress/exercise/:exercise_id?startDate=ISO8601&endDate=ISO8601&limit=10

Response: {
    "status": "success",
    "data": {
        "progress": [
            {
                "id": number,
                "weight_used": number,
                "reps_performed": number,
                "borg_rating": number,
                "Session": {
                    "id": number,
                    "start_time": "datetime"
                }
            }
        ],
        "stats": {
            "maxWeight": number,
            "avgWeight": number,
            "maxReps": number,
            "avgReps": number,
            "totalSets": number
        }
    }
}
```

## Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "status": "error",
  "message": "string",
  "errors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

### Códigos de Estado HTTP

- 200: Éxito
- 201: Creado exitosamente
- 400: Error de validación
- 401: No autenticado
- 403: No autorizado
- 404: Recurso no encontrado
- 500: Error interno del servidor

## Notas Adicionales

1. Paginación: Los endpoints que listan resultados aceptan parámetros:

   - page: número de página (default: 1)
   - limit: resultados por página (default: 10)

2. Filtros: Muchos endpoints aceptan parámetros de filtrado vía query string

3. Autenticación: Token JWT debe ser enviado en header como:

   ```
   Authorization: Bearer <token>
   ```

4. Role-based access:
   - Usuarios normales solo pueden acceder a sus propios recursos
   - Admins pueden acceder y modificar todos los recursos
   - Las plantillas (templates) son accesibles por todos los usuarios
