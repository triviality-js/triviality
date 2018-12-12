import { Container, ContainerFactory, Module } from '../src';
import { LoggerInterface } from './Example/LoggerInterface';
import { HalloService } from './Example/HalloService';

class LogModule implements Module {
  public logger(): LoggerInterface {
    return console;
  }
}

class HalloWorldModule implements Module {

  constructor(private container: Container<LogModule>) {
  }

  public halloService() {
    return new HalloService(this.container.logger());
  }

}

ContainerFactory
  .add(LogModule)
  .add(HalloWorldModule)
  .build()
  .then((container) => {
    container.halloService().hallo('World');
  });
