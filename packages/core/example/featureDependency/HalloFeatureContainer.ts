import { triviality } from '../../src';
import { LogFeature } from '../singleton/LogFeature';
import { HalloFeature } from './HalloFeature';

triviality()
  .add(LogFeature)
  .add(HalloFeature)
  .build()
  .then((container) => {
    const service = container.halloServiceFactory('John');
    service.speak();
  });
