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
   * @curryGenerator({
   *    argTemplate: 'f: ({{d%: D%}}) => S, {{["d%: KSF<T, D%>", "d%: __", "d%?: __"]}}',
   *    resultTemplate: "SF<S>;",
   *    maxCurry: 16,
   *    functionTemplate: 'compose<{{D%}}, S>',
   *    curryResultTemplate: "Curry%<T, S, {{D%}}>;",
   * })
   */

  compose<D1, S>(f: (d1: D1) => S, d1: KSF<T, D1>): SF<S>;

  compose<D1, S>(f: (d1: D1) => S, d1?: __): Curry1<T, S, D1>;


  compose<D1, D2, S>(f: (d1: D1, d2: D2) => S, d1: KSF<T, D1>, d2: KSF<T, D2>): SF<S>;

  compose<D1, D2, S>(f: (d1: D1, d2: D2) => S, d1: __, d2: KSF<T, D2>): Curry1<T, S, D1>;

  compose<D1, D2, S>(f: (d1: D1, d2: D2) => S, d1: KSF<T, D1>, d2?: __): Curry1<T, S, D2>;

  compose<D1, D2, S>(f: (d1: D1, d2: D2) => S, d1?: __, d2?: __): Curry2<T, S, D1, D2>;


  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>): SF<S>;

  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>): Curry1<T, S, D1>;

  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>): Curry1<T, S, D2>;

  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3?: __): Curry1<T, S, D3>;

  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S, d1: __, d2: __, d3: KSF<T, D3>): Curry2<T, S, D1, D2>;

  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S, d1: __, d2: KSF<T, D2>, d3?: __): Curry2<T, S, D1, D3>;

  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S, d1: KSF<T, D1>, d2?: __, d3?: __): Curry2<T, S, D2, D3>;

  compose<D1, D2, D3, S>(f: (d1: D1, d2: D2, d3: D3) => S, d1?: __, d2?: __, d3?: __): Curry3<T, S, D1, D2, D3>;


  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>): SF<S>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>): Curry1<T, S, D1>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>): Curry1<T, S, D2>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>): Curry1<T, S, D3>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4?: __): Curry1<T, S, D4>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>): Curry2<T, S, D1, D2>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>): Curry2<T, S, D1, D3>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>): Curry2<T, S, D2, D3>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4?: __): Curry2<T, S, D1, D4>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4?: __): Curry2<T, S, D2, D4>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3?: __, d4?: __): Curry2<T, S, D3, D4>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: __, d2: __, d3: __, d4: KSF<T, D4>): Curry3<T, S, D1, D2, D3>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: __, d2: __, d3: KSF<T, D3>, d4?: __): Curry3<T, S, D1, D2, D4>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: __, d2: KSF<T, D2>, d3?: __, d4?: __): Curry3<T, S, D1, D3, D4>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1: KSF<T, D1>, d2?: __, d3?: __, d4?: __): Curry3<T, S, D2, D3, D4>;

  compose<D1, D2, D3, D4, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4) => S, d1?: __, d2?: __, d3?: __, d4?: __): Curry4<T, S, D1, D2, D3, D4>;


  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>): SF<S>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry1<T, S, D1>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry1<T, S, D2>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry1<T, S, D3>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>): Curry1<T, S, D4>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5?: __): Curry1<T, S, D5>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry2<T, S, D1, D2>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry2<T, S, D1, D3>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>): Curry2<T, S, D2, D3>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>): Curry2<T, S, D1, D4>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>): Curry2<T, S, D2, D4>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: __, d5: KSF<T, D5>): Curry2<T, S, D3, D4>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5?: __): Curry2<T, S, D1, D5>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5?: __): Curry2<T, S, D2, D5>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5?: __): Curry2<T, S, D3, D5>;

  compose<D1, D2, D3, D4, D5, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4?: __, d5?: __): Curry2<T, S, D4, D5>;


  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): SF<S>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry1<T, S, D1>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry1<T, S, D2>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry1<T, S, D3>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry1<T, S, D4>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>): Curry1<T, S, D5>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6?: __): Curry1<T, S, D6>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D1, D2>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D1, D3>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D2, D3>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D1, D4>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D2, D4>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>): Curry2<T, S, D3, D4>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>): Curry2<T, S, D1, D5>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>): Curry2<T, S, D2, D5>;

  compose<D1, D2, D3, D4, D5, D6, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>): Curry2<T, S, D3, D5>;


  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): SF<S>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry1<T, S, D1>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry1<T, S, D2>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry1<T, S, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry1<T, S, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry1<T, S, D5>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: __, d7: KSF<T, D7>): Curry1<T, S, D6>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7?: __): Curry1<T, S, D7>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D1, D2>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D1, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D2, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D1, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D2, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D3, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D1, D5>;

  compose<D1, D2, D3, D4, D5, D6, D7, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>): Curry2<T, S, D2, D5>;


  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): SF<S>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D1>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D2>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D5>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: __, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry1<T, S, D6>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: __, d8: KSF<T, D8>): Curry1<T, S, D7>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8?: __): Curry1<T, S, D8>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D1, D2>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D1, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D2, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D1, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D2, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D3, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>): Curry2<T, S, D1, D5>;


  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): SF<S>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D1>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D2>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D5>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: __, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D6>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: __, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry1<T, S, D7>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: __, d9: KSF<T, D9>): Curry1<T, S, D8>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9?: __): Curry1<T, S, D9>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D1, D2>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D1, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D2, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D1, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D2, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>): Curry2<T, S, D3, D4>;


  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): SF<S>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D1>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D2>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: __, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D5>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: __, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D6>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: __, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D7>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: __, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry1<T, S, D8>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: __, d10: KSF<T, D10>): Curry1<T, S, D9>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10?: __): Curry1<T, S, D10>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: __, d2: __, d3: KSF<T, D3>, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry2<T, S, D1, D2>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: __, d2: KSF<T, D2>, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry2<T, S, D1, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: __, d3: __, d4: KSF<T, D4>, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry2<T, S, D2, D3>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: __, d2: KSF<T, D2>, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry2<T, S, D1, D4>;

  compose<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, S>(f: (d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, d10: D10) => S, d1: KSF<T, D1>, d2: __, d3: KSF<T, D3>, d4: __, d5: KSF<T, D5>, d6: KSF<T, D6>, d7: KSF<T, D7>, d8: KSF<T, D8>, d9: KSF<T, D9>, d10: KSF<T, D10>): Curry2<T, S, D2, D4>;


}

export const createComposeContext = <T>(context: CompileContext<T>): ComposeContext<T> => {
  return {
    compose(f: (...args: unknown[]) => unknown, ...keys: (keyof T | USF)[]): USF {
      const curried: any = composeCurryN(context, f.length, f);
      return curried(...keys);
    }
  } as unknown as ComposeContext<T>
};
