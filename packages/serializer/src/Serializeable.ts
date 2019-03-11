import 'reflect-metadata';
import { ClassConstructor } from './ClassConstructor';
import { Metadata } from './Metadata';

const SERIALIZER = Symbol.for('serializer');

export interface SerializeMetadata<T> {
  normalize?: keyof T;
  deNormalize?: keyof ClassConstructor<T>;
}

export function getSerializerMetadata<T>(constructor: ClassConstructor<T>): SerializeMetadata<T> {
  const metadata: SerializeMetadata<T> = Metadata.getMetadata(SERIALIZER, constructor);
  if (metadata) {
    return metadata;
  }
  const parent = Object.getPrototypeOf(constructor.prototype).constructor;
  if (parent === Object) {
    return {};
  }
  return Object.assign({}, getSerializerMetadata(parent));
}

/**
 * Decorator function for object to normalize it.
 */
export function Normalize<T>(target: { constructor: ClassConstructor<T> } | any, functionName: keyof T): void {
  const constructor = target.constructor;
  const metadata: SerializeMetadata<T> = getSerializerMetadata(constructor);
  metadata.normalize = functionName;
  Metadata.defineMetadata(SERIALIZER, metadata, constructor);
}

/**
 * Decorator static function to de-normalize it.
 */
export function DeNormalize<T>(constructor: ClassConstructor<T>, functionName: string): void {
  const metadata: SerializeMetadata<T> = getSerializerMetadata(constructor);
  metadata.deNormalize = functionName as any;
  Metadata.defineMetadata(SERIALIZER, metadata, constructor);
}
