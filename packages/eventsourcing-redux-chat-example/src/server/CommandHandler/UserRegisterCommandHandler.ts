import { CommandHandler } from '@triviality/eventsourcing/CommandHandling/CommandHandler';
import { HandleCommand } from '@triviality/eventsourcing/CommandHandling/HandleCommand';
import { EventSourcingRepositoryInterface } from '@triviality/eventsourcing/EventSourcing/EventSourcingRepositoryInterface';
import * as bcrypt from 'bcrypt';
import { default as validate } from 'uuid-validate';
import { UserId } from '../../shared/ValueObject/UserId';
import { UserAggregate } from '../Aggregate/UserAggregate';
import { UserRegisterCommand } from '../Command/UserRegisterCommand';
import { InvalidUserIdError } from '../Error/InvalidUserIdError';
import { UserExistsError } from '../Error/UserExistsError';
import { UserModelRepository } from '../ReadModel/UserModelRepository';

export class UserRegisterCommandHandler implements CommandHandler {

  constructor(private readonly repository: EventSourcingRepositoryInterface<UserAggregate, UserId>,
              private readonly userModelRepository: UserModelRepository) {

  }

  @HandleCommand
  public async execute(command: UserRegisterCommand) {
    if (!validate(command.userId.toString(), 4)) {
      throw InvalidUserIdError.notUuid4(command.userId);
    }
    if (await this.repository.has(command.userId)) {
      throw UserExistsError.withId(command.userId);
    }
    if (await this.userModelRepository.findWithName(command.name)) {
      throw UserExistsError.withName(command.name);
    }
    const passwordHash = await bcrypt.hash(command.password, 10);
    const user = UserAggregate.registerUser(command.userId, command.name, passwordHash);
    await this.repository.save(user);
  }
}
