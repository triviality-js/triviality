import { RecordConstructor, TransitJSSerializer } from './TransitJSSerializer';
import { SerializeHandler } from './SerializeHandler';
import { ClassConstructor } from '../ClassConstructor';
import { createClassHandlers } from './createClassHandlers';
import { SerializerFeatureServices } from '../SerializerFeatureServices';
import { AllAsServiceFactory, FF, RegistryMap, RegistrySet } from '@triviality/core';

export interface TransitJsSerializerFeatureServices extends SerializerFeatureServices {
  serializableRecords: RegistrySet<RecordConstructor>;
  serializableClasses: RegistryMap<ClassConstructor<unknown>>;
  transitHandlers: RegistrySet<SerializeHandler>;
  classTransitHandlers: SerializeHandler[];
}

export const TransitJsSerializerFeature: FF<TransitJsSerializerFeatureServices> = ({ construct, registerSet, registerMap, instance }) => ({
  serializableRecords: registerSet(),
  serializableClasses: registerMap(),
  transitHandlers: () => registerSet<SerializeHandler>(...AllAsServiceFactory(instance('classTransitHandlers')))(),
  serializer: construct(TransitJSSerializer, 'serializableRecords', 'transitHandlers'),
  classTransitHandlers: () => createClassHandlers(instance('serializableClasses').toObject()),
});
