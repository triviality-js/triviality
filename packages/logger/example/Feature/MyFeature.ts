import { Container, Feature } from '@triviality/core';
import { LoggerFeature } from '../../src/Feature/LoggerFeature';
import { HalloService } from './HalloService';

export class MyFeature implements Feature {

  constructor(private container: Container<LoggerFeature>) {

  }

  public halloService() {
    return new HalloService(this.container.logger());
  }

}
