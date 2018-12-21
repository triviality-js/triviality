import { ContainerFactory } from '../../src';
import { DatabaseModule } from './DatabaseModule';

ContainerFactory
  .create()
  .add(DatabaseModule)
  .build()
  .then((container) => {
    container.database().someFancyQuery();
  })
  .catch((error) => {
    process.stdout.write(`${error}
`);
  });
