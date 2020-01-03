/* tslint:disable */
import type { TaggedServiceFactoryReference } from './TaggedServiceFactoryReference';
import type { MergedServiceFunctionReference } from './MergedServiceFunctionReference';
import type { InternalServiceFactoryReference } from './InternalServiceFactoryReference';
import { MergedTaggedServiceFunctionReference } from './MergedTaggedServiceFunctionReference';

export type ServiceFactoryReference =
  | TaggedServiceFactoryReference
  | MergedServiceFunctionReference
  | InternalServiceFactoryReference
  | MergedTaggedServiceFunctionReference;
