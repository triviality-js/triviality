import { LoggerInterface, LogLevel } from './LoggerInterface';

export abstract class AbstractLogLevelLogger implements LoggerInterface {
  public trace(message?: any, ...optionalParams: any[]): void {
    this.log(LogLevel.trace, message, ...optionalParams);
  }

  public debug(message?: any, ...optionalParams: any[]): void {
    this.log(LogLevel.debug, message, ...optionalParams);
  }

  public info(message?: any, ...optionalParams: any[]): void {
    this.log(LogLevel.info, message, ...optionalParams);
  }

  public warn(message?: any, ...optionalParams: any[]): void {
    this.log(LogLevel.warn, message, ...optionalParams);
  }

  public error(message?: any, ...optionalParams: any[]): void {
    this.log(LogLevel.error, message, ...optionalParams);
  }

  public abstract log(type: LogLevel, message?: any, ...optionalParams: any[]): void;

}
