import mockConsole from 'jest-mock-console';
import {
  getUserResources, saveResource, deleteResource,
} from '../../../src/repositories/resourceRepository';
import Resource from '../../../src/model/Resource';
import { docClient, getResourceTableName } from '../../../src/db';

jest.mock('../../../src/db');
jest.mock('../../../src/model/Resource');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:

  Resource.mockClear();
  docClient.put.mockClear();
  docClient.scan.mockClear();
  docClient.delete.mockClear();
  Resource.getNameFromId.mockClear();
  getResourceTableName.mockClear();
});

test('getUserResources should scan the database and return user Resource instances', (done) => {
  getResourceTableName.mockReturnValue('my-resource-table');

  const userId = 'uid';

  const r1 = { name: 'resource-1' };
  const r2 = { name: 'resource-2' };
  const r3 = { name: 'resource-3' };

  const data = {
    Items: [r1, r2, r3],
  };

  docClient.scan.mockImplementation((params, cb) => {
    cb(null, data);
  });

  const promise = getUserResources(userId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(docClient.scan).toHaveBeenCalledTimes(1);
    expect(docClient.scan.mock.calls[0]).toHaveLength(2);
    expect(docClient.scan.mock.calls[0][0]).toEqual({
      TableName: 'my-resource-table',
      ExpressionAttributeValues: {
        ':uid': userId,
      },
      FilterExpression: 'userId = :uid',
    });

    expect(result).toHaveLength(3);
    expect(Resource).toHaveBeenCalledTimes(3);
    expect(result[0]).toBe(Resource.mock.instances[0]);
    expect(result[1]).toBe(Resource.mock.instances[1]);
    expect(result[2]).toBe(Resource.mock.instances[2]);

    done();
  });
});

test('getUserResources should log unexpected errors', (done) => {
  getResourceTableName.mockReturnValue('my-resource-table');

  const userId = 'uid';
  const error = new Error('Unexpected');

  docClient.scan.mockImplementation((params, cb) => {
    expect(params).toEqual({
      TableName: 'my-resource-table',
      ExpressionAttributeValues: {
        ':uid': userId,
      },
      FilterExpression: 'userId = :uid',
    });

    cb(error, null);
  });

  const restoreConsole = mockConsole();

  const promise = getUserResources(userId);

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

test('saveResource should create new resource', (done) => {
  const resource = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  resource.validate.mockReturnValue({ valid: true, error: null });
  resource.save.mockReturnValue({ name: 'resourcername' });

  getResourceTableName.mockReturnValue('my-resource-table');

  docClient.put.mockImplementation((params, cb) => {
    cb(null, null);
  });

  const promise = saveResource(resource, true);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(resource.validate).toHaveBeenCalledTimes(1);
    expect(resource.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-resource-table',
      Item: { name: 'resourcername' },
      ConditionExpression: 'attribute_not_exists(resourceName)',
    });

    expect(result).toEqual({ success: true, result: null });

    done();
  });
});

test('saveResource should create duplicate resource', (done) => {
  const resource = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  resource.validate.mockReturnValue({ valid: true, error: null });
  resource.save.mockReturnValue({ name: 'resourcername' });

  getResourceTableName.mockReturnValue('my-resource-table');

  docClient.put.mockImplementation((params, cb) => {
    const error = new Error('Duplicated');
    error.name = 'ConditionalCheckFailedException';
    cb(error, null);
  });

  const promise = saveResource(resource, true);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(resource.validate).toHaveBeenCalledTimes(1);
    expect(resource.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-resource-table',
      Item: { name: 'resourcername' },
      ConditionExpression: 'attribute_not_exists(resourceName)',
    });

    expect(result).toEqual({ success: false, result: 'Resource already exists' });

    done();
  });
});

