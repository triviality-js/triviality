import { HalloFeature } from './HalloFeature';
import triviality from "@triviality/core";

triviality()
  // @ts-expect-error Example missing Logger service
  .add(HalloFeature)
  .build()
  .then((container) => {
    const service = container.halloServiceFactory('John');
    service.speak();
  });
