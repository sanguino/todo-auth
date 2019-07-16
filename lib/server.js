import debugLib from 'debug';
import http from 'http';
import app from './app';
import dataInterface from './controllers/DataInterface';

async function init() {
  const debug = debugLib('todo-api:server');
  await dataInterface.mongoConnect();
  const server = http.createServer(app);
  const port = process.env.PORT || '3000';

  debug(`Conected to mongo db: ${process.env.MONGO_DB}`);

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    switch (error.code) {
      case 'EACCES':
        debug(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        debug(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  }

  app.set('port', port);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

init();
