import bcrypt from 'bcryptjs';
import User from '../../../src/model/User';

describe('User.getIdFromEmail()', () => {
  test('Should return urlEncoded of base64 getIdFromEmail', () => {
    expect(User.getIdFromEmail('me@mail.com')).toBe('bWVAbWFpbC5jb20%3D');
  });
});
describe('User.getEmailFromId()', () => {
  test('Should url decode then base64 decode', () => {
    expect(User.getEmailFromId('bWVAbWFpbC5jb20%3D')).toBe('me@mail.com');
  });
});

describe('new User()', () => {
  test('Should delegate given data to .update() method', () => {
    const updateCalls = [];

    class MockUser extends User {
    // eslint-disable-next-line class-methods-use-this
      update(...args) {
        updateCalls.push(args);
      }
    }

    const data = {
      email: 'me@mail.com',
      password: 'azerty',
    };

    const user = new MockUser(data);

    expect(user.email).toBe(null);
    expect(user.quota).toBe(-1);
    expect(user.isAdmin).toBe(false);
    expect(user.encodedPassword).toBe(null);
    expect(user.password).toBe(null);

    expect(updateCalls).toHaveLength(1);
    expect(updateCalls[0]).toHaveLength(1);
    expect(updateCalls[0][0]).toBe(data);
  });
});

describe('.update()', () => {
  test('Should update email', () => {
    const user = new User();
    expect(user.email).toBe(null);
    expect(user.quota).toBe(-1);
    expect(user.isAdmin).toBe(false);
    expect(user.encodedPassword).toBe(null);
    expect(user.password).toBe(null);

    user.update({ email: 'me@mail.com' });
    expect(user.email).toBe('me@mail.com');
    expect(user.quota).toBe(-1);
    expect(user.isAdmin).toBe(false);
    expect(user.encodedPassword).toBe(null);
    expect(user.password).toBe(null);
    user.update({ email: 'you@me.com' });
    expect(user.email).toBe('you@me.com');
    expect(user.quota).toBe(-1);
    expect(user.isAdmin).toBe(false);
    expect(user.encodedPassword).toBe(null);
    expect(user.password).toBe(null);
  });

  test('Should normalize email to prevent duplicate', () => {
    const user = new User();
    expect(user.email).toBe(null);

    user.update({ email: '   mE@maIl.com   ' });
    expect(user.email).toBe('me@mail.com');
  });

  test('Should keep current email if not updated', () => {
    const user = new User();
    expect(user.email).toBe(null);

    user.update({ email: 'me@mail.com' });
    expect(user.email).toBe('me@mail.com');

    user.update({ });
    expect(user.email).toBe('me@mail.com');
  });

  test('Should update quota', () => {
    const user = new User();
    expect(user.quota).toBe(-1);

    user.update({ quota: 100 });
    expect(user.quota).toBe(100);
  });

  test('Should keep current quota if not updated', () => {
    const user = new User();
    expect(user.quota).toBe(-1);

    user.update({ quota: 100 });
    expect(user.quota).toBe(100);

    user.update({ });
    expect(user.quota).toBe(100);
  });

  test('Should update encodedPassword', () => {
    const user = new User();
    expect(user.encodedPassword).toBe(null);

    user.update({ encodedPassword: 'hash-pass' });
    expect(user.encodedPassword).toBe('hash-pass');
  });

  test('Should keep current encodedPassword if not updated', () => {
    const user = new User();
    expect(user.encodedPassword).toBe(null);

    user.update({ encodedPassword: 'hash-pass' });
    expect(user.encodedPassword).toBe('hash-pass');

    user.update({ });
    expect(user.encodedPassword).toBe('hash-pass');
  });

  test('Should update password', () => {
    const user = new User();
    expect(user.password).toBe(null);

    user.update({ password: 'pass' });
    expect(user.password).toBe('pass');
  });

  test('Should keep current password if not updated', () => {
    const user = new User();
    expect(user.password).toBe(null);

    user.update({ password: 'pass' });
    expect(user.password).toBe('pass');

    user.update({ });
    expect(user.password).toBe('pass');
  });
});

