import { triviality } from '../../src';
import { DatabaseModule } from './DatabaseModule';

triviality()
  .add(DatabaseModule)
  .build()
  .then((container) => {
    container.database().someFancyQuery();
  })
  .catch((error) => {
    process.stdout.write(`${error}
`);
  });
