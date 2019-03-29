import { SerializableQuery } from '@triviality/eventsourcing-redux/QueryHandling/SerializableQuery';
import { Playhead } from '@triviality/eventsourcing-redux/ValueObject/Playhead';
import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';

export class QueryState<Id extends Identity = Identity> extends SerializableQuery {

  constructor(public id: Id, public readonly playhead: Playhead) {
    super();
  }

}
