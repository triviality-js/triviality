import { HalloService } from './HalloService';
import { Container, Module } from '../../src';
import { LogModule } from '../module/LogModule';

export class HalloModule implements Module {

  constructor(private container: Container<LogModule>) {
  }

  public halloService(name: string): HalloService {
    return new HalloService(this.container.logger(), name);
  }
}
