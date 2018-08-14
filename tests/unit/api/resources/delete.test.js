import deleteResource from '../../../../src/api/resources/delete';
import { deleteResource as deleteResourceFromDb } from '../../../../src/repositories/resourceRepository';
import authenticate from '../../../../src/api/security/authenticate';
import forbidden from '../../../../src/api/security/forbidden';

jest.mock('../../../../src/repositories/resourceRepository');
jest.mock('../../../../src/api/security/authenticate');
jest.mock('../../../../src/api/security/forbidden');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  deleteResourceFromDb.mockClear();
  authenticate.mockClear();
  forbidden.mockClear();
});

describe('DELETE /{userId}/resource/{resourceId}', () => {
  test('Should return 204 if success', (done) => {
    const event = {
      pathParameters: {
        userId: 'uid',
        resourceId: 'res-id',
      },
    };

    authenticate.mockResolvedValue({ userId: 'uid', isAdmin: true });

    deleteResourceFromDb.mockResolvedValue();

    const responseCb = (err, resp) => {
      expect(deleteResourceFromDb).toHaveBeenCalledTimes(1);
      expect(deleteResourceFromDb.mock.calls[0]).toEqual(['uid', 'res-id']);

      expect(err).toBe(null);
      expect(resp).toEqual({
        statusCode: 204,
        body: null,
      });

      done();
    };

    deleteResource(event, null, responseCb);
  });

  test('Should return server error on unexpected error', (done) => {
    const event = {
      pathParameters: {
        userId: 'uid',
        resourceId: 'res-id',
      },
    };

    authenticate.mockResolvedValue({ userId: 'uid', isAdmin: true });

    deleteResourceFromDb.mockRejectedValue(new Error('Unexpected'));

    const responseCb = (err, resp) => {
      expect(deleteResourceFromDb).toHaveBeenCalledTimes(1);
      expect(deleteResourceFromDb.mock.calls[0]).toEqual(['uid', 'res-id']);

      expect(err).toBe(null);
      expect(resp).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });

      done();
    };

    deleteResource(event, null, responseCb);
  });

  test('Should return forbidden if user is neither admin nor currentUser', (done) => {
    const event = {
      pathParameters: { userId: 'uid' },
    };

    authenticate.mockResolvedValue({ userId: 'otherUid' });
    forbidden.mockImplementation((cb) => { cb(); });

    const responseCb = () => {
      expect(forbidden).toHaveBeenCalledTimes(1);
      expect(forbidden.mock.calls[0]).toHaveLength(1);
      expect(forbidden.mock.calls[0][0]).toBe(responseCb);
      expect(deleteResourceFromDb).toHaveBeenCalledTimes(0);

      done();
    };

    deleteResource(event, null, responseCb);
  });

  test('Should succeed if user match', (done) => {
    const event = {
      pathParameters: { userId: 'uid' },
    };

    authenticate.mockResolvedValue({ userId: 'uid' });
    forbidden.mockImplementation((cb) => { cb(); });

    const responseCb = () => {
      expect(forbidden).toHaveBeenCalledTimes(0);
      expect(deleteResourceFromDb).toHaveBeenCalledTimes(1);

      done();
    };

    deleteResource(event, null, responseCb);
  });

  test('Should succeed if user is admin', (done) => {
    const event = {
      pathParameters: { userId: 'uid', isAdmin: true },
    };

    authenticate.mockResolvedValue({ userId: 'admin-uid', isAdmin: true });
    forbidden.mockImplementation((cb) => { cb(); });

    const responseCb = () => {
      expect(forbidden).toHaveBeenCalledTimes(0);
      expect(deleteResourceFromDb).toHaveBeenCalledTimes(1);

      done();
    };

    deleteResource(event, null, responseCb);
  });
});
