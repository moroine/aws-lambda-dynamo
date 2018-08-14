import { getUserTableName, docClient } from '../db';
import User from '../model/User';

const getAllUsers = () => {
  const params = {
    TableName: getUserTableName(),
  };

  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);

        reject(err);
      } else {
        resolve(data.Items.map(d => new User(d)));
      }
    });
  });
};

const getUserById = id => new Promise((resolve, reject) => {
  const email = User.getEmailFromId(id);

  if (email === null) {
    resolve(null);
    return;
  }

  const params = {
    TableName: getUserTableName(),
    Key: { email },
  };

  docClient.get(params, (err, data) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return reject(err);
    }

    if (!data.Item) {
      return resolve(null);
    }

    return resolve(new User(data.Item));
  });
});

const saveUser = (user, isNew) => {
  const { valid, error } = user.validate();

  if (!valid) {
    return Promise.resolve({
      success: false,
      result: error,
    });
  }

  const params = {
    TableName: getUserTableName(),
    Item: user.save(),
  };

  if (isNew) {
    params.ConditionExpression = 'attribute_not_exists(email)';
  }

  return new Promise((resolve, reject) => {
    docClient.put(params, (err) => {
      if (err) {
        switch (err.name) {
          case 'ConditionalCheckFailedException':
            resolve({
              success: false,
              result: 'User already exists',
            });
            break;
          default:
            // eslint-disable-next-line no-console
            console.error(err);

            reject(err);
        }
      } else {
        resolve({ success: true, result: null });
      }
    });
  });
};

const deleteUser = (id) => {
  // TODO: Remove resources
  // TODO: Remove tokens
  const email = User.getEmailFromId(id);

  if (email === null) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const params = {
      TableName: getUserTableName(),
      Key: { email },
    };

    docClient.delete(params, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);

        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export {
  getAllUsers,
  getUserById,
  saveUser,
  deleteUser,
};
