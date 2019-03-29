import {
  asDomainEventAction,
  domainEventActionType,
} from '@triviality/eventsourcing-redux/ReadModel/DomainEventAction';
import { SerializableAction } from '@triviality/eventsourcing-redux/Redux/SerializableAction';
import { UserHasRegistered } from '../../server/DomainEvent/UserHasRegistered';
import { ChannelState } from '../State/ChannelState';
import { UserId } from '../ValueObject/UserId';

const USER_HAS_REGISTERED = domainEventActionType(UserHasRegistered, 'register');

export function chatReducer(state: ChannelState = new ChannelState(), action: SerializableAction): ChannelState {

  switch (action.type) {
    case USER_HAS_REGISTERED:
      const domainAction = asDomainEventAction(action, UserHasRegistered, UserId, UserId);
      return state.setPlayhead(action.metadata.playhead).addUser(domainAction.metadata.aggregateId, domainAction.event.name);
  }

  return state;
}
