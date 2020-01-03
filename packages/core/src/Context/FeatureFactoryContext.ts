/* tslint:disable */

import type { ComposeContext } from './ComposeContext';
import type  { ConstructContext } from './ConstructContext';
import type  { OverrideContext } from './OverrideContext';
import type  { RegistryContext } from './RegistryContext';
import type  { ServicesContext } from './ServicesContext';
import type { ReferenceContext } from './ReferenceContext';
import type { MergeFeatureContext } from './MergeFeatureContext';

export interface FeatureFactoryContext<T> extends ReferenceContext,
  RegistryContext<T>,
  ComposeContext<T>,
  ServicesContext<T>,
  ConstructContext<T>,
  OverrideContext<T>,
  MergeFeatureContext<T> {
}
