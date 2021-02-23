import { LoggerInterface } from '../features/LoggerInterface';

export class HalloService {
  constructor(private logger: LoggerInterface, private name: string) {
  }

  public speak() {
    this.logger.info(`Hallo ${this.name}`);
  }

}
