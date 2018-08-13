import crypto from 'crypto';
import parseBody from '../helpers/parseBody';

const login = (event, context, callback) => {
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

  crypto.randomBytes(48, (err, buffer) => {
    if (err) {
        console.error(err);
      callback(
        null,
        {
          statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }),
        },
      );

      return;
    }

    const t = buffer.toString('hex');
  });
};

export default login;
