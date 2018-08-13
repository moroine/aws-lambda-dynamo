import crypto from 'crypto';
import parseBody from '../helpers/parseBody';
import { getUserById } from '../../repositories/userRepository';
import User from '../../model/User';
import { saveToken } from '../../repositories/tokenRepository';
import Token from '../../model/Token';

const login = (event, context, callback) => {
    // TODO: test me

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

  const { email, password } = result;
  if (!email || !password) {
    callback(
      null,
      {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email or password' }),
      },
    );

    return;
  }

  const uid = User.getIdFromEmail(email);
  if (!uid) {
    callback(
      null,
      {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email or password' }),
      },
    );

    return;
  }

  getUserById(uid)
    .then((user) => {
      if (user === null || !user.isValidPassword(email, password)) {
        callback(
          null,
          {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid email or password' }),
          },
        );

        return;
      }

      crypto.randomBytes(48, (err, buffer) => {
        if (err) {
          // eslint-disable-next-line no-console
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
        const d = new Date();
        const token = new Token({
          userId: uid,
          token: t,
          ttl: Math.round(d.getTime() / 1000),
        });

        saveToken(token).then(() => {
          callback(
            null,
            {
              statusCode: 200,
              body: JSON.stringify({
                user: user.serialize(),
                token: token.serialize(),
              }),
            },
          );
        });
      });
    });
};

export default login;
