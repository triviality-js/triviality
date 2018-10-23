import { SerializableAction } from 'eventsourcing-redux-bridge/Redux/SerializableAction';
import { AccountState } from './AcountState';
import { asDomainEventAction, domainEventActionType } from 'eventsourcing-redux-bridge/EventHandling/DomainEventAction';
import { UserHasRegistered } from '../../server/DomainEvent/UserHasRegistered';
import { UserId } from '../../shared/ValueObject/UserId';

const USER_HAS_REGISTERED = domainEventActionType(UserHasRegistered, 'register');

export function accountReducer(state: AccountState = new AccountState(), action: SerializableAction): AccountState {

  switch (action.type) {

    case USER_HAS_REGISTERED:
      const domainAction = asDomainEventAction(action, UserHasRegistered, UserId);
      return state
        .setPlayhead(action.metadata.playhead)
        .registered(domainAction.metadata.aggregateId, domainAction.event.name);

  }


  return state;
}
