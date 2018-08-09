import { DynamoDB } from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();
const params = {
  TableName: process.env.TABLE_NAME,
};

const postResource = (event, context, callback) => {
  let body = null;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    callback(null, {
      statusCode: 400,
      body: {
        success: false,
        error: 'POST body is not a valid JSON object',
      },
    });

    return;
  }

  params.Item = {
    id: body.resourceId,
  };

  docClient.put(params, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
      });
    }
  });
};

export default postResource;
