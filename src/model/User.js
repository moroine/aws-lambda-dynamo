import querystring from 'querystring';
import validator from 'validator';
import base64 from 'base-64';
import bcryptjs from 'bcryptjs';

class User {
  static getEmailFromId(id) {
    try {
      const email = base64.decode(querystring.unescape(id));

      return validator.isEmail(email) ? validator.normalizeEmail(email) : null;
    } catch (e) {
      return null;
    }
  }

  static getIdFromEmail(email) {
    try {
      return querystring.escape(base64.encode(email));
    } catch (e) {
      return null;
    }
  }

  constructor(data = {}) {
    this.email = null;

    this.quota = -1;

    this.isAdmin = false;

    this.encodedPassword = null;

    this.password = null;

    this.update(data);
  }

  isValidPassword(email, password) {
    if (typeof email !== 'string') {
      return false;
    }

    const mail = validator.normalizeEmail(
      validator.trim(email),
    );

    if (mail !== this.email) {
      return false;
    }

    return bcryptjs.compareSync(password, this.getEncodedPassword());
  }

  update(data) {
    if (typeof data.email === 'string') {
      this.email = validator.normalizeEmail(
        validator.trim(data.email),
      );
    }

    this.quota = data.quota || this.quota;

    if (data.isAdmin !== undefined) {
      this.isAdmin = Boolean(data.isAdmin);
    }

    this.encodedPassword = data.encodedPassword || this.encodedPassword;

    this.password = data.password || this.password;
  }

  getEncodedPassword() {
    if (this.password) {
      this.encodedPassword = bcryptjs.hashSync(this.password, 5);
      this.password = null;
    }

    return this.encodedPassword;
  }

  getId() {
    return this.constructor.getIdFromEmail(this.email);
  }

  validate() {
    if (typeof this.email !== 'string' || !validator.isEmail(this.email)) {
      return {
        valid: false,
        error: 'User.email must be specified',
      };
    }

    if (!this.getEncodedPassword()) {
      return {
        valid: false,
        error: 'User.password must be specified',
      };
    }

    if (!Number.isInteger(this.quota)) {
      return {
        valid: false,
        error: 'User.quota must be an integer',
      };
    }

    return {
      valid: true,
      error: null,
    };
  }

  save() {
    return Object.assign(this.serialize(), { encodedPassword: this.getEncodedPassword() });
  }

  serialize() {
    return {
      email: this.email,
      quota: this.quota,
      isAdmin: this.isAdmin,
      id: this.getId(),
    };
  }
}

export default User;
