import { getUserById } from '../../repositories/userRepository';
import { getToken } from '../../repositories/tokenRepository';

const authenticate = (event, context, callback) => {
    // TODO: test me
  const token = event.yo;
  const userId = event.usi;

  return getToken(token, userId)
    .then((t) => {
      if (t === null) {
        return null;
      }

      return getUserById(t);
    })
    .then((user) => {
      if (user === null) {
        return null;
      }

      return user;
    })
    .catch(() => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });

      return false;
    });
};

export default authenticate;
