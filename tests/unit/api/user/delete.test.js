import deleteUser from '../../../../src/api/users/delete';
import { deleteUser as deleteUserFromDb } from '../../../../src/repositories/userRepository';

jest.mock('../../../../src/repositories/userRepository');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  deleteUserFromDb.mockClear();
});

test('Should return 204 if success', (done) => {
  const event = {
    pathParameters: {
      id: 42,
    },
  };

  deleteUserFromDb.mockResolvedValue();

  const responseCb = (err, resp) => {
    expect(deleteUserFromDb).toHaveBeenCalledTimes(1);
    expect(deleteUserFromDb.mock.calls[0]).toEqual([42]);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 204,
      body: null,
    });

    done();
  };

  deleteUser(event, null, responseCb);
});

test('Should return server error on unexpected error', (done) => {
  const event = {
    pathParameters: {
      id: 42,
    },
  };

  deleteUserFromDb.mockRejectedValue(new Error('Unexpected'));

  const responseCb = (err, resp) => {
    expect(deleteUserFromDb).toHaveBeenCalledTimes(1);
    expect(deleteUserFromDb.mock.calls[0]).toEqual([42]);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });

    done();
  };

  deleteUser(event, null, responseCb);
});
