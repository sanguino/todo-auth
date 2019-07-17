import { MongoClient, ObjectId } from 'mongodb';
import debugLib from 'debug';
import { permissionsSchema, usersSchema } from '../utils/schemas';

const debug = debugLib('todo-api:mongo:interface');

let dbConnectionPromise;

export default class DataInterface {
  static async mongoConnect() {
    if (dbConnectionPromise) {
      return dbConnectionPromise;
    }

    const URI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

    dbConnectionPromise = new Promise((resolve, reject) => {
      MongoClient.connect(URI, { useNewUrlParser: true }, async (err, db) => {
        if (err || db === null) {
          reject(err);
        }
        const dbInstance = db.db(process.env.MONGO_DB);
        debug(`Db connected ${process.env.MONGO_DB}`);

        await dbInstance.createCollection('auth-permissions', permissionsSchema);
        await dbInstance.createCollection('auth-users', usersSchema);
        await dbInstance.collection('auth-users').createIndex({ username: 1 }, { unique: true });
        debug('collection created');

        const retrieveHealth = () => (!dbInstance ? false : dbInstance.serverConfig.isConnected());

        const retrievePermissions = async data => {
          const user = await dbInstance.collection('auth-users').findOne({
            username: data.username,
          });
          if (user === null || user.password !== data.password) {
            return Promise.reject(user);
          }

          const promises = user.permissions.map(async id => {
            const result = await dbInstance.collection('auth-permissions').findOne({
              _id: new ObjectId(id),
            });
            return result.name;
          });
          const permissions = await Promise.all(promises);
          return Promise.resolve(permissions);
        };

        resolve({
          retrieveHealth,
          retrievePermissions,
        });
      });
    });

    return dbConnectionPromise;
  }
}
