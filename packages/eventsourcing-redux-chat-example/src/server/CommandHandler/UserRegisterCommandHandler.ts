import { UserRegisterCommand } from '../Command/UserRegisterCommand';
import { UserAggregateRepository } from '../Aggregate/UserAggregateRepository';
import { default as validate } from 'uuid-validate';
import { InvalidUserIdError } from '../Error/InvalidUserIdError';
import { UserExistsError } from '../Error/UserExistsError';
import { UserAggregate } from '../Aggregate/UserAggregate';
import { HandleCommand } from 'ts-eventsourcing/CommandHandling/HandleCommand';
import { CommandHandler } from 'ts-eventsourcing/CommandHandling/CommandHandler';

export class UserRegisterCommandHandler implements CommandHandler {

  constructor(private readonly repository: UserAggregateRepository) {

  }

  @HandleCommand
  public async execute(command: UserRegisterCommand) {
    if (!validate(command.userId.toString(), 4)) {
      throw InvalidUserIdError.notUuid4(command.userId);
    }
    if (await this.repository.has(command.userId)) {
      throw UserExistsError.withId(command.userId);
    }
    const user = UserAggregate.registerUser(command.userId, command.name);
    await this.repository.save(user);
  }
}
