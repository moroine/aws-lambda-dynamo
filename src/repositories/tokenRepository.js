import { getTokenTableName, docClient } from '../db';
import Token from '../model/Token';

const getUserTokens = userId => new Promise((resolve, reject) => {
  const params = {
    TableName: getTokenTableName(),
    ExpressionAttributeValues: {
      ':uid': userId,
    },
    FilterExpression: 'userId = :uid',
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return reject(err);
    }

    return resolve(data.Items.map(r => new Token(r)));
  });
});

const saveToken = (token) => {
  const params = {
    TableName: getTokenTableName(),
    Item: token.save(),
    ConditionExpression: 'attribute_not_exists(#t)',
    ExpressionAttributeNames: {
      '#t': 'token',
    },
  };

  return new Promise((resolve, reject) => {
    docClient.put(params, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);

        reject(err);
      } else {
        resolve({ success: true, result: null });
      }
    });
  });
};

const getToken = (token, userId) => new Promise((resolve, reject) => {
  const params = {
    TableName: getTokenTableName(),
    Key: { token, userId },
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

    return resolve(new Token(data.Item));
  });
});

export {
  getUserTokens,
  saveToken,
  getToken,
};
