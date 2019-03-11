
export enum LogLevel {
  trace,
  debug,
  info,
  warn,
  error,
}

export interface LoggerInterface {
  trace(message?: any, ...optionalParams: any[]): void;
  debug(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;

  log(level: LogLevel, message: any, ...optionalParams: any[]): void;
}
