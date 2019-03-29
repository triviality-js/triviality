import { Playhead } from '@triviality/eventsourcing-redux/ValueObject/Playhead';
import { List, Map, Record } from 'immutable';
import { User } from '../ValueObject/User';
import { UserId } from '../ValueObject/UserId';

export interface ChannelStateInterface {
  users: Map<UserId, User>;
  messages: List<{ message: string, userId: UserId, date: Date }>;
  playhead: Playhead;
}

export const defaultChannelState: ChannelStateInterface = {
  users: Map<UserId, User>(),
  messages: List<{ message: string, userId: UserId, date: Date }>(),
  playhead: 0,
};

export class ChannelState extends Record<ChannelStateInterface>(defaultChannelState, 'ChannelState') {
  constructor(values?: Partial<ChannelStateInterface>) {
    super(values);
  }

  public addUser(id: UserId, name: string): this {
    return this.setIn(['users', id], name);
  }

  public setPlayhead(playhead?: Playhead): this {
    if (this.playhead + 1 !== playhead) {
      throw new Error(`Playhead ${this.playhead + 1} != ${playhead} does not match`);
    }
    return this.set('playhead', playhead);
  }
}
