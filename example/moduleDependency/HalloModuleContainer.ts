import { triviality } from '../../src';
import { LogModule } from '../singleton/LogModule';
import { HalloModule } from './HalloModule';

triviality()
  .add(LogModule)
  .add(HalloModule)
  .build()
  .then((container) => {
    const service = container.halloService('John');
    service.speak();
  });
