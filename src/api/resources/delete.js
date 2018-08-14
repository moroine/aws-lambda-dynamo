import { deleteResource as deleteResourceFromDb } from '../../repositories/resourceRepository';
import authenticate from '../security/authenticate';
import forbidden from '../security/forbidden';
import { addCorsHeaders } from '../security/cors';

const deleteResource = (event, context, callback) => {
  const { userId, resourceId } = event.pathParameters;

  authenticate(event, context, callback)
    .then((user) => {
      if (user === null || !(user.isAdmin || user.getId() === userId)) {
        forbidden(callback);
      } else {
        deleteResourceFromDb(userId, resourceId)
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
              headers: addCorsHeaders(),
            });
          });
      }
    });
};

export default deleteResource;
