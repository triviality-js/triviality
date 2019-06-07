import { ServerGatewayInterface } from '../ServerGatewayInterface';

export interface ClientConnection<Options, Gateway extends ServerGatewayInterface<any>> {
  readonly options: Options;
  readonly gateway: Gateway;
}
