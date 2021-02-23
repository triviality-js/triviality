import { LoggerInterface, LogLevel } from './LoggerInterface';
import { AbstractLogLevelLogger } from './AbstractLogLevelLogger';

export class PostfixLogger extends AbstractLogLevelLogger implements LoggerInterface {

  public static with(logger: LoggerInterface,
                     postfix: string): LoggerInterface {
    return new this(logger, postfix);
  }

  constructor(private readonly logger: LoggerInterface,
              private readonly postfix: string) {
    super();
  }

  public log(level: LogLevel, message?: unknown, ...optionalParams: unknown[]) {
    this.logger.log(level, message + this.postfix, ...optionalParams);
  }

}
