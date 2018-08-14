import deleteUser from '../../../../src/api/users/delete';
import { deleteUser as deleteUserFromDb } from '../../../../src/repositories/userRepository';
import authenticate from '../../../../src/api/security/authenticate';

jest.mock('../../../../src/repositories/userRepository');
jest.mock('../../../../src/api/security/authenticate');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  deleteUserFromDb.mockClear();
  authenticate.mockClear();
});

test('Should return 204 if success', (done) => {
  const event = {
    pathParameters: {
      id: 'uid',
    },
  };

  authenticate.mockResolvedValue({ getId: () => 'uid', isAdmin: true });

  deleteUserFromDb.mockResolvedValue();

  const responseCb = (err, resp) => {
    expect(deleteUserFromDb).toHaveBeenCalledTimes(1);
    expect(deleteUserFromDb.mock.calls[0]).toEqual(['uid']);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 204,
      body: null,
      headers: {
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-User-Id',
        'Access-Control-Allow-Origin': '*',
      },
    });

    done();
  };

  deleteUser(event, null, responseCb);
});

test('Should return server error on unexpected error', (done) => {
  const event = {
    pathParameters: {
      id: 'uid',
    },
  };

  authenticate.mockResolvedValue({ getId: () => 'uid', isAdmin: true });
  deleteUserFromDb.mockRejectedValue(new Error('Unexpected'));

  const responseCb = (err, resp) => {
    expect(deleteUserFromDb).toHaveBeenCalledTimes(1);
    expect(deleteUserFromDb.mock.calls[0]).toEqual(['uid']);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
      headers: {
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-User-Id',
        'Access-Control-Allow-Origin': '*',
      },
    });

    done();
  };

  deleteUser(event, null, responseCb);
});
