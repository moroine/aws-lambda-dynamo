import { deleteResource as deleteResourceFromDb } from '../../repositories/resourceRepository';
import authenticate from '../security/authenticate';
import forbidden from '../security/forbidden';

const deleteResource = (event, context, callback) => {
  const { userId, resourceId } = event.pathParameters;

  authenticate(event, context, callback)
    .then((user) => {
      if (user === null || !(user.isAdmin || user.userId === userId)) {
        forbidden(callback);
      } else {
        deleteResourceFromDb(userId, resourceId)
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

export default deleteResource;
