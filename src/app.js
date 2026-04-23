import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import invoiceRoutes from "./routes/invoice.route.js";
import { getSwaggerSpec } from "./config/swagger.js";

const swaggerSpec = getSwaggerSpec();

const app = express();

app.use(express.json());
app.use(cors());

// Mount routes
app.use("/api", invoiceRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
