import querystring from 'querystring';
import { getUserResources } from '../../repositories/resourceRepository';
import authenticate from '../security/authenticate';
import forbidden from '../security/forbidden';
import { addCorsHeaders } from '../security/cors';

const listResource = (event, context, callback) => {
  const userId = querystring.escape(event.pathParameters.userId);

  authenticate(event, context, callback)
    .then((user) => {
      if (user === null || !(user.isAdmin || user.getId() === userId)) {
        forbidden(callback);
      } else {
        getUserResources(userId)
          .then((resources) => {
            callback(null, {
              statusCode: 200,
              body: JSON.stringify(resources.map(r => r.serialize())),
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

export default listResource;
