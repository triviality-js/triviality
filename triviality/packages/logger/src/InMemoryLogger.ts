import { LoggerInterface, LogLevel } from './LoggerInterface';
import { AbstractLogLevelLogger } from './AbstractLogLevelLogger';

export interface LogEntry {
  level: LogLevel;
  message?: unknown;
  optionalParams: unknown[];
}

export class InMemoryLogger extends AbstractLogLevelLogger implements LoggerInterface {

  private memory: Array<LogEntry> = [];

  public static create() {
    return new InMemoryLogger();
  }

  public log(level: LogLevel, message?: unknown, ...optionalParams: unknown[]) {
    this.memory.push({level, message, optionalParams});
  }

  public getLogs() {
    return this.memory;
  }

  public clear() {
    this.memory = [];
  }

  public toString(): string {
    return this.memory.map((log) => {
      return log.message + log.optionalParams.map((ex) => ex).join(' ');
    }).join('\n');
  }
}
