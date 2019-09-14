import { FF } from '../../src';
import { Database } from './Database';

export interface DatabaseFeatureServices {
  database: () => Database;
}

export const DatabaseFeature: FF<DatabaseFeatureServices> = ({ createRegister, self, construct }) => ({
  setup: createRegister(() => [() => {
    if (!self().database().isConnected()) {
      throw new Error('Database is not connected!');
    }
  }]),
  database: construct(Database),
});
