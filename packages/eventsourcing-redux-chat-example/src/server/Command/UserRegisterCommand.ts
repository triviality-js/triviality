import { UserId } from '../../shared/ValueObject/UserId';
import { SerializableCommand } from 'eventsourcing-redux-bridge/CommandHandling/SerializableCommand';

export class UserRegisterCommand extends SerializableCommand {

  constructor(public readonly userId: UserId,
              public readonly name: string,
              public readonly password: string) {
    super();
  }

}
