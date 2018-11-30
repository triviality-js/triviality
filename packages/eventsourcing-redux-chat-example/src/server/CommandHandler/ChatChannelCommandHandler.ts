import { default as validate } from 'uuid-validate';
import { CreateChannelCommand } from '../Command/CreateChannelCommand';
import { ChatChannelAggregateRepository } from '../Aggregate/ChatChannelAggregateRepository';
import { ChatChannelAggregate } from '../Aggregate/ChatChannelAggregate';
import { InvalidChannelIdError } from '../Error/InvalidChannelIdError';
import { HandleCommand } from 'ts-eventsourcing/CommandHandling/HandleCommand';
import { CommandHandler } from 'ts-eventsourcing/CommandHandling/CommandHandler';

export class ChatChannelCommandHandler implements CommandHandler {

  constructor(private readonly repository: ChatChannelAggregateRepository) {

  }

  @HandleCommand
  public async execute(command: CreateChannelCommand) {
    if (!validate(command.id.toString(), 4)) {
      throw InvalidChannelIdError.notUuid4(command.id);
    }
    const user = ChatChannelAggregate.createChannel(command.id, command.name);
    await this.repository.save(user);
  }
}
