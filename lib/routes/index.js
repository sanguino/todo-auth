import { Router } from 'express';
import ExampleController from '../controllers/ExampleController';

function getRoutes() {
  const routes = Router();
  routes.get('/', ExampleController.getAll);
  routes.get('/:id', ExampleController.getSingleThing);
  return routes;
}

export default getRoutes();
