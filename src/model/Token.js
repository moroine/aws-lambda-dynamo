class Token {
  constructor(data = {}) {
    this.userId = null;

    this.token = null;

    this.ttl = null;

    this.update(data);
  }

  update(data) {
    if (data.token) {
      this.token = data.token;
    }

    if (data.userId) {
      this.userId = data.userId;
    }

    if (data.ttl) {
      this.ttl = data.ttl;
    }
  }

  save() {
    return this.serialize();
  }

  serialize() {
    return {
      token: this.token,
      userId: this.userId,
      ttl: this.ttl,
    };
  }
}

export default Token;
