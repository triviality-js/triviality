import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';

export class NotFoundError extends Error {

  public static storeNotFound(id: Identity) {
    return new this(`Store not found with ${id.toString()}`);
  }
}
