import { of } from 'rxjs';
import { generateCurryInDocument } from '@triviality/ts-type-generator';
import * as fs from "fs";

it('generateCurryInDocument', async () => {
  expect(
    await of(`

export interface ComposeContext<T> {

  /**
   * @curryGenerator({
   *    argTemplate: 'f: ({{d%: D%}}) => S, {{["d%: KSF<T, D%>", "d%: __", "d%?: __"]}}',
   *    argCurryTemplate: "d%: __",
   *    resultTemplate: "SF<S>;",
   *    maxCurry: 16,
   *    functionTemplate: 'compose<{{D%}}, S>',
   *    curryResultTemplate: "Curry%<T, S, {{D%}}>;",
   * })
   */
  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S, k1: __, k2: KSF<T, D2>, k3: KSF<T, D3>): Curry1<T, S, D1>;

`)
      .pipe(generateCurryInDocument)
      .toPromise()
  ).toMatchInlineSnapshot(`
    "

    export interface ComposeContext<T> {

      /**
       * @curryGenerator({
       *    argTemplate: 'f: ({{d%: D%}}) => S, {{[\\"d%: KSF<T, D%>\\", \\"d%: __\\", \\"d%?: __\\"]}}',
       *    argCurryTemplate: \\"d%: __\\",
       *    resultTemplate: \\"SF<S>;\\",
       *    maxCurry: 16,
       *    functionTemplate: 'compose<{{D%}}, S>',
       *    curryResultTemplate: \\"Curry%<T, S, {{D%}}>;\\",
       * })
       */

      compose<D1, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry7<T, S, D9, D8, D7, D6, D5, D4, D3>;

      compose<D1, D2, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry5<T, S, D8, D7, D6, D5, D4>;

      compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry3<T, S, D7, D6, D5>;

      compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry1<T, S, D6>;

      compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry1<T, S, D5>;

      compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>): Curry3<T, S, D4, D5, D6>;

      compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>): Curry5<T, S, D3, D4, D5, D6, D7>;

      compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2) => S, d1: KSF<T, D1>, d2: KSF<T, D2>): Curry7<T, S, D2, D3, D4, D5, D6, D7, D8>;

      compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1) => S, d1: KSF<T, D1>): Curry9<T, S, D1, D2, D3, D4, D5, D6, D7, D8, D9>;

      compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: () => S, ): Curry11<T, S, D0, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>;

    "
  `);
});
