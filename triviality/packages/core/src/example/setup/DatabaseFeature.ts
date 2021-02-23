import { FF, KernelFeatureServices } from '@triviality/core';
import { Database } from './Database';

export interface DatabaseFeatureServices {
  database: Database;
}

export const DatabaseFeature: FF<DatabaseFeatureServices, KernelFeatureServices> = function ({ register, construct, compose }) {
  return {
    ...register('compilerPass', () => {
      if (this.database().isConnected()) {
        throw new Error('Database is not connected!');
      }
    }),
    database: construct(Database),
  }
};
