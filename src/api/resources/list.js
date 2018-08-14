import { getUserResources } from '../../repositories/resourceRepository';
import authenticate from '../security/authenticate';
import forbidden from '../security/forbidden';

const listResource = (event, context, callback) => {
  const { userId } = event.pathParameters;

  authenticate(event, context, callback)
    .then((user) => {
      if (user === null || !(user.isAdmin || user.userId === userId)) {
        forbidden(callback);
      } else {
        getUserResources(userId)
          .then((resources) => {
            callback(null, {
              statusCode: 200,
              body: JSON.stringify(resources.map(r => r.serialize())),
            });
          })
          .catch(() => {
            callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
          });
      }
    });
};

export default listResource;
