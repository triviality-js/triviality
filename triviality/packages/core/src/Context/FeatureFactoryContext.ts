import {ComposeContext, createComposeContext} from "./ComposeContext";
import {ConstructContext, createConstructContext} from "./ConstructContext";
import {CompileContext} from "./CompileContext";
import {createOverrideContext, OverrideContext} from "./OverrideContext";
import {AsyncContext, createFeatureFactoryAsyncContext} from "./AsyncContext";
import {createFeatureFactoryRegistryContext, RegistryContext} from "./RegistryContext";
import {createFeatureMergeContext, MergeFeatureContext} from "./MergeFeatureContext";
import {createFeatureFactoryDependencyContext, DependencyContext} from "./DependencyContext";

export interface FeatureFactoryContext<T> extends ComposeContext<T>, ConstructContext<T>, OverrideContext<T>, AsyncContext, RegistryContext<T>, MergeFeatureContext<T>, DependencyContext<T> {
}

export const createFeatureFactoryContext = <T>(context: CompileContext<T>): FeatureFactoryContext<T> => {
  return {
    ...createConstructContext<T>(context),
    ...createComposeContext<T>(context),
    ...createOverrideContext(context),
    ...createFeatureFactoryAsyncContext(),
    ...createFeatureFactoryRegistryContext(context),
    ...createFeatureMergeContext(context),
    ...createFeatureFactoryDependencyContext(context),
  };
}
