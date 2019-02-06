/**
 * @file
 *
 * Moved Feature types to this file instead of Feature.ts, so users won't be distracted of complex types they don't need to use.
 */

import { Empty, NoDuplicates, Omit, PromiseType } from '../util/Types';
import { Feature } from './Feature';
import { HasRegistries, RegistriesMap } from './Registry';
import { ServiceContainer } from './Container';

export const FeatureExcludes: Array<keyof Feature> = ['container' as any, 'registries', 'setup', 'serviceOverrides', 'beforeBuildStep' as any, 'afterBuildStep' as any];

/**
 * Define type with all registries as optional and allow new registries to be defined.
 */
export type FeatureOptionalRegistries<Services, Registries> = Feature<Services, Registries & RegistriesMap>;

/**
 * Feature constructor with type guard it can never return a duplicate service of the container.
 */
export type FeatureConstructor<T, Services, Registries> = new (container: ServiceContainer<Services, Registries>) => T & NoDuplicates<Services>;

/**
 * Only return the feature service types.
 */
export type FeatureServices<T extends Feature> = T extends { container: any } ? Omit<T, 'container' | 'registries' | 'setup' | 'serviceOverrides'> : Omit<T, 'registries' | 'setup' | 'serviceOverrides'>;

/**
 * Return type of feature registries.
 */
export type FeatureRegistries<T extends Feature> = T extends HasRegistries<{}> ? PromiseType<ReturnType<NonNullable<T['registries']>>> : Empty;

/**
 * Feature can be null. {@see FeatureServices}
 */
export type OptionalFeatureServices<T extends (null | Feature)> = T extends null ? Empty : FeatureServices<NonNullable<T>>;

/**
 * Feature can be null. {@see FeatureRegistries}
 */
export type OptionalFeatureRegistries<T extends (null | Feature)> = T extends null ? Empty : FeatureRegistries<NonNullable<T>>;
