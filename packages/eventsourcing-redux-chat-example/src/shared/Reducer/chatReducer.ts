import { ChannelState } from '../State/ChannelState';
import { UserHasRegistered } from '../../server/DomainEvent/UserHasRegistered';
import { UserId } from '../ValueObject/UserId';
import { SerializableAction } from 'eventsourcing-redux-bridge/Redux/SerializableAction';
import { asDomainEventAction, domainEventActionType } from "eventsourcing-redux-bridge/ReadModel/DomainEventAction";


const USER_HAS_REGISTERED = domainEventActionType(UserHasRegistered, 'register');

export function chatReducer(state: ChannelState = new ChannelState(), action: SerializableAction): ChannelState {

  switch (action.type) {
    case USER_HAS_REGISTERED:
      const domainAction = asDomainEventAction(action, UserHasRegistered, UserId, UserId);
      return state.setPlayhead(action.metadata.playhead).addUser(domainAction.metadata.aggregateId, domainAction.event.name);
  }

  return state;
}
