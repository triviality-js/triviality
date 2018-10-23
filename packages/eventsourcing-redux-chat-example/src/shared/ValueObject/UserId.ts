import { ValueObject } from 'immutable';
import { ImmutableUuIdIdentity } from 'eventsourcing-redux-bridge/ValueObject/ImmutableUuIdIdentity';

export class UserId extends ImmutableUuIdIdentity implements ValueObject {

}
