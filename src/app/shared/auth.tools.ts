import {HttpHeaders} from '@angular/common/http';

export class AuthTools {
  /**
   * Get request headers for auth on every authorized request
   *
   * @param {string} otpToken
   */
  public static getRequestHeaders(otpToken: string = null): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    if (otpToken) {
      headers = headers.append('x-otp', otpToken);
    }
    return headers;
  }
}
