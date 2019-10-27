import { MutableContainer } from '../../container';
import {
  createFeatureFactoryRegistryListContext,
  FeatureFactoryRegistryListContext,
} from './FeatureFactoryRegistryListContext';
import {
  createFeatureFactoryRegistryMapContext,
  FeatureFactoryRegistryMapContext,
} from './FeatureFactoryRegistryMapContext';

import { ImmutableRegistryList } from './ImmutableRegistryList';
import { ImmutableRegistryMap } from './ImmutableRegistryMap';

export type RegistryLike<T> = ImmutableRegistryList<T> | ImmutableRegistryMap<T>;

export type InferRegistries<T> = {
  [K in keyof T]: T[K] extends RegistryLike<any> ? T[K] : never;
};

export interface FeatureFactoryRegistryContext<T> extends FeatureFactoryRegistryListContext<T>,
  FeatureFactoryRegistryMapContext<T> {
}

export const createFeatureFactoryRegistryContext = <T>(container: MutableContainer): FeatureFactoryRegistryContext<T> => ({
  ...createFeatureFactoryRegistryListContext(container),
  ...createFeatureFactoryRegistryMapContext(container),
});
