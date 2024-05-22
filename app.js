require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const PORT = process.env.PORT || 3000;
const userRoute = require('./routes/userRoute');

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.dbURI);
const db = mongoose.connection;

db.on('connected', () => {
    console.log('connected to mongodb!');
});
db.on('error', (err) => {
    console.log(err, 'error connecting to mongodb');
});

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Login/Signup API',
            version: '1.0.0',
            description: 'API documentation for Project',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            }
        ],
    },
    apis: ['./controllers/userController.js'],
};
const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', userRoute);

app.listen(PORT, () => {
    console.log(`server running at http://locahost:${PORT}`);
    console.log(`Go to the Api doc, click here =>  http://localhost:${PORT}/api-docs`);
});