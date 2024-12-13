const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index.js');

const app = express();

// Configurar morgan para logging más detallado
app.use(logger(':method :url :status :response-time ms - :res[content-length]'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Agregar middleware para loggear todas las rutas
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    next();
});

// Mantener /api como prefijo base
app.use('/', routes);

// Endpoint de salud
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Manejar 404
app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Manejar errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

module.exports = app;