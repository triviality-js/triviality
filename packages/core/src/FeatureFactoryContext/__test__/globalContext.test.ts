import { getCurrentContext } from '../globalContext';

it('getCurrentContext', () => {
  expect(getCurrentContext).toThrowError();
});
