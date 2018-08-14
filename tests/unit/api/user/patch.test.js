import patchUser from '../../../../src/api/users/patch';
import User from '../../../../src/model/User';
import parseBody from '../../../../src/api/helpers/parseBody';
import { getUserById, saveUser } from '../../../../src/repositories/userRepository';
import authenticate from '../../../../src/api/security/authenticate';

jest.mock('../../../../src/api/helpers/parseBody');
jest.mock('../../../../src/model/User');
jest.mock('../../../../src/repositories/userRepository');
jest.mock('../../../../src/api/security/authenticate');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  parseBody.mockClear();
  saveUser.mockClear();
  getUserById.mockClear();
  User.mockClear();
  authenticate.mockClear();
});

test('Should return client error if invalid given body', (done) => {
  const event = {
    body: Symbol('event body'),
  };
  authenticate.mockResolvedValue({ userId: 'uid', isAdmin: true });

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

  patchUser(event, null, responseCb);
});

test('Should return not found if user does not exists', (done) => {
  const data = {
    email: 'moroine.bentefrit@mail.com',
    password: 'my-password',
  };

  const event = {
    pathParameters: {
      id: 42,
    },
    body: JSON.stringify(data),
  };

  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: true,
      result: data,
    };
  });

  getUserById.mockResolvedValue(null);
  authenticate.mockResolvedValue({ userId: 'uid', isAdmin: true });

  const responseCb = (err, resp) => {
    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 404,
      body: JSON.stringify({ error: 'user not found' }),
    });

    done();
  };

  patchUser(event, null, responseCb);
});

test('Should update the user', (done) => {
  const data = {
    password: 'my-password',
  };

  const event = {
    pathParameters: {
      id: 42,
    },
    body: JSON.stringify(data),
  };
  authenticate.mockResolvedValue({ userId: 'uid', isAdmin: true });

  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: true,
      result: data,
    };
  });

  const userMock = new User();
  getUserById.mockResolvedValue(userMock);

  saveUser.mockResolvedValue({ success: true, result: null });

  const responseCb = (err, resp) => {
    expect(getUserById).toHaveBeenCalledTimes(1);
    expect(getUserById.mock.calls[0]).toEqual([event.pathParameters.id]);

    expect(userMock.update).toHaveBeenCalledTimes(1);
    expect(userMock.update.mock.calls[0]).toEqual([data]);

    expect(saveUser).toHaveBeenCalledTimes(1);
    expect(saveUser.mock.calls[0]).toHaveLength(2);
    expect(saveUser.mock.calls[0][0]).toBe(userMock);
    expect(saveUser.mock.calls[0][1]).toBe(false);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 204,
      body: null,
    });

    done();
  };

  patchUser(event, null, responseCb);
});

test('Should return client error if saveUser is not success', (done) => {
  const data = {
    password: 'my-password',
  };

  const event = {
    pathParameters: {
      id: 42,
    },
    body: JSON.stringify(data),
  };
  authenticate.mockResolvedValue({ userId: 'uid', isAdmin: true });

  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: true,
      result: data,
    };
  });

  const userMock = new User();
  getUserById.mockResolvedValue(userMock);

  saveUser.mockResolvedValue({ success: false, result: 'Invalid data' });

  const responseCb = (err, resp) => {
    expect(getUserById).toHaveBeenCalledTimes(1);
    expect(getUserById.mock.calls[0]).toEqual([event.pathParameters.id]);

    expect(userMock.update).toHaveBeenCalledTimes(1);
    expect(userMock.update.mock.calls[0]).toEqual([data]);

    expect(saveUser).toHaveBeenCalledTimes(1);
    expect(saveUser.mock.calls[0]).toHaveLength(2);
    expect(saveUser.mock.calls[0][0]).toBe(userMock);
    expect(saveUser.mock.calls[0][1]).toBe(false);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid data' }),
    });

    done();
  };

  patchUser(event, null, responseCb);
});

test('Should return internal server error if saveUSer is rejected', (done) => {
  const data = {
    password: 'my-password',
  };

  const event = {
    pathParameters: {
      id: 42,
    },
    body: JSON.stringify(data),
  };
  authenticate.mockResolvedValue({ userId: 'uid', isAdmin: true });

  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: true,
      result: data,
    };
  });

  const userMock = new User();
  getUserById.mockResolvedValue(userMock);

  saveUser.mockRejectedValue(new Error('Unexpected'));

  const responseCb = (err, resp) => {
    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });

    done();
  };

  patchUser(event, null, responseCb);
});

test('Should return internal server error if getUserById is rejected', (done) => {
  const data = {
    password: 'my-password',
  };

  const event = {
    pathParameters: {
      id: 42,
    },
    body: JSON.stringify(data),
  };
  authenticate.mockResolvedValue({ userId: 'uid', isAdmin: true });
  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: true,
      result: data,
    };
  });

  getUserById.mockRejectedValue(new Error('Unexpected'));

  const responseCb = (err, resp) => {
    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });

    done();
  };

  patchUser(event, null, responseCb);
});
