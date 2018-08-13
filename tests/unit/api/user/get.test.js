import getUser from '../../../../src/api/users/get';
import { getUserById } from '../../../../src/repositories/userRepository';

jest.mock('../../../../src/repositories/userRepository');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  getUserById.mockClear();
});

test('Should return the user if found', (done) => {
  const event = {
    pathParameters: {
      id: 42,
    },
  };

  const user = { serialize: jest.fn() };

  user.serialize.mockReturnValue({ name: 'u1' });

  getUserById.mockResolvedValue(user);

  const responseCb = (err, resp) => {
    expect(getUserById).toHaveBeenCalledTimes(1);
    expect(getUserById.mock.calls[0]).toEqual([42]);

    expect(user.serialize).toHaveBeenCalledTimes(1);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 200,
      body: JSON.stringify({ name: 'u1' }),
    });

    done();
  };

  getUser(event, null, responseCb);
});

test('Should return 404 if not found', (done) => {
  const event = {
    pathParameters: {
      id: 42,
    },
  };

  getUserById.mockResolvedValue(null);

  const responseCb = (err, resp) => {
    expect(getUserById).toHaveBeenCalledTimes(1);
    expect(getUserById.mock.calls[0]).toEqual([42]);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 404,
      body: JSON.stringify({ error: 'user not found' }),
    });

    done();
  };

  getUser(event, null, responseCb);
});

test('Should return server error on unexpected error', (done) => {
  const event = {
    pathParameters: {
      id: 42,
    },
  };

  getUserById.mockRejectedValue(new Error('Unexpected'));

  const responseCb = (err, resp) => {
    expect(getUserById).toHaveBeenCalledTimes(1);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });

    done();
  };

  getUser(event, null, responseCb);
});
