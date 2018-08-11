import { getResourceTableName, docClient } from '../db';
import Resource from '../model/Resource';

const getUserResources = userId => new Promise((resolve, reject) => {
  const params = {
    TableName: getResourceTableName(),
    ExpressionAttributeValues: {
      ':uid': userId,
    },
    FilterExpression: 'userId = :uid',
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);

      return reject(err);
    }

    // if (!data.Item) {
    //   return resolve(null);
    // }

    return resolve(data);
  });
});

const getResourceById = id => new Promise((resolve, reject) => {
  const resourceName = Resource.getNameFromId(id);

  if (resourceName === null) {
    resolve(null);
    return;
  }

  const params = {
    TableName: getResourceTableName(),
    Key: { resourceName },
  };

  docClient.get(params, (err, data) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);

      return reject(err);
    }

    if (!data.Item) {
      return resolve(null);
    }

    return resolve(new Resource(data.Item));
  });
});

const saveResource = (resource, isNew) => {
  const { valid, error } = resource.validate();

  if (!valid) {
    return Promise.resolve({
      success: false,
      result: error,
    });
  }

  const params = {
    TableName: getResourceTableName(),
    Item: resource.save(),
  };

  if (isNew) {
    params.ConditionExpression = 'attribute_not_exists(resourceName)';
  }

  return new Promise((resolve, reject) => {
    docClient.put(params, (err) => {
      if (err) {
        switch (err.name) {
          case 'ConditionalCheckFailedException':
            resolve({
              success: false,
              result: 'Resource already exists',
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

export {
  getUserResources,
  getResourceById,
  saveResource,
};
