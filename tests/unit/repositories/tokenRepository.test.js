import mockConsole from 'jest-mock-console';
import {
  getUserTokens, saveToken, getToken,
} from '../../../src/repositories/tokenRepository';
import Token from '../../../src/model/Token';
import { docClient, getTokenTableName } from '../../../src/db';

jest.mock('../../../src/db');
jest.mock('../../../src/model/Token');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:

  Token.mockClear();
  docClient.put.mockClear();
  docClient.scan.mockClear();
  docClient.get.mockClear();
  getTokenTableName.mockClear();
});

test('getUserTokens should scan the database and return user Token instances', (done) => {
  getTokenTableName.mockReturnValue('my-token-table');

  const userId = 'uid';

  const r1 = { name: 'token-1' };
  const r2 = { name: 'token-2' };
  const r3 = { name: 'token-3' };

  const data = {
    Items: [r1, r2, r3],
  };

  docClient.scan.mockImplementation((params, cb) => {
    cb(null, data);
  });

  const promise = getUserTokens(userId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(docClient.scan).toHaveBeenCalledTimes(1);
    expect(docClient.scan.mock.calls[0]).toHaveLength(2);
    expect(docClient.scan.mock.calls[0][0]).toEqual({
      TableName: 'my-token-table',
      ExpressionAttributeValues: {
        ':uid': userId,
      },
      FilterExpression: 'userId = :uid',
    });

    expect(result).toHaveLength(3);
    expect(Token).toHaveBeenCalledTimes(3);
    expect(result[0]).toBe(Token.mock.instances[0]);
    expect(result[1]).toBe(Token.mock.instances[1]);
    expect(result[2]).toBe(Token.mock.instances[2]);

    done();
  });
});

test('getUserTokens should log unexpected errors', (done) => {
  getTokenTableName.mockReturnValue('my-token-table');

  const userId = 'uid';
  const error = new Error('Unexpected');

  docClient.scan.mockImplementation((params, cb) => {
    expect(params).toEqual({
      TableName: 'my-token-table',
      ExpressionAttributeValues: {
        ':uid': userId,
      },
      FilterExpression: 'userId = :uid',
    });

    cb(error, null);
  });

  const restoreConsole = mockConsole();

  const promise = getUserTokens(userId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.catch((e) => {
    expect(e).toBe(error);
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0]).toHaveLength(1);
    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0][0]).toBe(error);


    restoreConsole();
    done();
  });
});

test('saveToken should create new token', (done) => {
  const token = {
    save: jest.fn(),
  };

  token.save.mockReturnValue({ name: 'tokenrname' });

  getTokenTableName.mockReturnValue('my-token-table');

  docClient.put.mockImplementation((params, cb) => {
    cb(null, null);
  });

  const promise = saveToken(token);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(token.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-token-table',
      Item: { name: 'tokenrname' },
      ConditionExpression: 'attribute_not_exists(#t)',
      ExpressionAttributeNames: {
        '#t': 'token',
      },
    });

    expect(result).toEqual({ success: true, result: null });

    done();
  });
});

test('saveToken should reject on unexpected error', (done) => {
  const token = {
    save: jest.fn(),
  };

  token.save.mockReturnValue({ token: 'token', userId: 'uid' });

  getTokenTableName.mockReturnValue('my-token-table');

  const error = new Error('Unexpected');
  docClient.put.mockImplementation((params, cb) => {
    cb(error, null);
  });

  const restoreConsole = mockConsole();
  const promise = saveToken(token);

  expect(promise).toBeInstanceOf(Promise);

  return promise.catch((result) => {
    expect(token.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-token-table',
      Item: { token: 'token', userId: 'uid' },
      ConditionExpression: 'attribute_not_exists(#t)',
      ExpressionAttributeNames: {
        '#t': 'token',
      },
    });

    expect(result).toEqual(error);

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line no-console
    expect(console.error.mock.calls).toHaveLength(1);
    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0]).toEqual([error]);
    restoreConsole();
    done();
  });
});

test('getToken should get user token', (done) => {
  getTokenTableName.mockReturnValue('my-token-table');

  const userId = 'uid';
  const token = 'a-token';

  docClient.get.mockImplementation((params, cb) => {
    expect(params).toEqual({ TableName: 'my-token-table', Key: { token, userId } });

    cb(null, { Item: { token } });
  });

  const promise = getToken(token, userId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(docClient.get).toHaveBeenCalledTimes(1);

    expect(Token).toHaveBeenCalledTimes(1);
    expect(result).toBe(Token.mock.instances[0]);
    done();
  });
});

test('getToken should reject on unexpected error', (done) => {
  const userId = 'uid';
  const token = 'a-token';

  getTokenTableName.mockReturnValue('my-token-table');

  const error = new Error('Unexpected');

  docClient.get.mockImplementation((params, cb) => {
    expect(params).toEqual({ TableName: 'my-token-table', Key: { token, userId } });

    cb(error, null);
  });

  const restoreConsole = mockConsole();

  const promise = getToken(token, userId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.catch((e) => {
    expect(e).toBe(error);
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0]).toHaveLength(1);
    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0][0]).toBe(error);

    restoreConsole();
    done();
  });
});
