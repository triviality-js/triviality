import { ImmutableScalarIdentity } from '../ImmutableScalarIdentity';
import { Map } from 'immutable';
import { TransitJSSerializer } from '../../Serializer/transit-js/TransitJSSerializer';
import { createClassHandlers } from '../../Serializer/transit-js/createClassHandlers';

it('Can create an instance with string identity', () => {
  const instance = new ImmutableScalarIdentity<string>('test');
  expect(instance).toBeInstanceOf(ImmutableScalarIdentity);
  expect(instance.getValue()).toBe('test');
});

it('Can create an instance with numeric identity', () => {
  const instance = new ImmutableScalarIdentity<number>(1);
  expect(instance).toBeInstanceOf(ImmutableScalarIdentity);
  expect(instance.getValue()).toBe(1);
});

it('Can use it as immutable key', () => {
  const id1 = new ImmutableScalarIdentity<number>(1);
  const id2 = new ImmutableScalarIdentity<number>(2);

  const map = Map<ImmutableScalarIdentity<number>, any>()
    .set(id1, 'number 1')
    .set(id2, 'number 2');

  expect(map.get(id1)).toBe('number 1');
  expect(map.get(id2)).toBe('number 2');
  expect(map.get(new ImmutableScalarIdentity<number>(1))).toBe('number 1');
  expect(map.get(new ImmutableScalarIdentity<number>(2))).toBe('number 2');
});

it('Can extends class', () => {
  class Id extends ImmutableScalarIdentity<number> {

  }
  const instance = new Id(1);
  expect(instance).toBeInstanceOf(Id);
  expect(instance.getValue()).toBe(1);
});

it('Can serialize class', () => {
  const classes = { id: ImmutableScalarIdentity };

  const serializer = new TransitJSSerializer([], createClassHandlers(classes));
  const serialized = serializer.serialize(new ImmutableScalarIdentity(2323));

  const unSerialized = serializer.deserialize(serialized);

  expect(unSerialized).toBeInstanceOf(ImmutableScalarIdentity);
  expect(unSerialized).toEqual(new ImmutableScalarIdentity(2323));
});
