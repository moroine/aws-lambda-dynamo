import { getAllUsers } from '../../repositories/userRepository';
import authenticate from '../security/authenticate';
import forbidden from '../security/forbidden';

const listUser = (event, context, callback) => {
  authenticate(event, context, callback)
    .then((currentUser) => {
      if (currentUser === null || !currentUser.isAdmin) {
        forbidden(callback);
      } else {
        getAllUsers()
          .then((users) => {
            callback(null, {
              statusCode: 200,
              body: JSON.stringify(users.map(user => user.serialize())),
            });
          })
          .catch(() => {
            callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
          });
      }
    });
};

export default listUser;
