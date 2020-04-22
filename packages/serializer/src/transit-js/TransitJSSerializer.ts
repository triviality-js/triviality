/// <reference path="./transit-immutable-js.d.ts" />

import * as transit from 'transit-immutable-js';
import { Record } from 'immutable';
import { SerializerInterface } from '../SerializerInterface';
import { SerializeHandler } from './SerializeHandler';
import { SerializerError } from '..';

export type RecordConstructor = new(...args: any[]) => Record<any>;

export class TransitJSSerializer implements SerializerInterface {

  private readonly recordTransit: any;

  constructor(records: Iterable<RecordConstructor>, extraHandlers: Iterable<SerializeHandler> = []) {
    /**
     * Simple map to verify you cannot give a record with the same name.
     */
    const recordsTypes: { [key: string]: RecordConstructor } = {};
    for (const record of records) {
      const descriptiveName = Record.getDescriptiveName(new record());
      if (descriptiveName === '' || descriptiveName.toLowerCase() === 'record') {
        throw new SerializerError(`wrong descriptiveName record name ${descriptiveName}`);
      }
      if (typeof recordsTypes[descriptiveName] !== 'undefined') {
        throw new SerializerError(`Records with this name already given ${descriptiveName}`);
      }
      recordsTypes[descriptiveName] = record;
    }
    const withRecords = transit.withRecords(records);
    this.recordTransit = withRecords.withExtraHandlers(Array.from(extraHandlers));
  }

  public serialize(data: unknown): string {
    try {
      return this.recordTransit.toJSON(data);
    } catch (e) {
      throw SerializerError.fromError(e);
    }
  }

  public deserialize(json: string): unknown {
    try {
      return this.recordTransit.fromJSON(json);
    } catch (e) {
      throw SerializerError.fromError(e);
    }
  }

}
