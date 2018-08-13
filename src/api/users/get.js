import { getUserById } from '../../repositories/userRepository';
import authenticate from '../security/authenticate';
import forbidden from '../security/forbidden';

const getUser = (event, context, callback) => {
  const { id } = event.pathParameters;

  authenticate(event, context, callback)
    .then((currentUser) => {
      if (currentUser === null || !currentUser.isAdmin) {
        forbidden(callback);
      } else {
        getUserById(id)
          .then((user) => {
            if (user === null) {
              callback(null, {
                statusCode: 404,
                body: JSON.stringify({ error: 'user not found' }),
              });
            } else {
              callback(null, {
                statusCode: 200,
                body: JSON.stringify(user.serialize()),
              });
            }
          })
          .catch(() => {
            callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
          });
      }
    });
};

export default getUser;
