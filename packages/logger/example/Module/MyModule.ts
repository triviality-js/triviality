import { Container, Module } from '@triviality/core';
import { LoggerModule } from '../../src/Module/LoggerModule';
import { HalloService } from './HalloService';

export class MyModule implements Module {

  constructor(private container: Container<LoggerModule>) {

  }

  public halloService() {
    return new HalloService(this.container.logger());
  }

}
