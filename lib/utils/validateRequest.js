import Joi from '@hapi/joi';
import debugLib from 'debug';

const debug = debugLib('todo-auth:validators');

const validate = (params = {}, schema, msg) => {
  const result = Joi.validate(params, schema);
  if (result.error === null) {
    debug('validation ok', params);
    return Promise.resolve();
  }
  debug('validation err', msg);
  return Promise.reject(msg);
};

export default function checkAuthBody(params) {
  const schema = Joi.object()
    .required()
    .keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
  debug('checkAuthBody', params);
  return validate(params, schema, 'validation handler: invalid user/pass provided');
}
