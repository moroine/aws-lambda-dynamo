import { saveUser } from '../../repositories/userRepository';
import parseBody from '../helpers/parseBody';
import User from '../../model/User';

const postUser = (event, context, callback) => {
  const { success, result } = parseBody(event.body);

  if (!success) {
    callback(
      null,
      {
        statusCode: 400,
        body: JSON.stringify({ error: result }),
      },
    );

    return;
  }

  const user = new User(result);

  saveUser(user, true)
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
};

export default postUser;
