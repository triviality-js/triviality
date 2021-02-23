import { of } from 'rxjs';
import { toArray } from 'rxjs/Operators';
import {generateRecurringString} from "../generateRecurringString";


it('generateRecurringString should generate string based on length and template', () => {
  const g = generateRecurringString(3, false);
  expect(g((i) => `[${i}]`, ', ')).toEqual('[1], [2], [3]');

  const gE = generateRecurringString(3, true);
  expect(gE((i) => `[${i}]`, ', ')).toEqual('[0], [1], [2], [3]');
});
