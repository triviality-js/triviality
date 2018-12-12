import { LoggerInterface } from './LoggerInterface';

export class HalloService {
  constructor(private logger: LoggerInterface) {
  }

  public hallo(name: string) {
    this.logger.info(name);
  }

}
