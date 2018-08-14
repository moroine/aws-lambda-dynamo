import { deleteUser as deleteUserFromDb } from '../../repositories/userRepository';
import authenticate from '../security/authenticate';
import forbidden from '../security/forbidden';
import { addCorsHeaders } from '../security/cors';

const deleteUser = (event, context, callback) => {
  const { userId } = event.pathParameters;

  authenticate(event, context, callback)
    .then((currentUser) => {
      if (currentUser === null || !currentUser.isAdmin) {
        forbidden(callback);
      } else {
        deleteUserFromDb(userId)
          .then(() => {
            callback(null, {
              statusCode: 204,
              body: null,
              headers: addCorsHeaders(),
            });
          })
          .catch(() => {
            callback(null, {
              statusCode: 500,
              body: JSON.stringify({ error: 'Internal Server Error' }),
              headers: {
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-User-Id',
                'Access-Control-Allow-Origin': '*',
              },
            });
          });
      }
    });
};

export default deleteUser;
