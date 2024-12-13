# GymRoutine Manager

## Descripción

Aplicación web para gestionar y personalizar rutinas de entrenamiento. Digitaliza rutinas en PDF y personaliza los pesos según el RM (Repetición Máxima) de cada usuario. Incluye seguimiento de progreso y adaptación automática de cargas.

## Tecnologías Utilizadas

- Frontend: React con Vite
- Backend: Node.js con Express
- Base de Datos: PostgreSQL
- ORM: Sequelize
- Contenedores: Docker
- OCR: Tesseract.js (para procesar PDFs)
- Cálculos: mathjs (para fórmulas de RM)

## Estructura del Proyecto

```bash
proyecto/
│
├── react/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Exercise/
│   │   │   ├── Routine/
│   │   │   └── Training/
│   │   ├── pages/
│   │   └── utils/
│   └── Dockerfile
│
├── node/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Exercise.js
│   │   │   ├── Routine.js
│   │   │   └── User.js
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── pdfProcessor.js
│   │   │   └── rmCalculator.js
│   │   └── routes/
│   └── Dockerfile
│
└── docker-compose.yml
```

## Variables de Entorno

```.env
DB_NAME=gym_routine_db
DB_USER=gym_user
DB_PASSWORD=your_password
OCR_API_KEY=your_key
```

## Características Principales

- Procesamiento de rutinas en PDF
- Cálculo automático de pesos según RM
- Seguimiento de progreso
- Personalización por usuario
- Historial de entrenamientos

## Desarrollo

### Preparación Base de Datos

```bash
docker-compose exec backend npx sequelize-cli db:migrate
docker-compose exec backend npx sequelize-cli db:seed:all
```

### Iniciar en Desarrollo

```bash
docker-compose up --build -d
```

Acceso:

- App: http://localhost:8000
- API: http://localhost:3000
