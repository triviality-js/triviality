import { HalloService } from './HalloService';
import { Container, Feature } from '../../src';
import { LogFeature } from '../features/LogFeature';

export class HalloFeature implements Feature {

  constructor(private container: Container<LogFeature>) {
  }

  public halloService(name: string): HalloService {
    return new HalloService(this.container.logger(), name);
  }
}
