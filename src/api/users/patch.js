import parseBody from '../helpers/parseBody';
import { getUserById, saveUser } from '../../repositories/userRepository';
import forbidden from '../security/forbidden';
import authenticate from '../security/authenticate';
import { addCorsHeaders } from '../security/cors';

const patchUser = (event, context, callback) => {
  authenticate(event, context, callback)
    .then((currentUser) => {
      if (currentUser === null || !currentUser.isAdmin) {
        forbidden(callback);
      } else {
        const { success, result } = parseBody(event.body);

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

        const { id } = event.pathParameters;
        getUserById(id)
          .then((user) => {
            if (user === null) {
              callback(null, {
                statusCode: 404,
                body: JSON.stringify({ error: 'user not found' }),
                headers: addCorsHeaders(),
              });

              return Promise.resolve();
            }

            user.update(result);

            return saveUser(user, false)
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
              body: JSON.stringify({ error: 'Internal Server Error' }),
              headers: addCorsHeaders(),
            });
          });
      }
    });
};

export default patchUser;
