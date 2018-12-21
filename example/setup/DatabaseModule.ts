import { Module } from '../../src';
import { Database } from './Database';

export class DatabaseModule implements Module {

  public setup() {
    if (!this.database().isConnected()) {
      throw new Error('Database is not connected!');
    }
  }

  public database(): Database {
    return new Database();
  }

}
