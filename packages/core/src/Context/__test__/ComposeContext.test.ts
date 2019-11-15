import { always } from 'ramda';
import { composeServiceByTags } from '../ComposeContext';

it('Can inject services', () => {
  const fetchService = jest.fn().mockReturnValueOnce(always(1)).mockReturnValueOnce(always('test'));
  const mockServiceFactory = jest.fn((a: number, b: string) => [a, b]);
  expect(composeServiceByTags(
    fetchService,
    mockServiceFactory,
    'a',
    'b',
  )()).toEqual([1, 'test']);
});

it('Should request dependencies when needed ', () => {
  const fetchService = jest.fn();

  const mockServiceFactory = jest.fn();
  const service = composeServiceByTags(fetchService, mockServiceFactory, 'a', 'b');
  expect(service).toBeInstanceOf(Function);
  expect(mockServiceFactory).not.toBeCalled();
  expect(fetchService).not.toBeCalled();
});
