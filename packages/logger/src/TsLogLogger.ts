import { Logger } from 'ts-log';
import { LoggerInterface } from './LoggerInterface';
import { AbstractFunctionLogger } from './AbstractFunctionLogger';

export class TsLogLogger extends AbstractFunctionLogger implements LoggerInterface {

  public trace = this.logger.trace.bind(this.logger);
  public debug = this.logger.debug.bind(this.logger);
  public info = this.logger.info.bind(this.logger);
  public warn = this.logger.warn.bind(this.logger);
  public error = this.logger.error.bind(this.logger);

  constructor(private logger: Logger) {
    super();
  }
}
