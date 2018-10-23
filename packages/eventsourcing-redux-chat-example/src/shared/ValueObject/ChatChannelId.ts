import { ValueObject } from 'immutable';
import { ImmutableUuIdIdentity } from 'eventsourcing-redux-bridge/ValueObject/ImmutableUuIdIdentity';

export class ChatChannelId extends ImmutableUuIdIdentity implements ValueObject {

}
