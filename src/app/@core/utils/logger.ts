export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

/**
 * This class provides methods that call the logging functions in the backend.
 * It is supposed to be used if you want to log something into the log file,
 * for development purposes use the methods of `console.*`.
 */
export default class Logger {
  path: string;

  /**
   * Creates new logger instance for a specified path or purpose.
   *
   * @param path filepath or other identifier to find source of log.
   */
  constructor(path: string) {
    this.path = path;
  }

  /**
   * Logs all arguments space separated with the level `TRACE`.
   */
  trace(...messages: any[]): void {
    // console.log('[TRACE]', this.path, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `DEBUG`.
   */
  debug(...messages: any[]): void {
    console.log('[DEBUG]', this.path, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `INFO`.
   */
  info(...messages: any[]): void {
    console.log('[INFO]', this.path, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `WARNING`.
   */
  warning(...messages: any[]): void {
    console.warn(this.path, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `ERROR`.
   */
  error(...messages: any[]): void {
    console.error(this.path, ...messages);
  }
}
