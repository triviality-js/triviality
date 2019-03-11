import { LoggerInterface, LogLevel } from './LoggerInterface';
import { AbstractLogLevelLogger } from './AbstractLogLevelLogger';

export class CollectionLogger extends AbstractLogLevelLogger implements LoggerInterface {

  constructor(private readonly loggers: LoggerInterface[]) {
    super();
  }

  public log(type: LogLevel, message: any, ...optionalParams: any[]): void {
    for (const logger of this.loggers) {
      logger.log(type, message, ...optionalParams);
    }
  }

}
