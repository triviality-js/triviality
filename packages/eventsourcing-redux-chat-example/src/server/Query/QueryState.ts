import { SerializableQuery } from 'eventsourcing-redux-bridge/QueryHandling/SerializableQuery';
import { Playhead } from 'eventsourcing-redux-bridge/ValueObject/Playhead';
import { Identity } from 'ts-eventsourcing/ValueObject/Identity';

export class QueryState<Id extends Identity = Identity> extends SerializableQuery {

  constructor(public id: Id, public readonly playhead: Playhead) {
    super();
  }

}
