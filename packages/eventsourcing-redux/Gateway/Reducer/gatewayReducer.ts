import produce from 'immer';
import { Map } from 'immutable';
import { AnyAction } from 'redux';
import { GATEWAY_CLOSE, GATEWAY_ERROR, GATEWAY_IS_CLOSED, GATEWAY_IS_OPEN, GATEWAY_OPEN } from '../actions';
import { isGatewayAction } from '../GatewayAction';
import { GatewayConnectionState, GatewayState, makeGatewayConnectionState } from '../State/GatewayState';

export const gatewayReducer = (gate: any) => (
  state: GatewayState<any> = {
    gates: (Map([[gate, makeGatewayConnectionState(gate)]] as any)),
    default: makeGatewayConnectionState(gate),
  },
  action: AnyAction): GatewayState<any> => {

  return produce(state, draftState => {
    function alterGateway(alter: (connectionState: GatewayConnectionState<any>) => GatewayConnectionState<any>) {
      const gateway = draftState.gates.get(action.gate) || makeGatewayConnectionState(action.gate);
      draftState.gates = draftState.gates.set(action.gate, alter(gateway));
      draftState.default = draftState.gates.get(gate) as any;
    }

    switch (true) {
      case isGatewayAction(GATEWAY_OPEN, action):
        alterGateway((connectionState) => ({
          ...connectionState,
          closing: false,
          connecting: true,
          error: null,
        }));
        break;

      case isGatewayAction(GATEWAY_CLOSE, action):
        alterGateway((connectionState) => ({
          ...connectionState,
          closing: true,
          connecting: false,
          error: null,
        }));
        break;

      case isGatewayAction(GATEWAY_ERROR, action):
        alterGateway((connectionState) => ({
          ...connectionState,
          closing: false,
          connecting: false,
          error: action.error,
        }));
        break;

      case isGatewayAction(GATEWAY_IS_CLOSED, action):
        alterGateway((connectionState) => ({
          ...connectionState,
          closing: false,
          connecting: false,
          open: false,
          error: null,
        }));
        break;

      case isGatewayAction(GATEWAY_IS_OPEN, action):
        alterGateway((connectionState) => ({
          ...connectionState,
          closing: false,
          connecting: false,
          open: true,
          error: null,
        }));
        break;
    }
  });
};
