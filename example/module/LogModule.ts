import { Module } from '../../src';
import { LoggerInterface } from './LoggerInterface';
import { ConsoleLogger } from './ConsoleLogger';

export class LogModule implements Module {
  public logger(): LoggerInterface {
    return new ConsoleLogger();
  }
}
