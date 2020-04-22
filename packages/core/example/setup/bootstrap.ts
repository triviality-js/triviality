import { triviality } from '../../src';
import { DatabaseFeature } from './DatabaseFeature';

triviality()
  .add(DatabaseFeature)
  .build()
  .then((container) => {
    container.database.someFancyQuery();
  })
  .catch((error) => {
    process.stdout.write(`${error}
`);
  });
