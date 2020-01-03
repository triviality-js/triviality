import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { filter } from 'rxjs/operators';
import { SerializableCommand } from '../SerializableCommand';

export const isCommandMessage = <T extends ServerGatewayMessage>() => filter((message: T) => message.payload instanceof SerializableCommand);
