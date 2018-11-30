import {SerializableAction} from 'eventsourcing-redux-bridge/Redux/SerializableAction';
import {AccountState} from './AcountState';
import {ACCOUNT_STATE_RECEIVED} from './actions';
import {asQueryActionWithResponse} from "eventsourcing-redux-bridge/QueryHandling/QueryAction";
import {QueryAccountState} from "../../server/Query/QueryAccountState";
import {asDomainEventAction} from "eventsourcing-redux-bridge/ReadModel/DomainEventAction";
import {UserId} from "../../shared/ValueObject/UserId";
import {UserHasRegistered} from "../../server/DomainEvent/UserHasRegistered";

export function accountReducer(state: AccountState = new AccountState(), action: SerializableAction): AccountState {

    switch (action.type) {

        case '[Account] UserHasRegistered':
            const domainAction = asDomainEventAction(action, UserHasRegistered, UserId, UserId);
            return state.mutate(domainAction.metadata.playhead, () => {
                return state.set('name', domainAction.event.name);
            });

        case ACCOUNT_STATE_RECEIVED:
            const queryAction = asQueryActionWithResponse(action, QueryAccountState, AccountState);
            return queryAction.response as any;

    }

    return state;
}
