import { always } from 'ramda';
import { constructServiceByTags } from '../ConstructContext';

class MyService {
  constructor(_a: number, _b: string) {
    // noop.
  }
}

it('Can inject services', () => {
  const fetchService = jest.fn().mockReturnValueOnce(always(1)).mockReturnValueOnce(always('test'));
  expect(constructServiceByTags(fetchService)(
    MyService,
    'a',
    'b',
  )()).toEqual(new MyService(1, 'test'));
});

it('Should request dependencies when needed ', () => {
  const fetchService = jest.fn();

  const service = constructServiceByTags(fetchService)(
    class {
      constructor() {
        throw new Error('Should not be called');
      }
    },
    'a',
    'b',
  );
  expect(service).toBeInstanceOf(Function);
  expect(fetchService).not.toBeCalled();
});
