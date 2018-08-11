import { docClient, getTableName } from './db';

const postResource = (event, context, callback) => {
  let body = null;
  try {
    body = JSON.parse(event.body);

    if (body === null || typeof body !== 'object') {
      throw new Error('Body should be an object');
    }
  } catch (e) {
    callback(
      null,
      {
        statusCode: 400,
        body: JSON.stringify({
          error: 'POST body is not a valid JSON object',
        }),
      },
    );

    return;
  }

  if (!body.resourceId) {
    callback(
      null,
      {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing key resourceId',
        }),
      },
    );

    return;
  }

  const params = {
    TableName: getTableName(),
    Item: {
      id: body.resourceId,
    },
    ConditionExpression: 'attribute_not_exists(id)',
  };

  docClient.put(params, (err) => {
    if (err) {
      switch (err.name) {
        case 'ConditionalCheckFailedException':
          callback(
            null,
            {
              statusCode: 400,
              body: JSON.stringify({
                error: 'Given resource already exists',
              }),
            },
          );
          break;
        default:
          // eslint-disable-next-line no-console
          console.error(err);

          callback(
            null,
            {
              statusCode: 500,
              body: JSON.stringify({
                error: 'Internal Server Error',
              }),
            },
          );
      }
    } else {
      callback(null, { statusCode: 204, body: null });
    }
  });
};

export default postResource;
