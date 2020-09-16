import { FeatureFactory, FF } from '../FeatureFactory';
import { ServicesAsFactories } from '../ServiceFactory';
import { BaseFactoryContext } from './BaseFactoryContext';
import { ComposeContext } from './ComposeContext';
import { ConstructContext } from './ConstructContext';
import { createFeatureFactoryContext } from './createFeatureFactoryContext';
import { OverrideContext } from './OverrideContext';
import { RegistryContext } from './RegistryContext';
import { ServicesContext } from './ServicesContext';
import { MergeFeatureContext } from './MergeFeatureContext';
import { AsyncContext } from './AsyncContext';
import {ServiceFactoryReferenceContext} from "./ServiceFactoryReferenceContext";

export interface FeatureFactoryContext<TServices, TDependencies> extends
  ServiceFactoryReferenceContext,
  BaseFactoryContext<TServices, TDependencies>,
  RegistryContext<TDependencies>,
  ComposeContext<TDependencies>,
  ServicesContext<TDependencies>,
  ConstructContext<TDependencies>,
  OverrideContext<TDependencies>,
  MergeFeatureContext<TDependencies>,
  AsyncContext {
}

export type FeatureFactoryWithContext<TServices = {}, TDependencies = {}> = ((context: FeatureFactoryContext<TServices & TDependencies, TDependencies>) => ServicesAsFactories<TServices>);

const CurrentContexts: FeatureFactoryContext<any, any>[] = [];

export function useCurrentContext() {
  const context = CurrentContexts[CurrentContexts.length - 1];
  if (!context) {
    throw new Error('Can only be called within withContext');
  }
  return context;
}

export function withContext<TServices = {}, TDependencies = {}>(ff: FeatureFactoryWithContext<TServices, TDependencies>): FeatureFactory<TServices, TDependencies> {
  const context = createFeatureFactoryContext(ff);




  return (dependencies: TDependencies): TServices => {




  };
}
