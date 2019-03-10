import { LoggerInterface, LogLevel } from './LoggerInterface';
import { AbstractLogLevelLogger } from './AbstractLogLevelLogger';
import moment, { Moment } from 'moment';

export class PrefixDateLogger extends AbstractLogLevelLogger implements LoggerInterface {

  constructor(private readonly logger: LoggerInterface,
              private readonly format: string = 'L LTS',
              private readonly separator: string = ':',
              private readonly now: () => Moment = () => moment()) {
    super();
  }

  public log(level: LogLevel, message?: any, ...optionalParams: any[]): void {
    this.logger.log(level, this.formatDate() + this.separator + message, ...optionalParams);
  }

  private formatDate(): string {
    return this.now().format(this.format);
  }

}
