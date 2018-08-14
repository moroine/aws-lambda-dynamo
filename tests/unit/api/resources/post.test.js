import postResource from '../../../../src/api/resources/post';
import parseBody from '../../../../src/api/helpers/parseBody';
import Resource from '../../../../src/model/Resource';
import { saveResource } from '../../../../src/repositories/resourceRepository';
import authenticate from '../../../../src/api/security/authenticate';

jest.mock('../../../../src/api/helpers/parseBody');
jest.mock('../../../../src/model/Resource');
jest.mock('../../../../src/repositories/resourceRepository');
jest.mock('../../../../src/api/security/authenticate');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  parseBody.mockClear();
  saveResource.mockClear();
  Resource.mockClear();
  authenticate.mockClear();
});

test('Should return client error if invalid given body', (done) => {
  const event = {
    body: Symbol('event body'),
    pathParameters: {
      userId: 'my-user-id',
    },
  };

  authenticate.mockResolvedValue({ userId: 'my-user-id' });

  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: false,
      result: 'Error from parse',
    };
  });

  const responseCb = (err, resp) => {
    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        error: 'Error from parse',
      }),
    });

    done();
  };

  postResource(event, null, responseCb);
});

test('Should create a new Resource', (done) => {
  const data = {
    name: 'this is a resource',
  };

  authenticate.mockResolvedValue({ userId: 'my-user-id' });

  const event = {
    body: JSON.stringify(data),
    pathParameters: {
      userId: 'my-user-id',
    },
  };

  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: true,
      result: data,
    };
  });

  saveResource.mockResolvedValue({
    success: true,
    result: null,
  });

  const responseCb = (err, resp) => {
    expect(saveResource).toHaveBeenCalledTimes(1);
    expect(Resource).toHaveBeenCalledTimes(1);
    expect(Resource.mock.calls[0]).toEqual([{ name: 'this is a resource', userId: 'my-user-id' }]);

    expect(saveResource.mock.calls).toHaveLength(1);
    expect(saveResource.mock.calls[0]).toHaveLength(2);

    const [user, isNew] = (saveResource.mock.calls[0]);
    expect(user).toBe(Resource.mock.instances[0]);
    expect(isNew).toBe(true);

    expect(err).toBe(null);
    expect(resp).toEqual({ statusCode: 204, body: null });

    done();
  };

  postResource(event, null, responseCb);
});

test('Should return client error if saveResource is not success', (done) => {
  const data = {
    name: 'this is a resource',
  };

  const event = {
    body: JSON.stringify(data),
    pathParameters: {
      userId: 'my-user-id',
    },
  };

  authenticate.mockResolvedValue({ userId: 'my-user-id' });

  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: true,
      result: data,
    };
  });

  saveResource.mockResolvedValue({
    success: false,
    result: 'Invalid data',
  });

  const responseCb = (err, resp) => {
    expect(saveResource).toHaveBeenCalledTimes(1);
    expect(Resource).toHaveBeenCalledTimes(1);
    expect(Resource.mock.calls[0]).toEqual([{ name: 'this is a resource', userId: 'my-user-id' }]);

    expect(saveResource.mock.calls).toHaveLength(1);
    expect(saveResource.mock.calls[0]).toHaveLength(2);

    const [resource, isNew] = (saveResource.mock.calls[0]);
    expect(resource).toBe(Resource.mock.instances[0]);
    expect(isNew).toBe(true);

    expect(err).toBe(null);
    expect(resp).toEqual({ statusCode: 400, body: JSON.stringify({ error: 'Invalid data' }) });

    done();
  };

  postResource(event, null, responseCb);
});

test('Should return server error on unexpected error', (done) => {
  const data = {
    name: 'this is a resource',
  };

  const event = {
    body: JSON.stringify(data),
    pathParameters: {
      userId: 'my-user-id',
    },
  };

  authenticate.mockResolvedValue({ userId: 'my-user-id' });

  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: true,
      result: data,
    };
  });

  saveResource.mockRejectedValue(new Error('Unexpected error'));

  const responseCb = (err, resp) => {
    expect(saveResource).toHaveBeenCalledTimes(1);
    expect(Resource).toHaveBeenCalledTimes(1);
    expect(Resource.mock.calls[0]).toEqual([{ name: 'this is a resource', userId: 'my-user-id' }]);

    expect(saveResource.mock.calls).toHaveLength(1);
    expect(saveResource.mock.calls[0]).toHaveLength(2);

    const [user, isNew] = (saveResource.mock.calls[0]);
    expect(user).toBe(Resource.mock.instances[0]);
    expect(isNew).toBe(true);

    expect(err).toBe(null);
    expect(resp).toEqual({ statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });

    done();
  };

  postResource(event, null, responseCb);
});
