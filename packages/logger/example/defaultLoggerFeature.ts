import { ContainerFactory } from '@triviality/core';
import { DefaultLoggerFeature } from '../src/Feature/DefaultLoggerFeature';
import { MyFeature } from './Feature/MyFeature';

ContainerFactory
  .create()
  .add(DefaultLoggerFeature)
  .add(MyFeature)
  .build()
  .then((container) => {
    container.halloService().printHallo('Jane');
  });
