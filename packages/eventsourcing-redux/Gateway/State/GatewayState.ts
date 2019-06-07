import { Map } from 'immutable';

export interface GatewayConnectionState<T> {
  gate: T;
  connecting: boolean;
  closing: boolean;
  open: boolean;
  error: unknown | null;
}

export interface GatewayState<T> {
  default: GatewayConnectionState<T>;
  gates: Map<T, GatewayConnectionState<T>>;
}

export function makeGatewayConnectionState<T>(gate: T): GatewayConnectionState<T> {
  return {
    gate,
    connecting: false,
    closing: false,
    open: false,
    error: null,
  };
}
