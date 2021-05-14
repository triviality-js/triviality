/**
 * Context for constructing new services.
 */
import {getServiceFactories, getServiceInstances, KSF, SF, USF} from "../Value";
import {CompileContext} from "./CompileContext";
import {composeCurryN, Curry1, Curry10, Curry2, Curry3, Curry4, Curry5, Curry6, Curry7, Curry8, Curry9} from "./Curry";

export interface ConstructContext<T> {
  construct<S>(f: new () => S): SF<S>;

  /**
   * @curryGenerator({
   *    argTemplate: 'f: new ({{d%: D%}}) => S, {{["d%: KSF<T, D%>", "d%: __", "d%?: __"]}}',
   *    resultTemplate: "SF<S>;",
   *    maxCurry: 16,
   *    functionTemplate: 'construct<{{D%}}, S>',
   *    curryResultTemplate: "Curry%<T, S, {{D%}}>;",
   * })
   */
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
