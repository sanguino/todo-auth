import { Router } from 'express';
import TasksController from '../controllers/TasksController';

function getRoutes() {
  const routes = Router();
  routes.get('/auth/health', TasksController.retrieveHealth);
  routes.post('/auth', TasksController.retrievePermissions);
  routes.all('*', (req, res) => {
    const resText = `req.originalUrl: ${req.originalUrl}, req.baseUrl: ${req.baseUrl}, req.path: ${req.path}`;
    return res.status(404).send(resText);
  });
  return routes;
}

export default getRoutes();
