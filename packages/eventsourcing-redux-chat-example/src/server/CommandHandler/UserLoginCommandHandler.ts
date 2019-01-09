import { UserAggregate } from '../Aggregate/UserAggregate';
import { HandleCommand } from 'ts-eventsourcing/CommandHandling/HandleCommand';
import { CommandHandler } from 'ts-eventsourcing/CommandHandling/CommandHandler';
import { UserId } from '../../shared/ValueObject/UserId';
import { EventSourcingRepositoryInterface } from 'ts-eventsourcing/EventSourcing/EventSourcingRepositoryInterface';
import { UserLoginCommand } from '../Command/UserLoginCommand';
import { UserModelRepository } from '../ReadModel/UserModelRepository';
import * as bcrypt from 'bcrypt';

export class UserLoginCommandHandler implements CommandHandler {

  constructor(private readonly repository: EventSourcingRepositoryInterface<UserAggregate, UserId>,
              private readonly userModelRepository: UserModelRepository) {

  }

  @HandleCommand
  public async execute(command: UserLoginCommand) {
    const model = await this.userModelRepository.findWithName(command.name);
    if (!model || !await bcrypt.compare(command.password, model.getPasswordHash())) {
      throw new Error('User not found or password does not match');
    }
    const user = await this.repository.load(model.getId());
    user.loggedIn();
    await this.repository.save(user);
    return model.getId();
  }
}
