import { SerializableAction } from '../SerializableAction';
import { hasEntityMetadata, actionTypeWithEntity, actionTypeWithEntityFactory } from '../EntityMetadata';

it('Should know when its has valid entity metadata', () => {
  const action: SerializableAction = {
    type: 'hi',
    metadata: {
      playhead: 1,
      entity: 'PRODUCTS',
    },
  };

  expect(hasEntityMetadata(action)).toBeTruthy();
  expect(hasEntityMetadata('Not valid')).toBeFalsy();
  expect(hasEntityMetadata(null)).toBeFalsy();
  expect(hasEntityMetadata(undefined)).toBeFalsy();
  expect(hasEntityMetadata({ type: 'test' })).toBeFalsy();
  expect(hasEntityMetadata({ metadata: {} })).toBeFalsy();
  expect(hasEntityMetadata({ metadata: { test: 'string' } })).toBeFalsy();
  expect(hasEntityMetadata({ metadata: null })).toBeFalsy();
});

it('Can create entity names', () => {
  expect(actionTypeWithEntity('bought', 'PRODUCTS')).toEqual('[PRODUCTS] bought');
  expect(actionTypeWithEntity('login', 'USER')).toEqual('[USER] login');
});

it('Can create entity names, by factory', () => {
  expect(actionTypeWithEntityFactory('bought')('PRODUCTS')).toEqual('[PRODUCTS] bought');
  expect(actionTypeWithEntityFactory('login')('USER')).toEqual('[USER] login');
});
