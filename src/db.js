import { DynamoDB } from 'aws-sdk';

const options = {};

if (process.env.NODE_ENV !== 'production') {
  options.endpoint = 'http://awslambdadynamo_dynamodb_1:8000';
}

const docClient = new DynamoDB.DocumentClient(options);

const resourceTableName = process.env.TABLE_RESOURCE;
const userTableName = process.env.TABLE_USER;

const getResourceTableName = () => resourceTableName;
const getUserTableName = () => userTableName;

export {
  docClient,
  getResourceTableName,
  getUserTableName,
};
