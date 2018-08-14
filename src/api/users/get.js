import { getUserById } from '../../repositories/userRepository';
import authenticate from '../security/authenticate';
import forbidden from '../security/forbidden';
import { addCorsHeaders } from '../security/cors';

const getUser = (event, context, callback) => {
  const { id } = event.pathParameters;

  authenticate(event, context, callback)
    .then((currentUser) => {
      if (currentUser === null || !currentUser.isAdmin) {
        forbidden(callback);
      } else {
        getUserById(id)
          .then((user) => {
            if (user === null) {
              callback(null, {
                statusCode: 404,
                body: JSON.stringify({ error: 'user not found' }),
                headers: addCorsHeaders(),
              });
            } else {
              callback(null, {
                statusCode: 200,
                body: JSON.stringify(user.serialize()),
                headers: addCorsHeaders(),
              });
            }
          })
          .catch(() => {
            callback(null, {
              statusCode: 500,
              body: JSON.stringify({ error: 'Internal Server Error' }),
              headers: addCorsHeaders(),
            });
          });
      }
    });
};

export default getUser;
