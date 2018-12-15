import { ContainerFactory } from '../src';
import { LogModule } from './LogModule';

ContainerFactory
  .create()
  .add(LogModule)
  .build()
  .then((container) => {
    container.logger().print();
  });
