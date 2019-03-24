import { ServerSocketIOGateway } from '../ServerSocketIOGateway';
import { NodeJSEventEmitterGateway } from '../../node.js/NodeJSEventEmitterGateway';

it.skip('ServerSocketIOGateway should be instanceof NodeJSEventEmitterGateway', () => {
  expect(new ServerSocketIOGateway(null as any, null as any)).toBeInstanceOf(NodeJSEventEmitterGateway);
});
