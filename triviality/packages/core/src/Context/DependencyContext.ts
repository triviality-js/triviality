import { ServicesAsFactories } from '../Value';
import {CompileContext} from "./CompileContext";

export interface DependencyContext<TDependencies> {
  dependencies: ServicesAsFactories<TDependencies>;
}

export const createFeatureFactoryDependencyContext = <TDependencies>(context: CompileContext<TDependencies>): DependencyContext<TDependencies> => {
  return ({
    dependencies: context.getServices()
  });
};
