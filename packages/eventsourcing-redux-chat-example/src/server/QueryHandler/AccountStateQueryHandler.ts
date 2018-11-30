import { CommandHandler } from 'ts-eventsourcing/CommandHandling/CommandHandler';
import { HandleQuery } from 'ts-eventsourcing/QueryHandling/HandleQuery';
import { QueryAccountState } from '../Query/QueryAccountState';
import { AccountState } from '../../client/Account/AcountState';
import { UserId } from '../../shared/ValueObject/UserId';
import { ActionRepositoryInterface } from "eventsourcing-redux-bridge/ReadModel/ActionRepositoryInterface";
import { QueryStateResponse } from "../Query/QueryStateResponse";
import { toArray } from 'rxjs/operators';

export class AccountStateQueryHandler implements CommandHandler {

  constructor(private readonly repository: ActionRepositoryInterface<AccountState, UserId>, private readonly playheadLimit = 1000) {

  }

  @HandleQuery
  public async execute(query: QueryAccountState) {
    const model = await this.repository.get(query.id);
    const playhead = Math.abs(query.playhead);
    const diff = model.getPlayhead() - playhead;
    const response: QueryStateResponse<AccountState> = {};
    if (diff > this.playheadLimit) {
      response.state = model.getStore().getState();
      return response;
    }
    const stream = this.repository.loadFromPlayhead(query.id, playhead);
    response.actions = await stream.pipe(toArray()).toPromise();
    return response;
  }
}
