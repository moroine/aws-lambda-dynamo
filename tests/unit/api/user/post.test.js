import postUser from '../../../../src/api/users/post';
import User from '../../../../src/model/User';
import parseBody from '../../../../src/api/helpers/parseBody';
import { saveUser } from '../../../../src/repositories/userRepository';

jest.mock('../../../../src/api/helpers/parseBody');
jest.mock('../../../../src/model/User');
jest.mock('../../../../src/repositories/userRepository');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  parseBody.mockClear();
  saveUser.mockClear();
  User.mockClear();
});

test('Should return client error if invalid given body', (done) => {
  const event = {
    body: Symbol('event body'),
  };

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

  postUser(event, null, responseCb);
});

test('Should create a new User', (done) => {
  const data = {
    email: 'moroine.bentefrit@mail.com',
    password: 'my-password',
  };

  const event = {
    body: JSON.stringify(data),
  };

  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: true,
      result: data,
    };
  });

  saveUser.mockResolvedValue({
    success: true,
    result: null,
  });

  const responseCb = (err, resp) => {
    expect(saveUser).toHaveBeenCalledTimes(1);
    expect(User).toHaveBeenCalledTimes(1);

    expect(saveUser.mock.calls).toHaveLength(1);
    expect(saveUser.mock.calls[0]).toHaveLength(2);

    const [user, isNew] = (saveUser.mock.calls[0]);
    expect(user).toBe(User.mock.instances[0]);
    expect(isNew).toBe(true);

    expect(err).toBe(null);
    expect(resp).toEqual({ statusCode: 204, body: null });

    done();
  };

  postUser(event, null, responseCb);
});

test('Should return client error if saveUser is not success', (done) => {
  const data = {
    email: 'moroine.bentefrit@mail.com',
    password: 'my-password',
  };

  const event = {
    body: JSON.stringify(data),
  };

  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: true,
      result: data,
    };
  });

  saveUser.mockResolvedValue({
    success: false,
    result: 'Invalid data',
  });

  const responseCb = (err, resp) => {
    expect(saveUser).toHaveBeenCalledTimes(1);
    expect(User).toHaveBeenCalledTimes(1);

    expect(saveUser.mock.calls).toHaveLength(1);
    expect(saveUser.mock.calls[0]).toHaveLength(2);

    const [user, isNew] = (saveUser.mock.calls[0]);
    expect(user).toBe(User.mock.instances[0]);
    expect(isNew).toBe(true);

    expect(err).toBe(null);
    expect(resp).toEqual({ statusCode: 400, body: JSON.stringify({ error: 'Invalid data' }) });

    done();
  };

  postUser(event, null, responseCb);
});

test('Should return server error on unexpected error', (done) => {
  const data = {
    email: 'moroine.bentefrit@mail.com',
    password: 'my-password',
  };

  const event = {
    body: JSON.stringify(data),
  };

  parseBody.mockImplementation((body) => {
    expect(body).toBe(event.body);

    return {
      success: true,
      result: data,
    };
  });

  saveUser.mockRejectedValue(new Error('Unexpected error'));

  const responseCb = (err, resp) => {
    expect(saveUser).toHaveBeenCalledTimes(1);
    expect(User).toHaveBeenCalledTimes(1);

    expect(saveUser.mock.calls).toHaveLength(1);
    expect(saveUser.mock.calls[0]).toHaveLength(2);

    const [user, isNew] = (saveUser.mock.calls[0]);
    expect(user).toBe(User.mock.instances[0]);
    expect(isNew).toBe(true);

    expect(err).toBe(null);
    expect(resp).toEqual({ statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });

    done();
  };

  postUser(event, null, responseCb);
});
