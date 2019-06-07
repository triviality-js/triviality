import { GATEWAY_OPEN } from '../actions';
import { GatewayAction, isGatewayAction } from '../GatewayAction';

it('isGatewayAction should know if its a gateway action', () => {
  const action: GatewayAction<string> = {
    gate: '/user',
    metadata: {
      entity: 'USER',
    },
    type: GATEWAY_OPEN('USER'),
  };
  expect(isGatewayAction(GATEWAY_OPEN, action)).toBeTruthy();
  expect(isGatewayAction(GATEWAY_OPEN)(action)).toBeTruthy();
});

it('isGatewayAction should know if its not a gateway action', () => {
  const action: unknown = {
    metadata: {
      entity: 'USER',
    },
    type: GATEWAY_OPEN('USER'),
  };
  expect(isGatewayAction(GATEWAY_OPEN, action)).toBeFalsy();
  expect(isGatewayAction(GATEWAY_OPEN)(action)).toBeFalsy();
});
