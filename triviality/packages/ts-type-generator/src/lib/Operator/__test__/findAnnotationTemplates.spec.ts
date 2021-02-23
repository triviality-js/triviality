import { filesInMemory } from '../../Observable';
import { toArray } from 'rxjs/Operators';
import { of } from 'rxjs';
import { findAnnotationTemplates } from '../findAnnotationTemplates';

it('findFunctionAnnotationTemplates', async () => {
  expect(
    await of(`
  /**
   * @typeGenerator({ length: 10, templates:
   * ["services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];"]
   * } )
   */
 `)
      .pipe(findAnnotationTemplates('typeGenerator'), toArray())
      .toPromise()
  ).toMatchInlineSnapshot(`
    Array [
      " @typeGenerator({ length: 10, templates:
     [\\"services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];\\"]
     } )
    /",
    ]
  `);
});

it('findFunctionAnnotationTemplates multiple', async () => {
  expect(
    await of(`
  /**
   * @typeGenerator({ length: 10, templates: ["services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];"] })
   */
   export function servives(tags: any): any[];

  /**
   * @typeGenerator({ length: 10, templates: ["export function toInt({a%i: number}): void;"], removeNextLines: /;/})
   */
   export toInt(...args: number[]): void;
  `)
      .pipe(findAnnotationTemplates('typeGenerator'), toArray())
      .toPromise()
  ).toMatchInlineSnapshot(`
    Array [
      " @typeGenerator({ length: 10, templates: [\\"services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];\\"] })
    /",
      " @typeGenerator({ length: 10, templates: [\\"export function toInt({a%i: number}): void;\\"], removeNextLines: /;/})
    /",
    ]
  `);
});
