import { CommandHandler } from '@triviality/eventsourcing/CommandHandling/CommandHandler';
import { HandleCommand } from '@triviality/eventsourcing/CommandHandling/HandleCommand';
import { default as validate } from 'uuid-validate';
import { ChatChannelAggregate } from '../Aggregate/ChatChannelAggregate';
import { ChatChannelAggregateRepository } from '../Aggregate/ChatChannelAggregateRepository';
import { CreateChannelCommand } from '../Command/CreateChannelCommand';
import { InvalidChannelIdError } from '../Error/InvalidChannelIdError';

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
