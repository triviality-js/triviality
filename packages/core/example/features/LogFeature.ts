import { Feature } from '../../src';
import { LoggerInterface } from './LoggerInterface';
import { ConsoleLogger } from './ConsoleLogger';

export class LogFeature implements Feature {
  public logger(): LoggerInterface {
    return new ConsoleLogger();
  }
}
