import { UserRegisterCommand } from '../Command/UserRegisterCommand';
import { default as validate } from 'uuid-validate';
import { InvalidUserIdError } from '../Error/InvalidUserIdError';
import { UserExistsError } from '../Error/UserExistsError';
import { UserAggregate } from '../Aggregate/UserAggregate';
import { HandleCommand } from 'ts-eventsourcing/CommandHandling/HandleCommand';
import { CommandHandler } from 'ts-eventsourcing/CommandHandling/CommandHandler';
import * as bcrypt from 'bcrypt';
import {EventSourcingRepositoryInterface} from "ts-eventsourcing/EventSourcing/EventSourcingRepositoryInterface";
import {UserId} from "../../shared/ValueObject/UserId";

export class UserRegisterCommandHandler implements CommandHandler {

  constructor(private readonly repository: EventSourcingRepositoryInterface<UserAggregate, UserId>) {

  }

  @HandleCommand
  public async execute(command: UserRegisterCommand) {
    if (!validate(command.userId.toString(), 4)) {
      throw InvalidUserIdError.notUuid4(command.userId);
    }
    if (await this.repository.has(command.userId)) {
      throw UserExistsError.withId(command.userId);
    }
    const passwordHash = await bcrypt.hash(command.password, 10);
    const user = UserAggregate.registerUser(command.userId, command.name, passwordHash);
    await this.repository.save(user);
  }
}
