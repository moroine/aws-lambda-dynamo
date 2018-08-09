import { DynamoDB } from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();
const params = {
  TableName: process.env.TABLE_NAME,
};

const listResource = (event, context, callback) => {

  docClient.get(params, (err, data) => {
    if (err) {
      console.log('Error', err);
      callback(null, { statusCode: 500, body: 'OUps' });
    } else {
      callback(null, {
        statusCode: 200,
        body: 'Fuck it', //  JSON.stringify(data),
      });
    }
  });
};

export default listResource;
