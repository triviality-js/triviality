import { filter } from 'rxjs/operators';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { SerializableQuery } from '../SerializableQuery';

export const isQueryMessage = <T extends ServerGatewayMessage>() => filter((message: T) => message.payload instanceof SerializableQuery);
