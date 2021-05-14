import { generateTypesInDocument } from '../ts-type-generator';
import { of } from 'rxjs';

it('generateFunctionsInDocument should remove old lines', async () => {
  expect(
    await of(`
  /**
   * @typeGenerator({ length: 4, templates: ["compose<{{t% extends keyof T}}, F extends ({{d%: SFT<T[t%]>}}) => S, S>(f: F, {{k%: t%}}): () => S;"] })
   */
   compose<t1 extends keyof T, t2 extends keyof T}, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>) => S, S>(f: F, k1: t1, k2: t2}): () => S;
  Remove this;
  compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T}, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4}): () => S;

  preserve this

  `)
      .pipe(generateTypesInDocument)
      .toPromise()
  ).toMatchInlineSnapshot(`
    "
      /**
       * @typeGenerator({ length: 4, templates: [\\"compose<{{t% extends keyof T}}, F extends ({{d%: SFT<T[t%]>}}) => S, S>(f: F, {{k%: t%}}): () => S;\\"] })
       */

       compose<t1 extends keyof T, F extends (d1: SFT<T[t1]>) => S, S>(f: F, k1: t1): () => S;
       compose<t1 extends keyof T, t2 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>) => S, S>(f: F, k1: t1, k2: t2): () => S;
       compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3): () => S;
       compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4): () => S;
      preserve this

      "
  `);
});
