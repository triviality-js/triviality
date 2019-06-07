import { Map } from 'immutable';
import { gatewayError } from '../../actions';
import { makeGatewayConnectionState } from '../../State/GatewayState';
import { gatewayReducer } from '../gatewayReducer';

it('Should return default state', () => {

  expect(gatewayReducer('some gate')(undefined, { type: 'Some action' })).toEqual({
    default: {
      closing: false,
      connecting: false,
      error: null,
      gate: 'some gate',
      open: false,
    },
    gates: (Map()).set('some gate', makeGatewayConnectionState('some gate')),
  });

});

it('Should return error state', () => {
  const expected = {
    closing: false,
    connecting: false,
    error: 'the error',
    gate: 'some gate',
    open: false,
  };
  expect(gatewayReducer('some gate')(undefined, gatewayError('cqs', 'some gate', 'the error'))).toEqual({
    default: expected,
    gates: Map([['some gate', expected]] as any),
  });

});
