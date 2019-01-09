import { SerializableCommand } from 'eventsourcing-redux-bridge/CommandHandling/SerializableCommand';
import { UserId } from '../../shared/ValueObject/UserId';

export class FromSpecificUserCommand extends SerializableCommand {

  public readonly userId: UserId | undefined;

  /**
   * Set by the server.
   */
  public invokedBy(id: UserId) {
    (this as any).userId = id;
    return this;
  }

  public getUserId(): UserId {
    const userId = this.userId;
    if (!userId) {
      throw new Error('User id not set!');
    }
    return userId;
  }
}
