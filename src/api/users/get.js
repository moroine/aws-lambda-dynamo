import { getUserById } from '../../repositories/userRepository';

const getUser = (event, context, callback) => {
  const { id } = event.pathParameters;

  getUserById(id)
    .then((user) => {
      if (user === null) {
        callback(null, {
          statusCode: 404,
          body: JSON.stringify({ error: 'user not found' }),
        });
      } else {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(user.serialize()),
        });
      }
    })
    .catch(() => {
      callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
    });
};

export default getUser;
