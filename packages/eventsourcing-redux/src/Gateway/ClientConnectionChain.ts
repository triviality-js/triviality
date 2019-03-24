/**
 * Simple connection chain.
 */
import { ClientConnection } from './ValueObject/ClientConnection';
import { List } from 'immutable';

export type ClientConnectionChain<T extends ClientConnection<any, any>> = (next: (connection: T) => void) => (connection: T) => void;

export function combineClientChain<T extends ClientConnection<any, any>>(...chain: Array<ClientConnectionChain<T>>): (_connection: T) => void {
  return List(chain).reverse().reduce<(connection: T) => void>(
    (next, current) => {
      return (connection: T) => {
        current(next)(connection);
      };
    },
    (_connection: T): void => {/*noop*/},
  );
}
