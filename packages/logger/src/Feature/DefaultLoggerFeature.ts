import { LoggerInterface } from '../LoggerInterface';
import { LoggerFeature } from './LoggerFeature';
import { ConsoleLogger } from '../ConsoleLogger';
import { PrefixDateLogger } from '../PrefixDateLogger';

export class DefaultLoggerFeature extends LoggerFeature {

  public logger(): LoggerInterface {
    return new PrefixDateLogger(new ConsoleLogger(console));
  }

}