describe('.getId()', () => {
  test('Should return getIdFromName of userName', () => {
    const calls = [];

    class MockUser extends User {
      static getIdFromEmail(...args) {
        calls.push(args);

        return 'user-id';
      }
    }

    const data = {
      email: 'me@mail.com',
    };

    const user = new MockUser(data);

    expect(user.getId()).toBe('user-id');

    expect(calls).toHaveLength(1);
    expect(calls[0]).toHaveLength(1);
    expect(calls[0][0]).toBe('me@mail.com');
  });
});

describe('.save()', () => {
  test('Should return email, quota, isAmin, id and encodedPassword', () => {
    class MockUser extends User {
      // eslint-disable-next-line class-methods-use-this
      getEncodedPassword() {
        return 'hash-azerty';
      }
    }

    const res = new MockUser({
      email: 'me@mail.com',
      quota: 42,
      isAdmin: true,
      password: 'azerty',
    });

    expect(res.save()).toEqual({
      id: 'bWVAbWFpbC5jb20%3D',
      email: 'me@mail.com',
      quota: 42,
      isAdmin: true,
      encodedPassword: 'hash-azerty',
    });
  });

  test('Should not return password', () => {
    class MockUser extends User {
      // eslint-disable-next-line class-methods-use-this
      getEncodedPassword() {
        return 'hash-azerty';
      }
    }
    const res = new MockUser({
      email: 'me@mail.com',
      quota: 42,
      isAdmin: false,
      encodedPassword: 'hash-azerty',
      password: 'azerty',
    });

    const result = res.save();
    expect(result.password).toEqual(undefined);
    expect(result.encodedPassword).toEqual('hash-azerty');
  });
});

describe('.serialize()', () => {
  test('Should return email, quota, isAmin, id only', () => {
    const res = new User({
      email: 'me@mail.com',
      quota: 42,
      isAdmin: true,
      password: 'azerty',
    });

    expect(res.serialize()).toEqual({
      email: 'me@mail.com',
      quota: 42,
      isAdmin: true,
      id: 'bWVAbWFpbC5jb20%3D',
    });
  });

  test('Should return neither encodedPassword nor password', () => {
    const res = new User({
      email: 'me@mail.com',
      quota: 42,
      isAdmin: false,
      password: 'azerty',
      encodedPassword: 'encoded-one',
    });

    const result = res.serialize();
    expect(result.password).toEqual(undefined);
    expect(result.encodedPassword).toEqual(undefined);
  });
});

describe('.validate()', () => {
  test('Should be false if email is null', () => {
    const res = new User();

    expect(res.validate()).toEqual({
      valid: false,
      error: 'User.email must be specified',
    });
  });

  test('Should be false if email is invalid', () => {
    const res = new User({
      email: 'invalid-email',
    });

    expect(res.validate()).toEqual({
      valid: false,
      error: 'User.email must be specified',
    });
  });

  test('Should be false if no password', () => {
    const res = new User({
      email: 'me@mail.com',
    });

    expect(res.validate()).toEqual({
      valid: false,
      error: 'User.password must be specified',
    });
  });

  test('Should be false quota is not integer', () => {
    const res = new User({
      email: 'me@mail.com',
      quota: '15',
      password: 'azerty',
    });

    expect(res.validate()).toEqual({
      valid: false,
      error: 'User.quota must be an integer',
    });
  });

  test('Should be true if pass', () => {
    const res = new User({
      email: 'me@mail.com',
      quota: 15,
      password: 'azerty',
    });

    expect(res.validate()).toEqual({
      valid: true,
      error: null,
    });
  });
});

describe('.getEncodedPassword', () => {
  test('Should return the current encoded password if password is not updated', () => {
    const user = new User({ encodedPassword: 'hash-pass' });

    expect(user.getEncodedPassword()).toBe('hash-pass');
  });

  test('Should return null if neither password nor encoded one', () => {
    const user = new User({ });

    expect(user.getEncodedPassword()).toBe(null);
  });

  test('Should get the encoded password from given plain one and clear plain password', () => {
    const user = new User({ password: 'pass' });

    const hash = user.getEncodedPassword();
    expect(user.password).toBe(null);
    expect(bcrypt.compareSync('pass', hash)).toBe(true);
    expect(bcrypt.compareSync('invalid-pass', hash)).toBe(false);
  });
});
