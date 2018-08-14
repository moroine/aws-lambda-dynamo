import listUser from '../../../../src/api/users/list';
import { getAllUsers } from '../../../../src/repositories/userRepository';
import authenticate from '../../../../src/api/security/authenticate';

jest.mock('../../../../src/repositories/userRepository');
jest.mock('../../../../src/api/security/authenticate');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  getAllUsers.mockClear();
  authenticate.mockClear();
});

test('Should return all users', (done) => {
  const u1 = { serialize: jest.fn() };
  const u2 = { serialize: jest.fn() };
  const u3 = { serialize: jest.fn() };

  u1.serialize.mockReturnValue({ name: 'u1' });
  u2.serialize.mockReturnValue({ name: 'u2' });
  u3.serialize.mockReturnValue({ name: 'u3' });

  const users = [u1, u2, u3];

  authenticate.mockResolvedValue({ getId: () => 'uid', isAdmin: true });
  getAllUsers.mockResolvedValue(users);

  const responseCb = (err, resp) => {
    expect(getAllUsers).toHaveBeenCalledTimes(1);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 200,
      body: JSON.stringify([
        { name: 'u1' },
        { name: 'u2' },
        { name: 'u3' },
      ]),
      headers: {
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-User-Id',
        'Access-Control-Allow-Origin': '*',
      },
    });

    done();
  };

  listUser(null, null, responseCb);
});

test('Should return server error on unexpected error', (done) => {
  getAllUsers.mockRejectedValue(new Error('Unexpected'));
  authenticate.mockResolvedValue({ getId: () => 'uid', isAdmin: true });

  const responseCb = (err, resp) => {
    expect(getAllUsers).toHaveBeenCalledTimes(1);

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

  listUser(null, null, responseCb);
});
