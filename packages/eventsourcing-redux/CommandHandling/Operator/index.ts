import { filter } from 'rxjs/operators';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { SerializableCommand } from '../SerializableCommand';

export * from './convertCommandHandlerResponseToAction';

export const isCommandMessage = <T extends ServerGatewayMessage>() => filter((message: T) => message.payload instanceof SerializableCommand);
