import Boom from '@hapi/boom';
import debugLib from 'debug';
import jwt from 'jsonwebtoken';
import checkAuthBody from '../utils/validateRequest';
import DataInterface from './DataInterface';

const debug = debugLib('todo-api:express:controller');

class TasksController {
  static async retrieveHealth(req, res, next) {
    const dataInterface = await DataInterface.mongoConnect();
    const health = dataInterface.retrieveHealth();
    debug('health', health);
    if (!health) {
      return next(Boom.internal());
    }
    return res.sendStatus(200);
  }

  static async retrievePermissions(req, res, next) {
    await checkAuthBody(req.body).catch(() => next(Boom.badRequest('no username or password received')));

    try {
      const dataInterface = await DataInterface.mongoConnect();
      const data = await dataInterface.retrievePermissions({
        username: req.body.username,
        password: req.body.password,
      });
      const token = jwt.sign(
        {
          username: req.body.username,
          permissions: data,
        },
        process.env.SUPER_SECRET,
        {
          expiresIn: process.env.TOKEN_EXPIRATION,
        },
      );
      debug('response token', token);
      res.json({ token });
    } catch (err) {
      next(Boom.unauthorized('bad username or password'));
    }
  }
}

export default TasksController;
