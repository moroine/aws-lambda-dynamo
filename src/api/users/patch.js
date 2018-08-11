import { docClient, getUserTableName } from '../../db';
import parseBody from '../helpers/parseBody';
import User from '../../model/User';
import getUserById, { saveUser } from '../../repositories/userRepository';

const patchUser = (event, context, callback) => {
  const { success, result } = parseBody(event.body);

  if (!success) {
    callback(
      null,
      {
        statusCode: 400,
        body: JSON.stringify(result),
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
        });

        return Promise.resolve();
      }

      user.update(result);

      return saveUser(user, false)
        .then(({ success: successSave, result: resultSave }) => {
          if (successSave) {
            callback(null, { statusCode: 204, body: null });
          } else {
            callback(null, { statusCode: 400, body: JSON.stringify({ error: resultSave }) });
          }
        })
        .catch(() => {
          callback(null, {
            statusCode: 500,
            body: JSON.stringify({
              error: 'Internal Server Error',
            }),
          });
        });
    })
    .catch(() => {
      callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
    });
};

export default patchUser;
