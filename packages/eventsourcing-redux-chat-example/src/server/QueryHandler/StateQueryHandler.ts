import { CommandHandler } from 'ts-eventsourcing/CommandHandling/CommandHandler';
import { QueryStateResponse } from "../Query/QueryStateResponse";
import { toArray } from 'rxjs/operators';
import { Identity } from "ts-eventsourcing/ValueObject/Identity";
import { ActionRepositoryInterface } from "eventsourcing-redux-bridge/ReadModel/ActionRepositoryInterface";
import { QueryState } from "../Query/QueryState";
import { QueryConstructor } from "ts-eventsourcing/QueryHandling/Query";
import { Metadata } from "ts-eventsourcing/Metadata";

export function createStateQueryHandler<T extends QueryState<Id>, S, Id extends Identity = Identity>(
  queryClass: QueryConstructor<T>,
  repository: ActionRepositoryInterface<S, Id>,
  playheadLimit = 1000
) {
  class Handler implements CommandHandler {
    public async execute(query: T) {
      const model = await repository.get(query.id);
      const playhead = Math.abs(query.playhead);
      const diff = model.getPlayhead() - playhead;
      const response: QueryStateResponse<S> = {};
      if (diff > playheadLimit) {
        response.state = model.getStore().getState();
        return response;
      }
      const stream = repository.loadFromPlayhead(query.id, playhead);
      response.actions = await stream.pipe(toArray()).toPromise();
      return response;
    }
  }
  // TODO: add option to add query classes to the handler functionality.
  const QUERY_HANDLERS = Symbol.for('query_handlers');
  let handlers = Metadata.getMetadata(QUERY_HANDLERS, Handler);
  handlers = handlers ? handlers : [];
  handlers.push({
    functionName: 'execute',
    Query: queryClass,
  });
  Metadata.defineMetadata(QUERY_HANDLERS, handlers, Handler);
  return new Handler();
}
