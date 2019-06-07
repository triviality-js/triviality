import 'jest';
import { isSerializableAction } from '../SerializableAction';

it('isSerializableAction', () => {

  expect(isSerializableAction({ type: 'test', metadata: { entity: 'test', playhead: 1 } })).toBeTruthy();
  expect(isSerializableAction({ type: 'test', metadata: { entity: 'test' } })).toBeTruthy();

  expect(isSerializableAction({ type: 'test', metadata: { entity: 23, playhead: 1 } })).toBeFalsy();
  expect(isSerializableAction({ type: 'test', metadata: { entity: 'test', playhead: 'test' } })).toBeFalsy();

  expect(isSerializableAction({ type: 1, metadata: { entity: 'test' } })).toBeFalsy();
  expect(isSerializableAction({ type: 'test', metadata: {} })).toBeFalsy();
  expect(isSerializableAction({ metadata: { entity: 'test' } })).toBeFalsy();

  expect(isSerializableAction({ type: 'test' })).toBeFalsy();
  expect(isSerializableAction(null)).toBeFalsy();
  expect(isSerializableAction('test')).toBeFalsy();
  expect(isSerializableAction(true)).toBeFalsy();
  expect(isSerializableAction(1)).toBeFalsy();
});
