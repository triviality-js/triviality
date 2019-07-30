import { Database } from '../setup/Database';

export const createDatabaseConnection = (): Database => {
  return new Database();
};

export const DatabaseFeature = () => ({

  setup() {
    if (!this.database().isConnected()) {
      throw new Error('Database is not connected!');
    }
  },

  database: createDatabaseConnection,
});
