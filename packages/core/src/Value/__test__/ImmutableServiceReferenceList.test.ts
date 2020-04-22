import { ImmutableServiceReferenceList } from '../ImmutableServiceReferenceList';

it('Filter async services', () => {
  const list = new ImmutableServiceReferenceList([{
    type: 'async',
  }, {
    type: 'internal',
  }] as any);
  expect(list.async().toArray()).toEqual([{ type: 'async' }]);
  expect(list.notASync().toArray()).toEqual([{ type: 'internal' }]);
});
