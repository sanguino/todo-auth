export const usersSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'password', 'permissions'],
      properties: {
        username: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        password: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        permissions: {
          bsonType: 'array',
          description: 'must be an array of strings and is required',
          items: {
            bsonType: 'string',
            description: 'must be a string',
          },
        },
      },
    },
  },
};

export const permissionsSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
      },
    },
  },
};
