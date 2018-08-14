import { getUserById } from '../../repositories/userRepository';
import { getToken } from '../../repositories/tokenRepository';
import { addCorsHeaders } from './cors';

const authenticate = (event, context, callback) => {
  // TODO: test me

  const headerKeys = Object.keys(event.headers);

  let authorizationToken = null;
  let userId = null;
  headerKeys.forEach((headerKey) => {
    if (headerKey.toLowerCase() === 'authorization') {
      const authorization = event.headers[headerKey];
      const matches = authorization.trim().match(/Bearer (\w+)/i);
      if (matches) {
        ([, authorizationToken] = matches);
      }
    }

    if (headerKey.toLowerCase() === 'x-user-id') {
      userId = event.headers[headerKey];
      if (userId) {
        userId = userId.trim();
      }
    }
  });

  if (!authorizationToken || !userId) {
    console.log(`Token or userId not found: ${authorizationToken} - ${userId}`);
    return Promise.resolve(null);
  }

  return getToken(authorizationToken, userId)
    .then((t) => {
      if (t === null) {
        console.log(`Token not found:  ${authorizationToken} - ${userId}`);
        return null;
      }

      return getUserById(userId);
    })
    .then((user) => {
      if (user === null) {
        console.log(`User not found: ${userId}`);
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
