import { mergeMap } from 'rxjs/operators';
import { Observable, ObservableInput } from 'rxjs';
import { ServerGatewayMessage } from '../../Gateway/ValueObject/ServerGatewayMessage';
import { ServerGatewayMetadata } from '../../Gateway/ValueObject/ServerGatewayMetadata';
import { ServerGatewayInterface } from '../../Gateway/ServerGatewayInterface';

/**
 * Helper transformation operator with client gateways.
 *
 * @example
 *
 *  fromClientCommand((clientGateway) => {
 *     return (clientGateway, messages$) => {
 *        // clientGateway.emit()
 *        // Return some observable
 *        return messages$;
 *     };
 *  })
 */
export function fromClientCommand<
  R,
  ClientGateway extends ServerGatewayInterface<any>,
  Message extends ServerGatewayMessage<ServerGatewayMetadata<ClientGateway>>
  >(
  callback: (clientGateway: ClientGateway, message: Message) => () => ObservableInput<R>,
) {
  return (input: Observable<Message>) => {
    return input.pipe(
      mergeMap((message) => {
        return callback(message.metadata.clientGateway, message)();
      }),
    );
  };
}
