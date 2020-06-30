import { Identity } from '../../ValueObject/Identity';

export class WrongAggregateIdError extends Error {

  public static create(actualId: Identity, expectedId: Identity) {
    return new WrongAggregateIdError(`Wrong aggregate id ${actualId} is not expected ${expectedId}`);
  }

}
