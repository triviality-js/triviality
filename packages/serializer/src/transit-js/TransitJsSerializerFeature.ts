import { Feature } from '@triviality/core';
import { SerializerInterface } from '../SerializerInterface';
import { RecordConstructor, TransitJSSerializer } from './TransitJSSerializer';
import { SerializeHandler } from './SerializeHandler';
import { ClassConstructor } from '../ClassConstructor';
import { createClassHandlers } from './createClassHandlers';

export class TransitJsSerializerFeature implements Feature {
  public registries() {
    return {
      serializableRecords: (): RecordConstructor[] => {
        return [];
      },
      serializableClasses: (): { [key: string]: ClassConstructor<any> } => {
        return {};
      },
      transitHandlers: (): SerializeHandler[] => {
        return [];
      },
    };
  }

  public serializer(): SerializerInterface {
    const registries = this.registries();
    return new TransitJSSerializer(
      registries.serializableRecords(),
      [
        ...createClassHandlers(registries.serializableClasses()),
        ...registries.transitHandlers(),
      ],
    );
  }

}
