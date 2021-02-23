import { LoggerInterface, LogLevel } from './LoggerInterface';

export abstract class AbstractLogLevelLogger implements LoggerInterface {
  public trace(message?: unknown, ...optionalParams: unknown[]): void {
    this.log(LogLevel.trace, message, ...optionalParams);
  }

  public debug(message?: unknown, ...optionalParams: unknown[]): void {
    this.log(LogLevel.debug, message, ...optionalParams);
  }

  public info(message?: unknown, ...optionalParams: unknown[]): void {
    this.log(LogLevel.info, message, ...optionalParams);
  }

  public warn(message?: unknown, ...optionalParams: unknown[]): void {
    this.log(LogLevel.warn, message, ...optionalParams);
  }

  public error(message?: unknown, ...optionalParams: unknown[]): void {
    this.log(LogLevel.error, message, ...optionalParams);
  }

  public abstract log(type: LogLevel, message?: unknown, ...optionalParams: unknown[]): void;

}
