import { SerializableCommand } from '@triviality/eventsourcing-redux/CommandHandling/SerializableCommand';

export class UserLoginCommand extends SerializableCommand {

  constructor(public readonly name: string,
              public readonly password: string) {
    super();
  }

}
