import listResource from '../../../../src/api/resources/list';
import { getUserResources } from '../../../../src/repositories/resourceRepository';

jest.mock('../../../../src/repositories/resourceRepository');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  getUserResources.mockClear();
});

test('Should return all resources', (done) => {
  const r1 = { serialize: jest.fn() };
  const r2 = { serialize: jest.fn() };
  const r3 = { serialize: jest.fn() };

  r1.serialize.mockReturnValue({ name: 'resource-1' });
  r2.serialize.mockReturnValue({ name: 'resource-2' });
  r3.serialize.mockReturnValue({ name: 'resource-3' });

  const resources = [r1, r2, r3];

  const userId = 42;

  getUserResources.mockResolvedValue(resources);

  const responseCb = (err, resp) => {
    expect(getUserResources).toHaveBeenCalledTimes(1);
    expect(getUserResources.mock.calls[0]).toEqual([42]);

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
  getUserResources.mockRejectedValue(new Error('Unexpected'));

  const responseCb = (err, resp) => {
    expect(getUserResources).toHaveBeenCalledTimes(1);
    expect(getUserResources.mock.calls[0]).toEqual([42]);

    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });

    done();
  };
  const event = {
    pathParameters: { userId: 42 },
  };

  listResource(event, null, responseCb);
});
