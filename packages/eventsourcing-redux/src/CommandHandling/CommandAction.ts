import { EntityMetadata, hasEntityMetadata, actionTypeWithEntity } from '../Redux/EntityMetadata';
import { SerializableCommand } from './SerializableCommand';
import { InvalidCommandTypeError } from './Error/InvalidCommandTypeError';
import { Command, CommandConstructor } from '@triviality/eventsourcing/CommandHandling/Command';
import { EntityName } from '../ValueObject/EntityName';
import { ClassUtil } from '@triviality/eventsourcing/ClassUtil';
import { SerializableQuery } from '../QueryHandling/SerializableQuery';

export interface CommandAction<T extends SerializableCommand = SerializableCommand, Metadata = {}> {
  type: string;
  metadata: EntityMetadata & Metadata;
  command: T;
}

export interface CommandResponseAction<T extends SerializableCommand = SerializableQuery, Response = {}, Metadata = {}> extends CommandAction<T, Metadata> {
  response: Response;
}

export function commandActionTypeFactory(type: string) {
  return (entity: EntityName, command: CommandConstructor | Command) => {
    return actionTypeWithEntity(`[${ClassUtil.nameOff(command)}] ${type}`, entity);
  };
}

export function isCommandActionOfType(action: any, type: (entity: string, command: CommandConstructor | Command) => string): action is CommandAction {
  return isCommandAction(action) && type(action.metadata.entity, action.command) === action.type;
}

export function isCommandAction(action: any): action is CommandAction {
  return action &&
    hasEntityMetadata(action) &&
    SerializableCommand.isSerializableCommand(action.command);
}

export function asCommandAction<T extends SerializableCommand = SerializableCommand, Metadata = {}>(
  action: any,
  command: CommandConstructor<T>,
): CommandAction<T, Metadata> {
  if (!isCommandAction(action)) {
    throw InvalidCommandTypeError.actionIsNotAnCommandAction();
  }
  if (!(action.command instanceof command)) {
    throw InvalidCommandTypeError.doesNotMatchCommand(action.command, command);
  }
  return action as any;
}

export function asCommandResponeAction<T extends SerializableCommand = SerializableCommand, Response = {}, Metadata = {}>(
  action: any,
  command: CommandConstructor<T>,
): CommandResponseAction<T, Response, Metadata> {
  if (!isCommandAction(action)) {
    throw InvalidCommandTypeError.actionIsNotAnCommandAction();
  }
  if (!(action.command instanceof command)) {
    throw InvalidCommandTypeError.doesNotMatchCommand(action.command, command);
  }
  return action as any;
}
