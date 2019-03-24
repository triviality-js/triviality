import { ImmutableUuIdIdentity } from '../ImmutableUuIdIdentity';
import { Map } from 'immutable';
import { TransitJSSerializer } from '../../Serializer/transit-js/TransitJSSerializer';
import { createClassHandlers } from '../../Serializer/transit-js/createClassHandlers';

it('Can create an instance', () => {
  const instance: ImmutableUuIdIdentity = ImmutableUuIdIdentity.create();
  expect(instance).toBeInstanceOf(ImmutableUuIdIdentity);
});

it('Can use it as immutable key', () => {
  const id1 = new ImmutableUuIdIdentity('116c0062-7947-44bd-b1df-08537946ce16');
  const id2 = new ImmutableUuIdIdentity('116c0062-7947-44bd-b1df-08537946ce15');

  const map = Map<ImmutableUuIdIdentity, any>()
    .set(id1, 'number 1')
    .set(id2, 'number 2');

  expect(map.get(id1)).toBe('number 1');
  expect(map.get(id2)).toBe('number 2');
  expect(map.get(new ImmutableUuIdIdentity('116c0062-7947-44bd-b1df-08537946ce16'))).toBe('number 1');
  expect(map.get(new ImmutableUuIdIdentity('116c0062-7947-44bd-b1df-08537946ce15'))).toBe('number 2');
});

it('Can extends class', () => {
  class Id extends ImmutableUuIdIdentity {

  }
  const instance = new Id('116c0062-7947-44bd-b1df-08537946ce15');
  expect(instance).toBeInstanceOf(Id);
  expect(instance.toString()).toBe('116c0062-7947-44bd-b1df-08537946ce15');
});

it('Can serialize class', () => {
  const classes = { id: ImmutableUuIdIdentity };

  const serializer = new TransitJSSerializer([], createClassHandlers(classes));
  const serialized = serializer.serialize(new ImmutableUuIdIdentity('116c0062-7947-44bd-b1df-08537946ce15'));

  const unSerialized = serializer.deserialize(serialized);

  expect(unSerialized).toBeInstanceOf(ImmutableUuIdIdentity);
  expect(unSerialized).toEqual(new ImmutableUuIdIdentity('116c0062-7947-44bd-b1df-08537946ce15'));
});
