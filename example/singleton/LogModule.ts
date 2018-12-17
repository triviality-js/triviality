import { Module } from '../../src';
import { LoggerInterface } from '../module/LoggerInterface';

export class LogModule implements Module {

  public logger(): LoggerInterface {
    return console;
  }

  public prefixedLoggerService(prefix: string): LoggerInterface {
    return {
      info: (...message: string[]) => this.logger().info(...[prefix, ...message]),
    };
  }

}
