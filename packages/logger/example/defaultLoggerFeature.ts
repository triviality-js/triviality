import { ContainerFactory } from '@triviality/core';
import { MyFeature } from './Feature/MyFeature';
import { DefaultLoggerFeature } from '../src';

ContainerFactory
  .create()
  .add(DefaultLoggerFeature)
  .add(MyFeature)
  .build()
  .then((container) => {
    container.halloService.printHallo('Jane');
  });
