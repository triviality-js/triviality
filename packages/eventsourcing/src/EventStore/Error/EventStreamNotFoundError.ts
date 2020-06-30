import { Identity } from '../../ValueObject/Identity';

export class EventStreamNotFoundError extends Error {
  public static streamNotFound(id: Identity) {
    return new this(`EventStream not found for aggregate with id ${id.toString()}`);
  }
}
