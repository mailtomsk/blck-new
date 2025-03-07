import type { Application, Router } from "express";
import * as ROUTES from "../components";

const routes: [string, Router][] = [
  ["user", ROUTES.UserRouter],
  ["movie", ROUTES.MovieRouter],
  ["category", ROUTES.CateogryRouter],
  ["host", ROUTES.HostRouter]
];

const router = (app: Application): void => {
  routes.forEach(([path, controller]) => {
    app.use(`/api/v1/${path}`, controller);
  });
};

// Health check routes
const setupHealthRoutes = (app: Application): void => {
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/hello', (_req, res) => {
    res.json({ message: 'Hello API!' });
  });
};

export default (app: Application): void => {
  setupHealthRoutes(app);
  router(app);
};