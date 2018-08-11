import { docClient, getUserTableName } from '../../db';
import User from '../../model/User';

const deleteUser = (event, context, callback) => {
  const { id } = event.pathParameters;

  const email = User.getEmailFromId(id);

  if (email === null) {
    callback(null, {
      statusCode: 204,
      body: null,
    });

    return;
  }

  const params = {
    TableName: getUserTableName(),
    Key: { email },
  };

  docClient.delete(params, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
    } else {
      callback(null, {
        statusCode: 204,
        body: null,
      });
    }
  });
};

export default deleteUser;
