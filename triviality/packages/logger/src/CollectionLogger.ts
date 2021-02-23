import { LoggerInterface, LogLevel } from './LoggerInterface';
import { AbstractLogLevelLogger } from './AbstractLogLevelLogger';

export class CollectionLogger extends AbstractLogLevelLogger implements LoggerInterface {

  constructor(private readonly loggers: LoggerInterface[]) {
    super();
  }

  public log(type: LogLevel, message: unknown, ...optionalParams: unknown[]): void {
    for (const logger of this.loggers) {
      logger.log(type, message, ...optionalParams);
    }
  }

}
