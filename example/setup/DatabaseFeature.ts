import { Feature } from '../../src';
import { Database } from './Database';

export class DatabaseFeature implements Feature {

  public setup() {
    if (!this.database().isConnected()) {
      throw new Error('Database is not connected!');
    }
  }

  public database(): Database {
    return new Database();
  }

}
