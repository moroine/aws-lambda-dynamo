import { saveResource, checkQuota } from '../../repositories/resourceRepository';
import parseBody from '../helpers/parseBody';
import Resource from '../../model/Resource';
import authenticate from '../security/authenticate';
import forbidden from '../security/forbidden';
import { addCorsHeaders } from '../security/cors';

const postResource = (event, context, callback) => {
  const { success, result } = parseBody(event.body);
  const { userId } = event.pathParameters;

  authenticate(event, context, callback)
    .then((user) => {
      if (user === null || !(user.isAdmin || user.getId() === userId)) {
        forbidden(callback);
      } else {
        if (!success) {
          callback(
            null,
            {
              statusCode: 400,
              body: JSON.stringify({ error: result }),
              headers: addCorsHeaders(),
            },
          );

          return;
        }

        result.userId = userId;

        checkQuota(userId)
          .then((isAllowed) => {
            if (!isAllowed) {
              callback(null, {
                statusCode: 400,
                body: JSON.stringify({ error: 'Quota reached' }),
                headers: addCorsHeaders(),
              });

              return Promise.resolve();
            }

            const resource = new Resource(result);

            return saveResource(resource, true)
              .then(({ success: successSave, result: resultSave }) => {
                if (successSave) {
                  callback(null, {
                    statusCode: 204,
                    body: null,
                    headers: addCorsHeaders(),
                  });
                } else {
                  callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({ error: resultSave }),
                    headers: addCorsHeaders(),
                  });
                }
              });
          })
          .catch(() => {
            callback(null, {
              statusCode: 500,
              body: JSON.stringify({
                error: 'Internal Server Error',
              }),
              headers: addCorsHeaders(),
            });
          });
      }
    });
};

export default postResource;
