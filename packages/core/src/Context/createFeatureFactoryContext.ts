import { FeatureFactory } from '../FeatureFactory';
import { createBaseFactoryContext } from './BaseFactoryContext';
import { createFeatureFactoryOverrideContext } from './OverrideContext';
import { createFeatureFactoryComposeContext } from './ComposeContext';
import { createFeatureFactoryServicesContext } from './ServicesContext';
import { createFeatureFactoryConstructContext } from './ConstructContext';
import { createFeatureFactoryRegistryContext } from './RegistryContext';
import { FeatureFactoryContext } from './FeatureFactoryContext';
import { includes } from 'lodash/fp';
import { createFeatureFactoryAsyncContext } from './AsyncContext';

export const createFeatureFactoryContext = <TServices, TDependencies>(ff: FeatureFactory<TServices, TDependencies>): {
  context: FeatureFactoryContext<TServices, TDependencies>;
  setInstances: (dependencies: TServices & TDependencies) => void;
} => {
  const { context, setInstances } = createBaseFactoryContext<TServices, TDependencies>(ff);
  const context2 = Object.assign(context, createFeatureFactoryServicesContext<TServices>(context.instances));
  const context3 = Object.assign(context2, createFeatureFactoryOverrideContext<TDependencies>(context2.dependencies));
  const context4 = Object.assign(context3, createFeatureFactoryComposeContext<TServices>(context3.service));
  const context5 = Object.assign(context4, createFeatureFactoryConstructContext<TServices>(context4.service));
  const context6 = Object.assign(context5, createFeatureFactoryRegistryContext<TDependencies>(context5 as any));
  const context7 = Object.assign(context6, createFeatureFactoryAsyncContext(context6));
  return { context: context8, setInstances };
};

export const hasContextTag = (tag: string) => includes(tag, []);
