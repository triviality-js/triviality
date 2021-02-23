import { of } from 'rxjs';
import { toArray } from 'rxjs/Operators';
import {matchEmptyOrStatement, findTextToRemove} from '../findTextToRemove';

it('findTextToRemove', () => {
  expect(
    findTextToRemove(
      `d;
ddsad;

sad;;

Do not remove!

Don't ignore this;
`,
      matchEmptyOrStatement()
    )
  ).toEqual(`d;
ddsad;

sad;;
`);
});

