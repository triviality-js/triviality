import { memorize } from '../memorize';

it('memorize without arguments', () => {
  const spy = jest.fn(() => 123);
  const memory = memorize(spy);
  expect(memory()).toEqual(123);
  expect(memory()).toEqual(123);
  expect(spy).toHaveBeenCalledTimes(1);
});

it('memorize single argument', () => {
  const spy = jest.fn((value: number) => value);
  const memory = memorize(spy);
  expect(memory(1)).toEqual(1);
  expect(memory(1)).toEqual(1);
  expect(spy).toHaveBeenCalledTimes(1);

  expect(memory(2)).toEqual(2);
  expect(memory(2)).toEqual(2);
  expect(spy).toHaveBeenCalledTimes(2);
});

it('memorize 2 argument2', () => {
  const spy = jest.fn((value: number, v2: string) => value + v2);
  const memory = memorize(spy);
  expect(memory(1, 'db')).toEqual('1db');
  expect(memory(1, 'db')).toEqual('1db');
  expect(spy).toHaveBeenCalledTimes(1);

  expect(memory(2, 'meters')).toEqual('2meters');
  expect(memory(2, 'meters')).toEqual('2meters');
  expect(spy).toHaveBeenCalledTimes(2);

  expect(memory(1, 'meters')).toEqual('1meters');
  expect(memory(1, 'meters')).toEqual('1meters');
  expect(spy).toHaveBeenCalledTimes(3);
});

it('memorize by reference', () => {
  const spy = jest.fn((value: number) => value);
  const memory = memorize(spy);
  const ref1 = {};
  const ref2 = {};
  expect(memory(ref1)).toEqual(ref1);
  expect(memory(ref1)).toEqual(ref1);
  expect(memory(ref2)).toEqual(ref2);
  expect(memory(ref2)).toEqual(ref2);
  expect(spy).toHaveBeenCalledTimes(2);
});

it('Support undefined', () => {
  const spy = jest.fn((...value: any[]) => value[value.length - 1]);
  const memory = memorize(spy);
  const ref1 = {};
  const ref2 = {};
  expect(memory(undefined, ref1)).toEqual(ref1);
  expect(memory(undefined, ref1)).toEqual(ref1);
  expect(memory(undefined)).toEqual(undefined);
  expect(memory(undefined)).toEqual(undefined);
  expect(memory(ref2)).toEqual(ref2);
  expect(spy).toHaveBeenCalledTimes(3);
});
