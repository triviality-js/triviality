import { FF, SetupFeatureServices } from '../../src';
import { Database } from './Database';

export interface DatabaseFeatureServices {
  database: Database;
}

export const DatabaseFeature: FF<DatabaseFeatureServices, SetupFeatureServices> = ({ registers: { setupCallbacks }, services, construct }) => ({
  ...setupCallbacks(() => () => {
    if (!services('database').database().isConnected()) {
      throw new Error('Database is not connected!');
    }
  }),
  database: construct(Database),
});
