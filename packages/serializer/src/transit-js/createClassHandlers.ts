import { getSerializerMetadata, SerializeMetadata } from '../Serializeable';
import { ClassConstructor } from '../ClassConstructor';
import { SerializeHandler } from './SerializeHandler';

function getReadFunction<T>(metadata: SerializeMetadata<T>, classConstructor: ClassConstructor<T>) {
  const deNormalize = metadata.deNormalize;
  if (deNormalize) {
    return (data: any) => {
      return (classConstructor as any)[deNormalize as any](data);
    };
  }
  return (plainProperties: { [key: string]: any }): T => {
    const instance: any = new classConstructor();
    const ownPropertyNames = Object.getOwnPropertyNames(plainProperties);
    ownPropertyNames.forEach(key => {
      instance[key] = plainProperties[key];
    });
    return instance;
  };
}

function getWriteFunction<T>(metadata: SerializeMetadata<T>) {
  const normalize = metadata.normalize;
  if (normalize) {
    return (data: any) => {
      return data[normalize](data);
    };
  }
  return (object: T): { [key: string]: any } => {
    const ownPropertyNames = Object.getOwnPropertyNames(object);
    const plainProperties: { [key: string]: any } = {};
    ownPropertyNames.forEach(key => {
      plainProperties[key] = (object as any)[key];
    });
    return plainProperties;
  };
}

export function createClassHandlers(classes: { [key: string]: ClassConstructor<any> }): SerializeHandler[] {
  return Object.getOwnPropertyNames(classes).map(tag => {
    const classConstructor = classes[tag];
    const metadata = getSerializerMetadata(classConstructor);
    return {
      tag,
      class: classConstructor,
      write: getWriteFunction(metadata),
      read: getReadFunction(metadata, classConstructor),
    };
  });
}
