import { ContainerFactory } from '../../src';
import { LogModule } from './LogModule';

ContainerFactory
  .create()
  .add(LogModule)
  .build()
  .then((container) => {
    const johnLogger = container.prefixedLogger('John:');
    johnLogger.info('Hallo Jane!');
    const janeLogger = container.prefixedLogger('Jane:');
    janeLogger.info('Hi John!');

  });
