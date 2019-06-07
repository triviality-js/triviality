import { DomStorageStoreAdapter } from '../DomStorageStoreAdapter';

it('Can set a value', () => {
  const store = new DomStorageStoreAdapter(localStorage);
  store.set('foo', 'bar');
  expect(store.get('foo')).toEqual('bar');
});

it('should know it has a value', () => {
  const store = new DomStorageStoreAdapter(localStorage);
  expect(store.has('test')).toBeFalsy();
  store.set('foo', 'bar');
  expect(store.has('foo')).toBeTruthy();
});
