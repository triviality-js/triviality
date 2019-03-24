import { SerializableCommand } from './SerializableCommand';
import { CommandAction, commandActionTypeFactory, CommandResponseAction } from './CommandAction';
import { CommandConstructor } from '@triviality/eventsourcing/CommandHandling/Command';
import { EntityName } from '../ValueObject/EntityName';

/**
 * Return action for sending the command.
 *
 * The action will be picked up by the middleware {@see commandMiddleware}
 */
export const COMMAND_TRANSMITTING = commandActionTypeFactory('command transmitting');

/**
 * The command is transmitted successfully.
 *
 * This will **not** say the command is handled successfully!.
 */
export const COMMAND_TRANSMITTED_SUCCESSFULLY = commandActionTypeFactory('command transmitted successfully');

/**
 * The command transmission failed.
 */
export const COMMAND_TRANSMISSION_FAILED = commandActionTypeFactory('command transmission failed');

/**
 * The command failed by any means.
 */
export const COMMAND_FAILED = commandActionTypeFactory('command failed');

/**
 * The command handling failed.
 */
export const COMMAND_HANDLING_FAILED = commandActionTypeFactory('command handling failed');

/**
 * The command succeeded.
 */
export const COMMAND_SUCCEEDED = commandActionTypeFactory('command handling succeeded');

/**
 * Send a command.
 *
 * Will be picked up by the {@see commandMiddleware}
 *
 * @example
 *
 * sendCommand(new ByeProduct(...), 'BUY PRODUCT')
 */
export function sendCommand(command: SerializableCommand, entity: string, metadata: { [key: string]: any } = {}): CommandAction {
  return {
    type: COMMAND_TRANSMITTING(entity, command),
    command,
    metadata: {
      entity,
      ...metadata,
    },
  };
}

/**
 * Will send a command, and return commandHandler status.
 *
 * @see listenToCommandHandler
 * @see sendCommand
 */
export function sendCommandAndListenToHandler<HandlerResponse>(command: SerializableCommand, entity: string, metadata: { [key: string]: any } = {}):
  Promise<HandlerResponse> {
  return listenToCommandHandler(sendCommand(command, entity, metadata));
}

/**
 * Listen to command handler response or errors.
 *
 * The return type is actual not really a promise. The middleware returns the promise when you bind it tor Redux.
 *
 * @example
 *
 *  function registerAccount(name: string, password: string) {
 *    return listenToCommand<UserId>(sendCommand(
 *      new UserRegisterCommand(name, password),
 *      'register'
 *    ));
 *  }
 *
 *  const RegisterForm = ({ register }: { register: (name: string, password: string) => Promise<UserId> }) => (
 *    // The form
 *    return <form>...</form>;
 *  );
 *
 *  const mapDispatchToProps = { register: registerAccount };
 *
 *  export const ConnectedRegisterForm = connect(
 *    null,
 *    mapDispatchToProps,
 *  )(RegisterForm);
 *
 * Requires {@see commandHandlerResponseMiddleware}
 */
export function listenToCommandHandler<T>(command: CommandAction<any>): Promise<T> {
  command.metadata.listenToCommandHandler = true;
  return command as any;
}

export function commandTransmittedSuccessfully(command: SerializableCommand, entity: string, metadata: { [key: string]: any } = {}): CommandAction {
  return {
    type: COMMAND_TRANSMITTED_SUCCESSFULLY(entity, command),
    command,
    metadata: {
      entity,
      ...metadata,
    },
  };
}

export function commandTransmissionFailed(command: SerializableCommand, entity: string, error: unknown, metadata: { [key: string]: any } = {}): CommandAction {
  return {
    type: COMMAND_TRANSMISSION_FAILED(entity, command),
    command,
    metadata: {
      entity,
      error,
      ...metadata,
    },
  };
}

export function commandHandledSuccessfully<T = {}>(command: SerializableCommand, entity: string, response: T, metadata: { [key: string]: any } = {}): CommandResponseAction<typeof command, T> {
  return {
    type: COMMAND_SUCCEEDED(entity, command),
    command,
    response,
    metadata: {
      entity,
      ...metadata,
    },
  };
}

export function commandFailed(command: SerializableCommand, entity: string, metadata: { [key: string]: any } = {}): CommandAction {
  return {
    type: COMMAND_FAILED(entity, command),
    command,
    metadata: {
      entity,
      ...metadata,
    },
  };
}

export function commandHandledFailed(command: SerializableCommand, entity: string, error: unknown, metadata: { [key: string]: any } = {}): CommandAction {
  return {
    type: COMMAND_HANDLING_FAILED(entity, command),
    command,
    metadata: {
      error,
      entity,
      ...metadata,
    },
  };
}

/**
 * Convenience function to get command action types.
 */
export function commandHandelingActionTypes(entity: EntityName, command: CommandConstructor) {
  return {
    transmitting: COMMAND_TRANSMITTING(entity, command),
    transmittingSuccessfully: COMMAND_TRANSMITTED_SUCCESSFULLY(entity, command),
    transmittingFailed: COMMAND_TRANSMISSION_FAILED(entity, command),
    commandFailed: COMMAND_FAILED(entity, command),
    commandHandlingFailed: COMMAND_HANDLING_FAILED(entity, command),
    commandSucceeded: COMMAND_SUCCEEDED(entity, command),
  };
}
