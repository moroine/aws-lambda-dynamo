import querystring from 'querystring';
import base64 from 'base-64';
import validator from 'validator';

class Resource {
  static getNameFromId(id) {
    try {
      const resourceName = base64.decode(querystring.unescape(id));

      return resourceName === null ? null : validator.trim(resourceName);
    } catch (e) {
      return null;
    }
  }

  static getIdFromName(name) {
    try {
      return querystring.escape(base64.encode(name));
    } catch (e) {
      return null;
    }
  }

  constructor(data = {}) {
    this.resourceName = null;

    this.userId = null;

    this.update(data);
  }

  update(data) {
    if (typeof data.resourceName === 'string') {
      this.resourceName = validator.trim(data.resourceName);
    }

    this.userId = data.userId || this.userId;
  }

  getId() {
    return this.constructor.getIdFromName(this.resourceName);
  }

  validate() {
    if (!this.resourceName || validator.isEmpty(this.resourceName)) {
      return {
        valid: false,
        error: 'Resource.resourceName must be specified',
      };
    }

    if (!this.userId) {
      return {
        valid: false,
        error: 'Resource.userId must be specified',
      };
    }

    return {
      valid: true,
      error: null,
    };
  }

  save() {
    return this.serialize();
  }

  serialize() {
    return {
      resourceName: this.resourceName,
      userId: this.userId,
      id: this.getId(),
    };
  }
}

export default Resource;
