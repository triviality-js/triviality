import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { Playhead } from '../ValueObject/Playhead';
import { SerializableQuery } from './SerializableQuery';

export class QueryState<Id extends Identity = Identity> extends SerializableQuery {

  constructor(public readonly id: Id, public readonly playhead: Playhead) {
    super();
  }

}
