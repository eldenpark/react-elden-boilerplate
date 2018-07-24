import appConfig from '@config/appConfig';

const BLUE_BOLD = 'color: blue; font-weight: bold;';
const GREEN_BOLD = 'color: green; font-weight: bold;';
const GRAY_BOLD = 'color: gray; font-weight: bold;';
const RED_BOLD = 'color: red; font-weight: bold;';
const YELLOW_BOLD = 'color: #fab93b; font-weight: bold;';
const PINK_BOLD = 'color: #ec45b9; font-weight: bold;';

const DEV_ENV = process.env.NODE_ENV === 'development';

export default class Logger {
  constructor(name = '') {
    this.name = name;
  }

  static error(...message) {
    DEV_ENV && console.error('%cerror:', RED_BOLD, ...message);
  }

  static debug(...message) {
    DEV_ENV && console.log('%cdebug:', BLUE_BOLD, ...message);
  }

  static error(...message) {
    DEV_ENV && console.error('%cerror:', RED_BOLD, ...message);
  }

  static info(...message) {
    DEV_ENV && console.log(`%cinfo:`, GREEN_BOLD, ...message);
  }

  static log(...message) {
    DEV_ENV && console.log(...message);
  }

  static prod(...message) {
    console.log(...message);
  }

  static warn(...message) {
    DEV_ENV && console.log('%cwarn:', 'color: #efb23d; font-weight: bold;', ...message);
  }

  action(type, action) {
    this.shouldLog() && console.log(
      `%cinfo: %cact %c${type}`,
      GREEN_BOLD,
      GRAY_BOLD,
      'font-weight: bold;', 
      action,
    );
  }

  axios(method, url, ...args) {
    this.shouldLog() && console.log(
      `%cinfo: %caxs %c ${method} %c ${url}`,
      GREEN_BOLD, 
      YELLOW_BOLD,
      'background-color: #2d2d2d; color: #fab93b; font-weight: bold;', 
      'color: purple;', 
      ...args);
  }

  debug(...message) {
    this.shouldLog() && console.log('%cdebug:', BLUE_BOLD, ...message);
  }

  shouldLog() {
    return DEV_ENV && appConfig.logNames[this.name];
  }

  navigation(url, ...args) {
    this.shouldLog() && console.log(
      `%cinfo: %cnav %c${url}`,
      GREEN_BOLD, 
      PINK_BOLD,
      'background-color: #ec45b9; color: white; font-weight: bold;',
      ...args);
  }
};
