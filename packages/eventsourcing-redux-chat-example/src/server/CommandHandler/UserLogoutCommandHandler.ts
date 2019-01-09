import { UserAggregate } from '../Aggregate/UserAggregate';
import { HandleCommand } from 'ts-eventsourcing/CommandHandling/HandleCommand';
import { CommandHandler } from 'ts-eventsourcing/CommandHandling/CommandHandler';
import { UserId } from '../../shared/ValueObject/UserId';
import { EventSourcingRepositoryInterface } from 'ts-eventsourcing/EventSourcing/EventSourcingRepositoryInterface';
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
