import { FF } from '../../src';
import { Database } from './Database';
import { SetupFeatureServices } from '../../src/Features/SetupFeature';

export interface DatabaseFeatureServices {
  database: () => Database;
}

export const DatabaseFeature: FF<DatabaseFeatureServices, SetupFeatureServices> = ({ registers: { setup }, services, construct }) => ({
  ...setup(() => () => {
    if (!services('database').database().isConnected()) {
      throw new Error('Database is not connected!');
    }
  }),
  database: construct(Database),
});
