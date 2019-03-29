import { CommandHandler } from '@triviality/eventsourcing/CommandHandling/CommandHandler';
import { HandleCommand } from '@triviality/eventsourcing/CommandHandling/HandleCommand';
import { EventSourcingRepositoryInterface } from '@triviality/eventsourcing/EventSourcing/EventSourcingRepositoryInterface';
import * as bcrypt from 'bcrypt';
import { UserId } from '../../shared/ValueObject/UserId';
import { UserAggregate } from '../Aggregate/UserAggregate';
import { UserLoginCommand } from '../Command/UserLoginCommand';
import { UserModelRepository } from '../ReadModel/UserModelRepository';

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
