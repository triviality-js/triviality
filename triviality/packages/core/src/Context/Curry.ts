import {LoDashStatic as __, filter} from "lodash";
import {__ as placeholder} from "lodash/fp";
import {getServiceFactories, getServiceInstances, KSF, SF, USF} from "../Value";
import {CompileContext} from "./CompileContext";
import {curryN} from "lodash/fp";

export {placeholder as __};


export const composeCurryN = <T>(context: CompileContext<T>, arity: number, callback: (...services: unknown[]) => unknown) => {
  return curryN(arity, (...keys: (keyof T | USF)[]) => {
    const serviceFactories = getServiceFactories(context.getServiceFactory, keys);
    return context.serviceReferenceFactory(() => {
      const serviceInstances = getServiceInstances(serviceFactories);
      const output = callback(...serviceInstances);
      return output;
    });
  });
};


/**
 * @curryInterfaceGenerator({
 *    interfaceTemplate: "export interface Curry%<T, S, {{D%}}>",
 *    argTemplate: '{{["d%: KSF<T, D%>", "d%: __", "d%?: __"]}}',
 *    resultTemplate: "SF<S>;",
 *    maxCurry: 16,
 *    curryResultTemplate: "Curry%<T, S, {{D%}}>;",
 * })
 */

export interface Curry1<T, S, D1> {
  (d1: KSF<T, D1>): SF<S>;

  (d1?: __): Curry1<T, S, D1>;
}


export interface Curry2<T, S, D1, D2> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>): SF<S>;

  (d1: __, d2: KSF<T, D2>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2?: __): Curry1<T, S, D2>;

  (d1?: __, d2?: __): Curry2<T, S, D1, D2>;

}


export interface Curry3<T, S, D1, D2, D3> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>): SF<S>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>): Curry1<T, S, D2>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3?: __): Curry1<T, S, D3>;

  (d1: __, d2: __, d3: KSF<T, D3>): Curry2<T, S, D1, D2>;

  (d1: __, d2: KSF<T, D2>, d3?: __): Curry2<T, S, D1, D3>;

  (d1: KSF<T, D1>, d2?: __, d3?: __): Curry2<T, S, D2, D3>;

  (d1?: __, d2?: __, d3?: __): Curry3<T, S, D1, D2, D3>;


}


export interface Curry4<T, S, D1, D2, D3, D4> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>): SF<S>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>): Curry1<T, S, D2>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>): Curry1<T, S, D3>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4?: __): Curry1<T, S, D4>;

  (d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>): Curry2<T, S, D1, D2>;

  (d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>): Curry2<T, S, D1, D3>;

  (d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>): Curry2<T, S, D2, D3>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4?: __): Curry2<T, S, D1, D4>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4?: __): Curry2<T, S, D2, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3?: __, d4?: __): Curry2<T, S, D3, D4>;

  (d1: __, d2: __, d3: __, d4: KSF<T, D4>): Curry3<T, S, D1, D2, D3>;

  (d1: __, d2: __, d3: KSF<T, D3>, d4?: __): Curry3<T, S, D1, D2, D4>;

  (d1: __, d2: KSF<T, D2>, d3?: __, d4?: __): Curry3<T, S, D1, D3, D4>;

  (d1: KSF<T, D1>, d2?: __, d3?: __, d4?: __): Curry3<T, S, D2, D3, D4>;

  (d1?: __, d2?: __, d3?: __, d4?: __): Curry4<T, S, D1, D2, D3, D4>;


}


export interface Curry5<T, S, D1, D2, D3, D4, D5> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>): SF<S>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry1<T, S, D2>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry1<T, S, D3>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>): Curry1<T, S, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5?: __): Curry1<T, S, D5>;

  (d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry2<T, S, D1, D2>;

  (d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry2<T, S, D1, D3>;

  (d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry2<T, S, D2, D3>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>): Curry2<T, S, D1, D4>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>): Curry2<T, S, D2, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: __, d5: KSF<T, D5>): Curry2<T, S, D3, D4>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5?: __): Curry2<T, S, D1, D5>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5?: __): Curry2<T, S, D2, D5>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5?: __): Curry2<T, S, D3, D5>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4?: __, d5?: __): Curry2<T, S, D4, D5>;


}


export interface Curry6<T, S, D1, D2, D3, D4, D5, D6> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): SF<S>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry1<T, S, D2>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry1<T, S, D3>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry1<T, S, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>): Curry1<T, S, D5>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6?: __): Curry1<T, S, D6>;

  (d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D1, D2>;

  (d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D1, D3>;

  (d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D2, D3>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D1, D4>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D2, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D3, D4>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>): Curry2<T, S, D1, D5>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>): Curry2<T, S, D2, D5>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>): Curry2<T, S, D3, D5>;


}


export interface Curry7<T, S, D1, D2, D3, D4, D5, D6, D7> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): SF<S>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry1<T, S, D2>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry1<T, S, D3>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry1<T, S, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry1<T, S, D5>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: __, d7: KSF<T, D7>): Curry1<T, S, D6>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7?: __): Curry1<T, S, D7>;

  (d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D1, D2>;

  (d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D1, D3>;

  (d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D2, D3>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D1, D4>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D2, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D3, D4>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D1, D5>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D2, D5>;


}


export interface Curry8<T, S, D1, D2, D3, D4, D5, D6, D7, D8> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): SF<S>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D2>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D3>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D5>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: __, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D6>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: __, d8: KSF<T, D8>): Curry1<T, S, D7>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8?: __): Curry1<T, S, D8>;

  (d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D1, D2>;

  (d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D1, D3>;

  (d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D2, D3>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D1, D4>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D2, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D3, D4>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D1, D5>;


}


export interface Curry9<T, S, D1, D2, D3, D4, D5, D6, D7, D8, D9> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): SF<S>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D2>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D3>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D5>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: __, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D6>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: __, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D7>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: __, d9: KSF<T, D9>): Curry1<T, S, D8>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9?: __): Curry1<T, S, D9>;

  (d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D1, D2>;

  (d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D1, D3>;

  (d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D2, D3>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D1, D4>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D2, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D3, D4>;


}


export interface Curry10<T, S, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10> {
  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): SF<S>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D1>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D2>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D3>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D4>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D5>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: __, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D6>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: __, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D7>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: __, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D8>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: __, d10: KSF<T, D10>): Curry1<T, S, D9>;

  (d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10?: __): Curry1<T, S, D10>;

  (d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry2<T, S, D1, D2>;

  (d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry2<T, S, D1, D3>;

  (d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry2<T, S, D2, D3>;

  (d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry2<T, S, D1, D4>;

  (d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry2<T, S, D2, D4>;


}
