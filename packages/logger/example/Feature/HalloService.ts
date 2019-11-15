import { LoggerInterface } from '../../src';

export class HalloService {
  constructor(private logger: LoggerInterface) {

  }

  public printHallo(name: string): void {
    this.logger.info('Hallo', name);
  }
}
