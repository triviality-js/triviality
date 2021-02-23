/**
 * Context for creating new service factories.
 */
import {getServiceFactories, getServiceInstances, KSF, SF, USF} from "../Value";
import {CompileContext} from "./CompileContext";
import {PickByValue} from 'utility-types';
import {ContainerError} from "../Error";
import {composeCurryN, Curry1, Curry10, Curry2, Curry3, Curry4, Curry5, Curry6, Curry7, Curry8, Curry9} from "./Curry";
import {LoDashStatic as __} from "lodash";

export interface ComposeContext<T> {
  compose<S>(f: () => S): SF<S>;

  /**
   * @typeGenerator({
   *    templates: [
   *      "  compose<{{D%}}, S>(f: ({{d%: D%}}) => S, {{k%: KSF<T, D%>}}): SF<S>;\n",
   *      "  compose<{{D%}}, S>(f: ({{d%: D%}}) => S): Curry%<T, S, {{D%}}>;\n",
   *    ],
   * })
   */
  compose<D1, S>(f: (d1: D1) => S, k1: KSF<T, D1>): SF<S>;

  compose<D1, S>(f: (d1: D1) => S): Curry1<T, S, D1>;

  compose<D1, D2, S>(f: (d1: D1, d2: D2) => S, k1: KSF<T, D1>, k2: KSF<T, D2>): SF<S>;

  compose<D1, D2, S>(f: (d1: D1, d2: D2) => S): Curry2<T, S, D1, D2>;

  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S, k1: KSF<T, D1>, k2: KSF<T, D2>, k3: KSF<T, D3>): SF<S>;

  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S): Curry3<T, S, D1, D2, D3>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, k1: KSF<T, D1>, k2: KSF<T, D2>, k3: KSF<T, D3>, k4: KSF<T, D4>): SF<S>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S): Curry4<T, S, D1, D2, D3, D4>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, k1: KSF<T, D1>, k2: KSF<T, D2>, k3: KSF<T, D3>, k4: KSF<T, D4>, k5: KSF<T, D5>): SF<S>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S): Curry5<T, S, D1, D2, D3, D4, D5>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, k1: KSF<T, D1>, k2: KSF<T, D2>, k3: KSF<T, D3>, k4: KSF<T, D4>, k5: KSF<T, D5>, k6: KSF<T, D6>): SF<S>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S): Curry6<T, S, D1, D2, D3, D4, D5, D6>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, k1: KSF<T, D1>, k2: KSF<T, D2>, k3: KSF<T, D3>, k4: KSF<T, D4>, k5: KSF<T, D5>, k6: KSF<T, D6>, k7: KSF<T, D7>): SF<S>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S): Curry7<T, S, D1, D2, D3, D4, D5, D6, D7>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, k1: KSF<T, D1>, k2: KSF<T, D2>, k3: KSF<T, D3>, k4: KSF<T, D4>, k5: KSF<T, D5>, k6: KSF<T, D6>, k7: KSF<T, D7>, k8: KSF<T, D8>): SF<S>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S): Curry8<T, S, D1, D2, D3, D4, D5, D6, D7, D8>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, k1: KSF<T, D1>, k2: KSF<T, D2>, k3: KSF<T, D3>, k4: KSF<T, D4>, k5: KSF<T, D5>, k6: KSF<T, D6>, k7: KSF<T, D7>, k8: KSF<T, D8>, k9: KSF<T, D9>): SF<S>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S): Curry9<T, S, D1, D2, D3, D4, D5, D6, D7, D8, D9>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, k1: KSF<T, D1>, k2: KSF<T, D2>, k3: KSF<T, D3>, k4: KSF<T, D4>, k5: KSF<T, D5>, k6: KSF<T, D6>, k7: KSF<T, D7>, k8: KSF<T, D8>, k9: KSF<T, D9>, k10: KSF<T, D10>): SF<S>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S): Curry10<T, S, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>;

  /**
   * @curryGenerator({
   *    argTemplate: '{{["f: ({{d%: D%}}}) => S, {{d%: KSF<T, D%>}}", "d%: __"]}}',
   *    resultTemplate: "SF<S>;",
   *    maxCurry: 16,
   *    functionTemplate: 'compose<{{D%}}, S>',
   *    curryResultTemplate: "Curry%<T, S, {{D%}}>;",
   * })
   */
  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S, k1: __, k2: KSF<T, D2>, k3: KSF<T, D3>): Curry1<T, S, D1>;
}

export const createComposeContext = <T>(context: CompileContext<T>): ComposeContext<T> => {
  return {
    compose(f: (...args: unknown[]) => unknown, ...keys: (keyof T | USF)[]): USF {
      if (keys.length === 0) {
        return composeCurryN(context, f.length, f);
      }
      const curried: any = composeCurryN(context, f.length, f);
      return curried(...keys);
    }
  } as unknown as ComposeContext<T>
};
