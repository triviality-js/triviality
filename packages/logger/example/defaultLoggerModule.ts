import { ContainerFactory } from '@triviality/core';
import { DefaultLoggerModule } from '../src/Module/DefaultLoggerModule';
import { MyModule } from './Module/MyModule';

ContainerFactory
  .create()
  .add(DefaultLoggerModule)
  .add(MyModule)
  .build()
  .then((container) => {
    container.halloService().printHallo('Jane');
  });
