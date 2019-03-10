import { Feature } from '../../src';
import { LoggerInterface } from '../features/LoggerInterface';
import { PrefixedLogger } from './PrefixedLogger';

export class LogFeature implements Feature {

  public logger(): LoggerInterface {
    return console;
  }

  public prefixedLogger(prefix: string): LoggerInterface {
    return new PrefixedLogger(this.logger(), prefix);
  }

}
