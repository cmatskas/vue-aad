export default class CustomTokenCredential {
  token;
  expiresOn;

  constructor(token, expiresOn) {
    this.token = token;
    if (expiresOn == undefined) {
      this.expiresOn = Date.now() + 60 * 60 * 1000;
    } else {
      this.expiresOn = expiresOn.getTime();
    }
  }

  async getToken(_scopes, _options) {
    console.log(_scopes, _options);
    return {
      token: this.token,
      expiresOnTimestamp: this.expiresOn,
    };
  }
}
