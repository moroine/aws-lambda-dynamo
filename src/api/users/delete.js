import { deleteUser as deleteUserFromDb } from '../../repositories/userRepository';

const deleteUser = (event, context, callback) => {
  const { id } = event.pathParameters;

  deleteUserFromDb(id)
    .then(() => {
      callback(null, {
        statusCode: 204,
        body: null,
      });
    })
    .catch(() => {
      callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
    });
};

export default deleteUser;
