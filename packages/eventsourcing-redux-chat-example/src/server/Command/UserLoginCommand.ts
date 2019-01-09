import { SerializableCommand } from 'eventsourcing-redux-bridge/CommandHandling/SerializableCommand';

export class UserLoginCommand extends SerializableCommand {

  constructor(public readonly name: string,
              public readonly password: string) {
    super();
  }

}
