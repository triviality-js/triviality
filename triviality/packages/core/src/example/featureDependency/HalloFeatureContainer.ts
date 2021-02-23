import { LogFeature } from '../singleton/LogFeature';
import { HalloFeature } from './HalloFeature';
import triviality from "@triviality/core";

triviality()
  .add(LogFeature)
  .add(HalloFeature)
  .build()
  .then((container) => {
    const service = container.halloServiceFactory('John');
    service.speak();
  });
