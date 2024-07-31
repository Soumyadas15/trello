import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const BACKEND_URL = process.env.BACKEND_URL;

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Workflo API',
            version: '1.0.0',
            description: 'API documentation for trello clone created using Node.js and Typescript.',
        },
        servers: [
            {
                url: `http://localhost:8080/api`,
            },
        ],
    },
    apis: [
            './src/api/routes/auth/*.ts', 
            './src/api/routes/auth/oauth/*.ts',
            './src/api/routes/student/*.ts',
            './src/api/routes/admin/*.ts',
            './src/api/routes/task/*.ts',
        ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
