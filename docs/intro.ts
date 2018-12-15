import { Container, ContainerFactory, Module } from '../src';
import { HalloService } from './Example/HalloService';
import { LogModule } from './LogModule';

class HalloWorldModule implements Module {

  constructor(private container: Container<LogModule>) {
  }

  public halloService() {
    return new HalloService(this.container.logger());
  }

}

ContainerFactory
  .create()
  .add(LogModule)
  .add(HalloWorldModule)
  .build()
  .then((container) => {
    container.halloService().hallo('World');
  });
