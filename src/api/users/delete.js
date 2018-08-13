import { deleteUser as deleteUserFromDb } from '../../repositories/userRepository';
import authenticate from '../security/authenticate';
import forbidden from '../security/forbidden';

const deleteUser = (event, context, callback) => {
  const { id } = event.pathParameters;

  authenticate(event, context, callback)
    .then((currentUser) => {
      if (currentUser === null || !currentUser.isAdmin) {
        forbidden(callback);
      } else {
        deleteUserFromDb(id)
          .then(() => {
            callback(null, {
              statusCode: 204,
              body: null,
            });
          })
          .catch(() => {
            callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
          });
      }
    });
};

export default deleteUser;
