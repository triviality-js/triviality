import { CommandHandler } from '@triviality/eventsourcing/CommandHandling/CommandHandler';
import { HandleCommand } from '@triviality/eventsourcing/CommandHandling/HandleCommand';
import { EventSourcingRepositoryInterface } from '@triviality/eventsourcing/EventSourcing/EventSourcingRepositoryInterface';
import { UserId } from '../../shared/ValueObject/UserId';
import { UserAggregate } from '../Aggregate/UserAggregate';
import { UserLogoutCommand } from '../Command/UserLogoutCommand';

export class UserLogoutCommandHandler implements CommandHandler {

  constructor(private readonly repository: EventSourcingRepositoryInterface<UserAggregate, UserId>) {

  }

  @HandleCommand
  public async execute(command: UserLogoutCommand) {
    const user = await this.repository.load(command.getUserId());
    user.loggedOut();
    await this.repository.save(user);
  }
}
