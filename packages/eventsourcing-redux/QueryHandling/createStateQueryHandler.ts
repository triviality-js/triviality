import { CommandHandler } from '@triviality/eventsourcing/CommandHandling/CommandHandler';
import { HandleQuery } from '@triviality/eventsourcing/QueryHandling/HandleQuery';
import { QueryConstructor } from '@triviality/eventsourcing/QueryHandling/Query';
import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { toArray } from 'rxjs/operators';
import { ActionRepositoryInterface } from '../ReadModel/ActionRepositoryInterface';
import { QueryState } from './QueryState';
import { QueryStateResponse } from './QueryStateResponse';

export function createStateQueryHandler<T extends QueryState<Id>, S, Id extends Identity = Identity>(
  repository: ActionRepositoryInterface<S, Id>,
  queryClass: QueryConstructor<T>,
  playheadLimit = 1000,
): CommandHandler {
  class Handler implements CommandHandler {
    @HandleQuery(queryClass)
    public async execute(query: T) {
      const model = await repository.get(query.id);
      const playhead = Math.abs(query.playhead);
      const diff = model.getPlayhead() - playhead;
      if (diff > playheadLimit) {
        return QueryStateResponse.stateResponse(model.getStore().getState());
      }
      const stream = repository.loadFromPlayhead(query.id, playhead);
      return QueryStateResponse.actionsResponse(await stream.pipe(toArray()).toPromise());
    }
  }

  return new Handler();
}
