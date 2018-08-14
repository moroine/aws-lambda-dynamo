import listResource from '../../../../src/api/resources/list';
import { getUserResources } from '../../../../src/repositories/resourceRepository';
import authenticate from '../../../../src/api/security/authenticate';

jest.mock('../../../../src/repositories/resourceRepository');
jest.mock('../../../../src/api/security/authenticate');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  getUserResources.mockClear();
  authenticate.mockClear();
});

test('Should return all resources', (done) => {
  const r1 = { serialize: jest.fn() };
  const r2 = { serialize: jest.fn() };
  const r3 = { serialize: jest.fn() };

  r1.serialize.mockReturnValue({ name: 'resource-1' });
  r2.serialize.mockReturnValue({ name: 'resource-2' });
  r3.serialize.mockReturnValue({ name: 'resource-3' });

  const resources = [r1, r2, r3];

  const userId = 'uid';
  authenticate.mockResolvedValue({ userId: 'uid' });
  getUserResources.mockResolvedValue(resources);

  const responseCb = (err, resp) => {
    expect(getUserResources).toHaveBeenCalledTimes(1);
    expect(getUserResources.mock.calls[0]).toEqual(['uid']);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 200,
      body: JSON.stringify([
        { name: 'resource-1' },
        { name: 'resource-2' },
        { name: 'resource-3' },
      ]),
    });

    done();
  };

  const event = {
    pathParameters: { userId },
  };

  listResource(event, null, responseCb);
});

test('Should return server error on unexpected error', (done) => {
  const event = {
    pathParameters: { userId: 'uid' },
  };

  getUserResources.mockRejectedValue(new Error('Unexpected'));
  authenticate.mockResolvedValue({ userId: 'uid' });

  const responseCb = (err, resp) => {
    expect(getUserResources).toHaveBeenCalledTimes(1);
    expect(getUserResources.mock.calls[0]).toEqual(['uid']);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });

    done();
  };

  listResource(event, null, responseCb);
});
