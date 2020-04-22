/* tslint:disable */

import { ComposeContext } from './ComposeContext';
import { ConstructContext } from './ConstructContext';
import { OverrideContext } from './OverrideContext';
import { RegistryContext } from './RegistryContext';
import { ServicesContext } from './ServicesContext';
import { ReferenceContext } from './ReferenceContext';
import { MergeFeatureContext } from './MergeFeatureContext';
import { AsyncContext } from './AsyncContext';

export interface FeatureFactoryContext<T> extends ReferenceContext,
  RegistryContext<T>,
  ComposeContext<T>,
  ServicesContext<T>,
  ConstructContext<T>,
  OverrideContext<T>,
  MergeFeatureContext<T>,
  AsyncContext {
}
