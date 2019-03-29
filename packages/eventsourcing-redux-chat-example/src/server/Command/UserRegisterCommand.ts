import { SerializableCommand } from '@triviality/eventsourcing-redux/CommandHandling/SerializableCommand';
import { UserId } from '../../shared/ValueObject/UserId';

export class UserRegisterCommand extends SerializableCommand {

  constructor(public readonly userId: UserId,
              public readonly name: string,
              public readonly password: string) {
    super();
  }

}
