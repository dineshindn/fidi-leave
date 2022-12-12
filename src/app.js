const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./config/config');
// solving the CORS issue
const cors = require('cors');
app.use(cors());
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Leave Tracker API',
            description: 'API Documentation',
            contact: {
                name: 'API'
            },
            servers: [`http://localhost:${config.PORT}/`],
            basePath: '/api/v2',
            version: '0.0.2',
            
        },
        schemes: ['https'],
    },
    apis: ['./src/router/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(passport.initialize());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the LeaveTracker API v2.0',
        environment: process.env.NODE_ENV,
        test_env: config.TEST_ENV
        
    });
});

app.use('/api/v2/', require('./router/index'));

module.exports = app;