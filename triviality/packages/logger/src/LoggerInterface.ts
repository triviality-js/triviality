
export enum LogLevel {
  trace,
  debug,
  info,
  warn,
  error,
}

export interface LoggerInterface {
  trace(message?: unknown, ...optionalParams: unknown[]): void;
  debug(message?: unknown, ...optionalParams: unknown[]): void;
  info(message?: unknown, ...optionalParams: unknown[]): void;
  warn(message?: unknown, ...optionalParams: unknown[]): void;
  error(message?: unknown, ...optionalParams: unknown[]): void;

  log(level: LogLevel, message: unknown, ...optionalParams: unknown[]): void;
}
