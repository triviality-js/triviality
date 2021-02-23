import {stripEmptyGeneric} from "../stripEmptyGeneric";

it('stripEmptyGeneric should remove empty statements', () => {
  expect(
    stripEmptyGeneric('compose<, , F extends () => S, S>(f: F): SF<S>;')
  ).toEqual(`compose<F extends () => S, S>(f: F): SF<S>;`);
});
