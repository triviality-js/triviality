/* tslint:disable */
import type { TaggedServiceFactoryReference } from './TaggedServiceFactoryReference';
import type { MergedServiceFunctionReference } from './MergedServiceFunctionReference';
import type { InternalServiceFactoryReference } from './InternalServiceFactoryReference';
import { MergedTaggedServiceFunctionReference } from './MergedTaggedServiceFunctionReference';
import { AsyncServiceFunctionReference } from './AsyncServiceFunctionReference';

export type ServiceFactoryReference =
  | TaggedServiceFactoryReference
  | MergedServiceFunctionReference
  | InternalServiceFactoryReference
  | MergedTaggedServiceFunctionReference
  | AsyncServiceFunctionReference;
