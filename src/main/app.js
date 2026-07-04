const express = require('express');
const urlRoutes = require('./routes/urlRoutes');
const errorHandler = require('./exception/GlobalExceptionHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'URL shortener API is running',
        endpoints: [
            'POST /api/urls',
            'GET /api/urls',
            'GET /api/urls/:shortCode',
            'DELETE /api/urls/:shortCode',
            'GET /:shortCode'
        ]
    });
});

app.use(urlRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
