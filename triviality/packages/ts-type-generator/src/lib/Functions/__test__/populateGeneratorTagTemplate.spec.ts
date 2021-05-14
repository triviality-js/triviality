import { of } from 'rxjs';
import { toArray } from 'rxjs/Operators';
import {populateGeneratorTagTemplate} from "../populateGeneratorTagTemplate";
import {CurryPositions} from "../../CurryPositions";

it('populateGeneratorTagTemplate', () => {
  expect(populateGeneratorTagTemplate('a%: number' )(2)).toEqual('a2: number');
  expect(populateGeneratorTagTemplate('c: typeof a%, a%: number')(5)).toEqual(
    'c: typeof a5, a5: number'
  );
});

it('populateGeneratorTagTemplate different template', () => {
  expect(populateGeneratorTagTemplate('["a%: number","a%: bool"]', new CurryPositions(4, 0b10))(2)).toEqual('a2: bool');
  expect(populateGeneratorTagTemplate('["c: typeof a%, a%: number", "foo:bar%", "foo:?bar%"]', new CurryPositions(5, 0b10000))(5)).toEqual(
    'foo:bar5'
  );
  expect(populateGeneratorTagTemplate('["c: typeof a%, a%: number", "foo:bar%", "foo:?bar%"]', new CurryPositions(100, 0b10000))(99)).toEqual(
    "c: typeof a99, a99: number"
  );

  expect(populateGeneratorTagTemplate('["c: typeof a%, a%: number", "foo:bar%", "foo:?bar%"]', new CurryPositions(4, 0b10111))(3)).toEqual(
    "foo:?bar3"
  );
});
