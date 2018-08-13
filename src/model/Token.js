class Token {
  constructor(data = {}) {
    this.userId = null;

    this.token = null;

    this.ttl = null;

    this.update(data);
  }

  update(data) {

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
