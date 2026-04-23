import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Invoice API",
      version: "1.0.0",
      description: "Invoice Management API Documentation",
    },
    servers: [
      {
        url: process.env.BASE_URL,
        description: "Live server",
      },
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Local server",
      },
    ],
  },

  apis: [path.join(__dirname, "../routes/*.js")],
};

export const swaggerSpec = swaggerJSDoc(options);
