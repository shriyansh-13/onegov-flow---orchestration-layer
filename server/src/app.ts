import express, { Express } from "express";
import healthRoutes from "./routes/healthRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

/**
 * Creates and configures the Express application
 */
export function createApp(): Express {
  const app = express();

  app.use(express.json());

  // Mount API endpoints
  app.use("/api", healthRoutes);
  app.use("/api", applicationRoutes);

  return app;
}

export const app = createApp();
export default app;
