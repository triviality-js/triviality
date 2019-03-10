import { LoggerInterface } from '../LoggerInterface';
import { LoggerModule } from './LoggerModule';
import { ConsoleLogger } from '../ConsoleLogger';
import { PrefixDateLogger } from '../PrefixDateLogger';

export class DefaultLoggerModule extends LoggerModule {

  public logger(): LoggerInterface {
    return new PrefixDateLogger(new ConsoleLogger(console));
  }

}
