import { getUserById } from '../../repositories/userRepository';
import { getToken } from '../../repositories/tokenRepository';
import { addCorsHeaders } from './cors';

const authenticate = (event, context, callback) => {
  // TODO: test me

  const { Authorization, 'X-User-Id': userId } = event.headers;
  if (!Authorization || !userId) {
    return Promise.resolve(null);
  }

  const matches = Authorization.match(/Bearer (\w+)/i);
  if (!matches) {
    return Promise.resolve(null);
  }

  return getToken(matches[1], userId)
    .then((t) => {
      if (t === null) {
        return null;
      }

      return getUserById(userId);
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
        headers: addCorsHeaders(),
      });

      return false;
    });
};

export default authenticate;
