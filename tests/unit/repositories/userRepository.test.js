import mockConsole from 'jest-mock-console';
import {
  getAllUsers, getUserById, saveUser, deleteUser,
} from '../../../src/repositories/userRepository';
import User from '../../../src/model/User';
import { docClient, getUserTableName } from '../../../src/db';

jest.mock('../../../src/db');
jest.mock('../../../src/model/User');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:

  User.mockClear();
  docClient.get.mockClear();
  docClient.put.mockClear();
  docClient.scan.mockClear();
  docClient.delete.mockClear();
  User.getEmailFromId.mockClear();
  getUserTableName.mockClear();
});

test('getAllUsers should scan the database and return User instances', (done) => {
  getUserTableName.mockReturnValue('my-user-table');

  const u1 = { name: 'user-1' };
  const u2 = { name: 'user-2' };
  const u3 = { name: 'user-3' };

  const data = {
    Items: [u1, u2, u3],
  };

  docClient.scan.mockImplementation((params, cb) => {
    expect(params).toEqual({ TableName: 'my-user-table' });

    cb(null, data);
  });

  const promise = getAllUsers();

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(result).toHaveLength(3);
    expect(User).toHaveBeenCalledTimes(3);
    expect(result[0]).toBe(User.mock.instances[0]);
    expect(result[1]).toBe(User.mock.instances[1]);
    expect(result[2]).toBe(User.mock.instances[2]);

    done();
  });
});

test('getAllUsers should log unecpected errors', (done) => {
  getUserTableName.mockReturnValue('my-user-table');

  const error = new Error('Unexpected');

  docClient.scan.mockImplementation((params, cb) => {
    expect(params).toEqual({ TableName: 'my-user-table' });

    cb(error, null);
  });

  const restoreConsole = mockConsole();

  const promise = getAllUsers();

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

test('getUserById should return User instance', (done) => {
  getUserTableName.mockReturnValue('my-user-table');

  const userId = 'user-id';
  const email = 'me@mail.com';

  User.getEmailFromId.mockReturnValue(email);

  docClient.get.mockImplementation((params, cb) => {
    expect(params).toEqual({ TableName: 'my-user-table', Key: { email } });

    cb(null, { Item: { name: 'me' } });
  });

  const promise = getUserById(userId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(User.getEmailFromId).toHaveBeenCalledTimes(1);
    expect(User.getEmailFromId.mock.calls[0]).toEqual([userId]);

    expect(docClient.get).toHaveBeenCalledTimes(1);

    expect(User).toHaveBeenCalledTimes(1);
    expect(result).toBe(User.mock.instances[0]);

    done();
  });
});

test('getUserById should log unexpected errors', (done) => {
  const userId = 'user-id';
  const email = 'me@mail.com';

  User.getEmailFromId.mockReturnValue(email);

  getUserTableName.mockReturnValue('my-user-table');

  const error = new Error('Unexpected');

  docClient.get.mockImplementation((params, cb) => {
    expect(params).toEqual({ TableName: 'my-user-table', Key: { email } });

    cb(error, null);
  });

  const restoreConsole = mockConsole();

  const promise = getUserById(userId);

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

test('getUserById should return null if not found', (done) => {
  getUserTableName.mockReturnValue('my-user-table');

  const userId = 'user-id';
  const email = 'me@mail.com';

  User.getEmailFromId.mockReturnValue(email);

  docClient.get.mockImplementation((params, cb) => {
    expect(params).toEqual({ TableName: 'my-user-table', Key: { email } });

    cb(null, { });
  });

  const promise = getUserById(userId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(User.getEmailFromId).toHaveBeenCalledTimes(1);
    expect(User.getEmailFromId.mock.calls[0]).toEqual([userId]);

    expect(docClient.get).toHaveBeenCalledTimes(1);

    expect(User).toHaveBeenCalledTimes(0);
    expect(result).toBe(null);

    done();
  });
});

test('getUserById should return null if cannot retrieve email from id', (done) => {
  getUserTableName.mockReturnValue('my-user-table');

  const userId = 'user-id';

  User.getEmailFromId.mockReturnValue(null);

  const promise = getUserById(userId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(User.getEmailFromId).toHaveBeenCalledTimes(1);
    expect(User.getEmailFromId.mock.calls[0]).toEqual([userId]);

    expect(docClient.get).toHaveBeenCalledTimes(0);

    expect(User).toHaveBeenCalledTimes(0);
    expect(result).toBe(null);

    done();
  });
});

test('saveUser should create new user', (done) => {
  const user = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  user.validate.mockReturnValue({ valid: true, error: null });
  user.save.mockReturnValue({ name: 'userrname' });

  getUserTableName.mockReturnValue('my-user-table');

  docClient.put.mockImplementation((params, cb) => {
    cb(null, null);
  });

  const promise = saveUser(user, true);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(user.validate).toHaveBeenCalledTimes(1);
    expect(user.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-user-table',
      Item: { name: 'userrname' },
      ConditionExpression: 'attribute_not_exists(email)',
    });

    expect(result).toEqual({ success: true, result: null });

    done();
  });
});

