import Token from '../../../src/model/Token';

describe('new Token()', () => {
  test('Should delegate given data to .update() method', () => {
    const updateCalls = [];

    class MockToken extends Token {
    // eslint-disable-next-line class-methods-use-this
      update(...args) {
        updateCalls.push(args);
      }
    }

    const data = {
      token: 'atoken',
      userId: 'uid',
      ttl: 256987,
    };

    const token = new MockToken(data);

    expect(token.token).toBe(null);
    expect(token.userId).toBe(null);
    expect(token.ttl).toBe(null);

    expect(updateCalls).toHaveLength(1);
    expect(updateCalls[0]).toHaveLength(1);
    expect(updateCalls[0][0]).toBe(data);
  });
});

describe('.update()', () => {
  test('Should update token', () => {
    const token = new Token();
    expect(token.token).toBe(null);
    expect(token.userId).toBe(null);
    expect(token.ttl).toBe(null);

    token.update({ token: 'atoken' });
    expect(token.token).toBe('atoken');
    expect(token.userId).toBe(null);
    expect(token.ttl).toBe(null);
    token.update({ token: 'anothertoken' });
    expect(token.token).toBe('anothertoken');
    expect(token.userId).toBe(null);
    expect(token.ttl).toBe(null);
  });

  test('Should update userId', () => {
    const token = new Token();
    expect(token.token).toBe(null);
    expect(token.userId).toBe(null);
    expect(token.ttl).toBe(null);

    token.update({ userId: 'uid' });
    expect(token.token).toBe(null);
    expect(token.userId).toBe('uid');
    expect(token.ttl).toBe(null);

    token.update({ userId: 'uid2' });
    expect(token.token).toBe(null);
    expect(token.userId).toBe('uid2');
    expect(token.ttl).toBe(null);
  });

  test('Should update ttl', () => {
    const token = new Token();
    expect(token.token).toBe(null);
    expect(token.userId).toBe(null);
    expect(token.ttl).toBe(null);

    token.update({ ttl: 123456789 });
    expect(token.token).toBe(null);
    expect(token.userId).toBe(null);
    expect(token.ttl).toBe(123456789);

    token.update({ ttl: 987654321 });
    expect(token.token).toBe(null);
    expect(token.userId).toBe(null);
    expect(token.ttl).toBe(987654321);
  });
});

describe('.save()', () => {
  test('Should delegate to serialize', () => {
    const calls = [];

    const result = {};

    class MockToken extends Token {
      // eslint-disable-next-line class-methods-use-this
      serialize(...args) {
        calls.push(args);

        return result;
      }
    }

    const res = new MockToken();

    expect(res.save()).toBe(result);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toHaveLength(0);
  });
});

describe('.serialize()', () => {
  test('Should return token, userId, ttl', () => {
    const res = new Token({
      token: 'atoken',
      userId: 'uid',
      ttl: 123456789,
    });

    expect(res.serialize()).toEqual({
      token: 'atoken',
      userId: 'uid',
      ttl: 123456789,
    });
  });
});
