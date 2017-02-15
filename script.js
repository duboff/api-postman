/**
 * The Usabilla API Postman Pre-Request Script provides access to the Usabilla database from Postman.
 */

/**
 * This class is the factory for creating the signature describing
 * and securing the request based on;
 * - headers
 * - HTTP method
 * - URL + Query parameters
 */
class SignatureFactory {

  constructor(accessKey, secretKey, host) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.host = host;

    this.method = 'GET';
    this.headers = {};
  }

  setUrl(url) {
    // mandatory
    this.url = url;
  }

  setMethod(method) {
    // optional
    this.method = method;
  }

  setHeaders(headers) {
    // optional
    Object.assign(this.headers, headers);
  }

  setQueryParameters(params) {
    // optional
    this.queryParameters = params
  }

  getHeadersToSign() {
    // add host to headers
    this.headers.host = this.host;
    let headers = this.headers;

    // delete possible cached Authorization header
    delete headers.Authorization;

    // sort headers alphabetically
    return Object.keys(headers).sort().reduce((r, k) => (r[k] = headers[k], r), {});
  }

  /**
   * Example;
   * 'host:https://data.usabilla.com\nx-usbl-date:${this.dates.longdate}\n'
   */
  getCanonicalHeaders() {
    let headers = this.getHeadersToSign();
    return Object.keys(headers).map(function(k) {
      return [k, headers[k] + '\n'].join(':')
    }).join('');
  }

  /**
   * Example;
   * 'host;x-usbl-date'
   */
  getSignedHeaders() {
    let headers = this.getHeadersToSign();
    return Object.keys(headers).join(';');
  }

  canonicalString() {
    /**
     * HTTPRequestMethod
     * CanonicalURI
     * CanonicalQueryString
     * CanonicalHeaders
     * SignedHeaders
     * HexEncode(Hash(RequestPayload))
     */
    return [
      this.method,
      this.url,
      this.queryParameters,
      this.getCanonicalHeaders(),
      this.getSignedHeaders(),
      SignatureFactory.hash('', 'hex')
    ].join('\n');
  };

  stringToSign() {
    /**
     * Algorithm
     * RequestDate
     * CredentialScope
     * HashedCanonicalRequest
     */
    return [
      'USBL1-HMAC-SHA256',
      this.dates.longdate,
      this.dates.shortdate + '/' + 'usbl1_request',
      SignatureFactory.hash(this.canonicalString(), 'hex')
    ].join('\n');
  };

  getSignature() {
    const kDate = SignatureFactory.hmac('USBL1' + this.secretKey, this.dates.shortdate);
    const kSigning = SignatureFactory.hmac(kDate, 'usbl1_request');

    return SignatureFactory.hmac(kSigning, this.stringToSign(), 'hex');
  }

  authHeader() {
    this.dates = SignatureFactory.getDateTime();
    this.headers['x-usbl-date'] = this.dates.longdate;
    return [
      `USBL1-HMAC-SHA256 Credential=${this.accessKey}/${this.dates.shortdate}/usbl1_request`,
      `SignedHeaders=${this.getSignedHeaders()}`,
      `Signature=${this.getSignature()}`
    ].join(', ');
  };

  static getDateTime() {
    const date = (new Date())
      .toJSON()
      .replace(/[\-:.]/g, '');

    return {
      shortdate: date.substr(0, 8),
      longdate: `${date.substr(0, 15)}Z`,
    };
  }

  static hmac(key, string) {
    return CryptoJS.HmacSHA256(string, key);
  }

  static hash(string) {
    return CryptoJS.SHA256(string);
  }
}

SignatureFactory.HMAC = 'sha256';
SignatureFactory.ENCODING = 'utf8';

/**
 * This is code to init the auth and date header
 */

url = new URL(request.url)

sf = new SignatureFactory(postman.getEnvironmentVariable("access_key"), postman.getEnvironmentVariable("secrect_key"), url.hostname);
sf.setUrl(url.pathname);
sf.setQueryParameters(url.search.substring(1));

postman.setGlobalVariable('ub_header_auth', sf.authHeader());
postman.setGlobalVariable('ub_header_date', sf.dates.longdate);
