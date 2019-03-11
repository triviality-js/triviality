import { LoggerInterface } from '../features/LoggerInterface';

export class PrefixedLogger implements LoggerInterface {

  constructor(private logger: LoggerInterface, private prefix: string) {

  }

  public info(...message: string[]): void {
    return this.logger.info(this.prefix, ...message);
  }
}
