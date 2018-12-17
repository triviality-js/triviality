import { Module } from '../../src';
import { LoggerInterface } from '../module/LoggerInterface';
import { PrefixedLogger } from './PrefixedLogger';

export class LogModule implements Module {

  public logger(): LoggerInterface {
    return console;
  }

  public prefixedLogger(prefix: string): LoggerInterface {
    return new PrefixedLogger(this.logger(), prefix);
  }

}
