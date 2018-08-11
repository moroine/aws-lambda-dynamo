import { getAllUsers } from '../../repositories/userRepository';

const listUser = (event, context, callback) => {
  getAllUsers
    .then((users) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(users.map(user => user.serialize())),
      });
    })
    .catch(() => {
      callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
    });
};

export default listUser;