test('saveResource should reject on unexpected error', (done) => {
  const resource = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  resource.validate.mockReturnValue({ valid: true, error: null });
  resource.save.mockReturnValue({ name: 'resourcername' });

  getResourceTableName.mockReturnValue('my-resource-table');

  const error = new Error('Unexpected');
  docClient.put.mockImplementation((params, cb) => {
    cb(error, null);
  });

  const restoreConsole = mockConsole();
  const promise = saveResource(resource, true);

  expect(promise).toBeInstanceOf(Promise);

  return promise.catch((result) => {
    expect(resource.validate).toHaveBeenCalledTimes(1);
    expect(resource.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-resource-table',
      Item: { name: 'resourcername' },
      ConditionExpression: 'attribute_not_exists(resourceName)',
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

test('saveResource should not create invalid resource', (done) => {
  const resource = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  resource.validate.mockReturnValue({ valid: false, error: 'It is not valid' });

  const promise = saveResource(resource, true);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(resource.validate).toHaveBeenCalledTimes(1);
    expect(resource.save).toHaveBeenCalledTimes(0);

    expect(docClient.put).toHaveBeenCalledTimes(0);

    expect(result).toEqual({ success: false, result: 'It is not valid' });

    done();
  });
});

test('saveResource should update resource', (done) => {
  const resource = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  resource.validate.mockReturnValue({ valid: true, error: null });
  resource.save.mockReturnValue({ name: 'resourcername' });

  getResourceTableName.mockReturnValue('my-resource-table');

  docClient.put.mockImplementation((params, cb) => {
    cb(null, null);
  });

  const promise = saveResource(resource, false);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(resource.validate).toHaveBeenCalledTimes(1);
    expect(resource.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-resource-table',
      Item: { name: 'resourcername' },
    });

    expect(result).toEqual({ success: true, result: null });

    done();
  });
});

test('saveResource should reject on unexpected error (update case)', (done) => {
  const resource = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  resource.validate.mockReturnValue({ valid: true, error: null });
  resource.save.mockReturnValue({ name: 'resourcername' });

  getResourceTableName.mockReturnValue('my-resource-table');

  const error = new Error('Unexpected');
  docClient.put.mockImplementation((params, cb) => {
    cb(error, null);
  });

  const restoreConsole = mockConsole();
  const promise = saveResource(resource, false);

  expect(promise).toBeInstanceOf(Promise);

  return promise.catch((result) => {
    expect(resource.validate).toHaveBeenCalledTimes(1);
    expect(resource.save).toHaveBeenCalledTimes(1);

    expect(docClient.put).toHaveBeenCalledTimes(1);
    expect(docClient.put.mock.calls[0]).toHaveLength(2);
    expect(docClient.put.mock.calls[0][0]).toEqual({
      TableName: 'my-resource-table',
      Item: { name: 'resourcername' },
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

test('saveResource should not create invalid resource (update case)', (done) => {
  const resource = {
    validate: jest.fn(),
    save: jest.fn(),
  };

  resource.validate.mockReturnValue({ valid: false, error: 'It is not valid' });

  const promise = saveResource(resource, false);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then((result) => {
    expect(resource.validate).toHaveBeenCalledTimes(1);
    expect(resource.save).toHaveBeenCalledTimes(0);

    expect(docClient.put).toHaveBeenCalledTimes(0);

    expect(result).toEqual({ success: false, result: 'It is not valid' });

    done();
  });
});

test('deleteResource should delete resource', (done) => {
  getResourceTableName.mockReturnValue('my-resource-table');

  const resourceId = 'resource-id';
  const resourceName = 'resource-name-here';

  Resource.getNameFromId.mockReturnValue(resourceName);

  docClient.delete.mockImplementation((params, cb) => {
    expect(params).toEqual({ TableName: 'my-resource-table', Key: { resourceName } });

    cb(null, null);
  });

  const promise = deleteResource(resourceId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then(() => {
    expect(Resource.getNameFromId).toHaveBeenCalledTimes(1);
    expect(Resource.getNameFromId.mock.calls[0]).toEqual([resourceId]);

    expect(docClient.delete).toHaveBeenCalledTimes(1);

    done();
  });
});

test('deleteResource should resolves when cannot retrieve resourceName from id', (done) => {
  getResourceTableName.mockReturnValue('my-resource-table');

  const resourceId = 'resource-id';

  Resource.getNameFromId.mockReturnValue(null);

  const promise = deleteResource(resourceId);

  expect(promise).toBeInstanceOf(Promise);

  return promise.then(() => {
    expect(Resource.getNameFromId).toHaveBeenCalledTimes(1);
    expect(Resource.getNameFromId.mock.calls[0]).toEqual([resourceId]);

    expect(docClient.delete).toHaveBeenCalledTimes(0);

    done();
  });
});

test('deleteResource should reject on unexpected error', (done) => {
  const resourceId = 'resource-id';
  const resourceName = 'resource-name-here';

  Resource.getNameFromId.mockReturnValue(resourceName);

  getResourceTableName.mockReturnValue('my-resource-table');

  const error = new Error('Unexpected');

  docClient.delete.mockImplementation((params, cb) => {
    expect(params).toEqual({ TableName: 'my-resource-table', Key: { resourceName } });

    cb(error, null);
  });

  const restoreConsole = mockConsole();

  const promise = deleteResource(resourceId);

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
