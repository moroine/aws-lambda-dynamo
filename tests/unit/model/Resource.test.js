import Resource from '../../../src/model/Resource';

describe('User.getIdFromName()', () => {
  test('Should return urlEncoded of base64 name', () => {
    expect(Resource.getIdFromName('My first resource name')).toBe('TXkgZmlyc3QgcmVzb3VyY2UgbmFtZQ%3D%3D');
  });
});
describe('User.getNameFromId()', () => {
  test('getNameFromId should url decode then base64 decode', () => {
    expect(Resource.getNameFromId('TXkgZmlyc3QgcmVzb3VyY2UgbmFtZQ%3D%3D')).toBe('My first resource name');
  });
});

describe('new User()', () => {
  test('Should delegate given data to .update() method', () => {
    const updateCalls = [];

    class MockResource extends Resource {
    // eslint-disable-next-line class-methods-use-this
      update(...args) {
        updateCalls.push(args);
      }
    }

    const data = {
      resourceName: 'resource-name',
      userId: 'uid',
    };

    const resource = new MockResource(data);

    expect(resource.resourceName).toBe(null);
    expect(resource.userId).toBe(null);

    expect(updateCalls).toHaveLength(1);
    expect(updateCalls[0]).toHaveLength(1);
    expect(updateCalls[0][0]).toBe(data);
  });
});

describe('.update()', () => {
  test('Should update resourceName', () => {
    const resource = new Resource();
    expect(resource.resourceName).toBe(null);
    expect(resource.userId).toBe(null);

    resource.update({ resourceName: 'new-resource-name' });
    expect(resource.resourceName).toBe('new-resource-name');
    expect(resource.userId).toBe(null);
    resource.update({ resourceName: 'new-resource-name-1' });
    expect(resource.resourceName).toBe('new-resource-name-1');
    expect(resource.userId).toBe(null);
  });

  test('Should trim resourceName', () => {
    const resource = new Resource();
    expect(resource.resourceName).toBe(null);
    expect(resource.userId).toBe(null);

    resource.update({ resourceName: '   new-resource-name   ' });
    expect(resource.resourceName).toBe('new-resource-name');
    expect(resource.userId).toBe(null);
  });

  test('Should keep current resourceName if not updated', () => {
    const resource = new Resource();
    expect(resource.resourceName).toBe(null);
    expect(resource.userId).toBe(null);

    resource.update({ resourceName: 'resource-name' });
    expect(resource.resourceName).toBe('resource-name');
    expect(resource.userId).toBe(null);

    resource.update({ });
    expect(resource.resourceName).toBe('resource-name');
    expect(resource.userId).toBe(null);
  });

  test('Should update userId', () => {
    const resource = new Resource();
    expect(resource.resourceName).toBe(null);
    expect(resource.userId).toBe(null);

    resource.update({ userId: 'user-id' });
    expect(resource.resourceName).toBe(null);
    expect(resource.userId).toBe('user-id');

    resource.update({ userId: 'new-user-id' });
    expect(resource.resourceName).toBe(null);
    expect(resource.userId).toBe('new-user-id');
  });

  test('Should keep current userId if not updated', () => {
    const resource = new Resource();
    expect(resource.resourceName).toBe(null);
    expect(resource.userId).toBe(null);

    resource.update({ userId: 'user-id' });
    expect(resource.resourceName).toBe(null);
    expect(resource.userId).toBe('user-id');

    resource.update({ });
    expect(resource.resourceName).toBe(null);
    expect(resource.userId).toBe('user-id');
  });
});

describe('.getId()', () => {
  test('getId should return getIdFromName of resourceName', () => {
    const calls = [];

    class MockResource extends Resource {
      static getIdFromName(...args) {
        calls.push(args);

        return 'resource-id';
      }
    }

    const data = {
      resourceName: 'resource-name',
      userId: 'uid',
    };

    const resource = new MockResource(data);

    expect(resource.getId()).toBe('resource-id');

    expect(calls).toHaveLength(1);
    expect(calls[0]).toHaveLength(1);
    expect(calls[0][0]).toBe('resource-name');
  });
});

describe('.save()', () => {
  test('Should delegate to serialize', () => {
    const calls = [];

    const result = {};

    class MockResource extends Resource {
      // eslint-disable-next-line class-methods-use-this
      serialize(...args) {
        calls.push(args);

        return result;
      }
    }

    const res = new MockResource();

    expect(res.save()).toBe(result);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toHaveLength(0);
  });
});

describe('.serialize()', () => {
  test('Should return resourceName, userId and id props only', () => {
    class MockResource extends Resource {
    // eslint-disable-next-line class-methods-use-this
      getId() {
        return 'resource-id';
      }
    }

    const res = new MockResource({
      resourceName: 'resource-name',
      userId: 'user-id',
    });

    expect(res.serialize()).toEqual({
      resourceName: 'resource-name',
      userId: 'user-id',
      id: 'resource-id',
    });
  });
});

describe('.validate()', () => {
  test('Should be false if resourceName is null', () => {
    const res = new Resource();

    expect(res.validate()).toEqual({
      valid: false,
      error: 'Resource.resourceName must be specified',
    });
  });

  test('Should be false if resourceName is empty string', () => {
    const res = new Resource({ resourceName: '  ' });

    expect(res.validate()).toEqual({
      valid: false,
      error: 'Resource.resourceName must be specified',
    });
  });

  test('Should be false if userId is falsy', () => {
    const res = new Resource({ resourceName: 'reouscre-name ', userId: null });

    expect(res.validate()).toEqual({
      valid: false,
      error: 'Resource.userId must be specified',
    });
  });

  test('Should be true if pass', () => {
    const res = new Resource({ resourceName: 'reouscre-name ', userId: 'uid' });

    expect(res.validate()).toEqual({
      valid: true,
      error: null,
    });
  });
});
