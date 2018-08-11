import { DynamoDB } from 'aws-sdk';

const options = {};

if (process.env.NODE_ENV !== 'production') {
  options.endpoint = 'http://awslambdadynamo_dynamodb_1:8000';
}

const docClient = new DynamoDB.DocumentClient(options);
const TableName = process.env.TABLE_NAME;

const getTableName = () => TableName;

export {
  docClient,
  getTableName,
};
