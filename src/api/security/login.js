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


};

export default login;
