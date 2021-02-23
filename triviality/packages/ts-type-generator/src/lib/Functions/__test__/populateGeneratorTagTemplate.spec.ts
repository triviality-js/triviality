import { of } from 'rxjs';
import { toArray } from 'rxjs/Operators';
import {populateGeneratorTagTemplate} from "../populateGeneratorTagTemplate";

it('populateGeneratorTagTemplate', () => {
  expect(populateGeneratorTagTemplate('a%: number' )(2)).toEqual('a2: number');
  expect(populateGeneratorTagTemplate('c: typeof a%, a%: number')(5)).toEqual(
    'c: typeof a5, a5: number'
  );
});

it('populateGeneratorTagTemplate different template', () => {
  expect(populateGeneratorTagTemplate('["a%: number","a%: bool"]', 0b10)(2)).toEqual('a2: bool');
  expect(populateGeneratorTagTemplate('["c: typeof a%, a%: number", "foo:bar"]', 0b10000)(5)).toEqual(
    'foo:bar'
  );
  expect(populateGeneratorTagTemplate('["c: typeof a%, a%: number", "foo:bar"]', 0b10000)(99)).toEqual(
    "c: typeof a%, a%: number"
  );
});
