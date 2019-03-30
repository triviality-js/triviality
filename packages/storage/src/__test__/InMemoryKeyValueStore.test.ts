/* tslint:disable:max-classes-per-file */

import { inMemory, InMemoryKeyValueStore } from '../InMemoryKeyValueStore';

describe('InMemoryKeyValueStore', () => {

  it('Should be able to create an instance', () => {
    expect(inMemory()).toBeInstanceOf(InMemoryKeyValueStore);
  });

  it('Should be able to set a value', () => {
    expect(inMemory().set('test', 'hi').get('test')).toBe('hi');
  });

  it('Should know if there is a value', () => {
    const store = inMemory().set('test', 'hi');
    expect(store.has('test')).toBeTruthy();
    expect(store.has('foo')).toBeFalsy();
  });

  it('Should be able to find a value', () => {
    const store = inMemory().set('test', 'hi');
    expect(store.find('test')).toBe('hi');
    expect(store.find('foo')).toEqual(null);
    expect(store.find('foo', 'bar')).toEqual('bar');
  });

});
