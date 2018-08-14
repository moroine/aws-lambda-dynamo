import deleteResource from '../../../../src/api/resources/delete';
import { deleteResource as deleteResourceFromDb } from '../../../../src/repositories/resourceRepository';
import authenticate from '../../../../src/api/security/authenticate';

jest.mock('../../../../src/repositories/resourceRepository');
jest.mock('../../../../src/api/security/authenticate');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  deleteResourceFromDb.mockClear();
  authenticate.mockClear();
});

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
