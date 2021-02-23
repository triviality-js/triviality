/**
 * Context for constructing new services.
 */
import {getServiceFactories, getServiceInstances, KSF, SF, USF} from "../Value";
import {CompileContext} from "./CompileContext";
import {composeCurryN, Curry1, Curry10, Curry2, Curry3, Curry4, Curry5, Curry6, Curry7, Curry8, Curry9} from "./Curry";

export interface ConstructContext<T> {
  construct<S>(f: new () => S): SF<S>;

  /**
   * @typeGenerator({
   *  templates: [
   *    "  construct<{{D%}}, S>(f: new ({{d%: D%}}) => S, {{d%: KSF<T, D%>}}): SF<S>;\n",
   *    "  construct<{{D%}}, S>(f: new ({{d%: D%}}) => S): Curry%<T, S, {{D%}}>;\n",
   *   ],
   * })
   */
  construct<D1, S>(f: new (d1: D1) => S, d1: KSF<T, D1>): SF<S>;

  construct<D1, S>(f: new (d1: D1) => S): Curry1<T, S, D1>;

  construct<D1, D2, S>(f: new (d1: D1, d2: D2) => S, d1: KSF<T, D1>, d2: KSF<T, D2>): SF<S>;

  construct<D1, D2, S>(f: new (d1: D1, d2: D2) => S): Curry2<T, S, D1, D2>;

  construct<D1, D2, D3, S>(f: new (d1: D1, d2: D2, d3: D3) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>): SF<S>;

  construct<D1, D2, D3, S>(f: new (d1: D1, d2: D2, d3: D3) => S): Curry3<T, S, D1, D2, D3>;

  construct<D1, D2, D3, D4, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>): SF<S>;

  construct<D1, D2, D3, D4, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4) => S): Curry4<T, S, D1, D2, D3, D4>;

  construct<D1, D2, D3, D4, D5, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>): SF<S>;

  construct<D1, D2, D3, D4, D5, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S): Curry5<T, S, D1, D2, D3, D4, D5>;

  construct<D1, D2, D3, D4, D5, D6, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): SF<S>;

  construct<D1, D2, D3, D4, D5, D6, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S): Curry6<T, S, D1, D2, D3, D4, D5, D6>;

  construct<D1, D2, D3, D4, D5, D6, D7, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): SF<S>;

  construct<D1, D2, D3, D4, D5, D6, D7, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S): Curry7<T, S, D1, D2, D3, D4, D5, D6, D7>;

  construct<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): SF<S>;

  construct<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S): Curry8<T, S, D1, D2, D3, D4, D5, D6, D7, D8>;

  construct<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): SF<S>;

  construct<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S): Curry9<T, S, D1, D2, D3, D4, D5, D6, D7, D8, D9>;

  construct<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): SF<S>;

  construct<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: new (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S): Curry10<T, S, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>;

}

export const createConstructContext = <T>(context: CompileContext<T>): ConstructContext<T> => {
  return {
    construct(f: new (...args: unknown[]) => void, ...keys: (keyof T | USF)[]): USF {
      if (f.length < keys.length) {
        return composeCurryN(context, f.length, (...args) => new f(...args));
      }
      const serviceFactories = getServiceFactories(context.getServiceFactory, keys);
      return context.serviceReferenceFactory(() => {
        const serviceInstances = getServiceInstances(serviceFactories);
        return new f(...serviceInstances);
      });
    }
  } as unknown as ConstructContext<T>
};