test('saveUser should create duplicate user', (done) => {
  const user = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  user.validate.mockReturnValue({ valid: true, error: null });
  user.save.mockReturnValue({ name: 'userrname' });

  getUserTableName.mockReturnValue('my-user-table');

  docClient.put.mockImplementation((params, cb) => {
    const error = new Error('Duplicated');
    error.name = 'ConditionalCheckFailedException';
    cb(error, null);
  });

  const promise = saveUser(user, true);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(user.validate).toHaveBeenCalledTimes(1);
    expect(user.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-user-table',
      Item: { name: 'userrname' },
      ConditionExpression: 'attribute_not_exists(email)',
    });

    expect(result).toEqual({ success: false, result: 'User already exists' });

    done();
  });
});

test('saveUser should reject on unexpected error', (done) => {
  const user = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  user.validate.mockReturnValue({ valid: true, error: null });
  user.save.mockReturnValue({ name: 'userrname' });

  getUserTableName.mockReturnValue('my-user-table');

  const error = new Error('Unexpected');
  docClient.put.mockImplementation((params, cb) => {
    cb(error, null);
  });

  const restoreConsole = mockConsole();
  const promise = saveUser(user, true);

  expect(promise).toBeInstanceOf(Promise);

  return promise.catch((result) => {
    expect(user.validate).toHaveBeenCalledTimes(1);
    expect(user.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-user-table',
      Item: { name: 'userrname' },
      ConditionExpression: 'attribute_not_exists(email)',
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

test('saveUser should not create invalid user', (done) => {
  const user = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  user.validate.mockReturnValue({ valid: false, error: 'It is not valid' });

  const promise = saveUser(user, true);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(user.validate).toHaveBeenCalledTimes(1);
    expect(user.save).toHaveBeenCalledTimes(0);

    expect(docClient.put).toHaveBeenCalledTimes(0);

    expect(result).toEqual({ success: false, result: 'It is not valid' });

    done();
  });
});

test('saveUser should update user', (done) => {
  const user = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  user.validate.mockReturnValue({ valid: true, error: null });
  user.save.mockReturnValue({ name: 'userrname' });

  getUserTableName.mockReturnValue('my-user-table');

  docClient.put.mockImplementation((params, cb) => {
    cb(null, null);
  });

  const promise = saveUser(user, false);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(user.validate).toHaveBeenCalledTimes(1);
    expect(user.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-user-table',
      Item: { name: 'userrname' },
    });

    expect(result).toEqual({ success: true, result: null });

    done();
  });
});

test('saveUser should reject on unexpected error (update case)', (done) => {
  const user = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  user.validate.mockReturnValue({ valid: true, error: null });
  user.save.mockReturnValue({ name: 'userrname' });

  getUserTableName.mockReturnValue('my-user-table');

  const error = new Error('Unexpected');
  docClient.put.mockImplementation((params, cb) => {
    cb(error, null);
  });

  const restoreConsole = mockConsole();
  const promise = saveUser(user, false);

  expect(promise).toBeInstanceOf(Promise);

  return promise.catch((result) => {
    expect(user.validate).toHaveBeenCalledTimes(1);
    expect(user.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-user-table',
      Item: { name: 'userrname' },
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

test('saveUser should not create invalid user (update case)', (done) => {
  const user = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  user.validate.mockReturnValue({ valid: false, error: 'It is not valid' });

  const promise = saveUser(user, false);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(user.validate).toHaveBeenCalledTimes(1);
    expect(user.save).toHaveBeenCalledTimes(0);

    expect(docClient.put).toHaveBeenCalledTimes(0);

    expect(result).toEqual({ success: false, result: 'It is not valid' });

    done();
  });
});

test('deleteUser should delete user', (done) => {
  getUserTableName.mockReturnValue('my-user-table');

  const userId = 'user-id';
  const email = 'me@mail.com';

  User.getEmailFromId.mockReturnValue(email);

  docClient.delete.mockImplementation((params, cb) => {
    expect(params).toEqual({ TableName: 'my-user-table', Key: { email } });

    cb(null, null);
  });

  const promise = deleteUser(userId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then(() => {
    expect(User.getEmailFromId).toHaveBeenCalledTimes(1);
    expect(User.getEmailFromId.mock.calls[0]).toEqual([userId]);

    expect(docClient.delete).toHaveBeenCalledTimes(1);

    done();
  });
});

test('deleteUser should resolves when cannot retrieve email from id', (done) => {
  getUserTableName.mockReturnValue('my-user-table');

  const userId = 'user-id';

  User.getEmailFromId.mockReturnValue(null);

  const promise = deleteUser(userId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then(() => {
    expect(User.getEmailFromId).toHaveBeenCalledTimes(1);
    expect(User.getEmailFromId.mock.calls[0]).toEqual([userId]);

    expect(docClient.delete).toHaveBeenCalledTimes(0);

    done();
  });
});

test('deleteUser should reject on unexpected error', (done) => {
  const userId = 'user-id';
  const email = 'me@mail.com';

  User.getEmailFromId.mockReturnValue(email);

  getUserTableName.mockReturnValue('my-user-table');

  const error = new Error('Unexpected');

  docClient.delete.mockImplementation((params, cb) => {
    expect(params).toEqual({ TableName: 'my-user-table', Key: { email } });

    cb(error, null);
  });

  const restoreConsole = mockConsole();

  const promise = deleteUser(userId);

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
