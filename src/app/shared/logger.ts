import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

// 1 info
// 2 log
// 3 warning
// 4 error

@Injectable()
export class Logger {
  constructor() {
  }

  /**
   * Info logger function
   */
  public get info() {
    if (environment.logLevel <= 1) {
      return console.info.bind(console);
    } else {
      return function () {
      };
    }
  }

  /**
   * Basic log logger function
   */
  public get log() {
    if (environment.logLevel <= 2) {
      return console.log.bind(console);
    } else {
      return function () {
      };
    }
  }

  /**
   * Warning logger function
   */
  public get warning() {
    if (environment.logLevel <= 3) {
      return console.warn.bind(console);
    } else {
      return function () {
      };
    }
  }

  /**
   * Error logger function
   */
  public get error() {
    if (environment.logLevel <= 4) {
      return console.error.bind(console);
    } else {
      return function () {
      };
    }
  }
}

