import { SerializerFeatureServices } from '../SerializerFeatureServices';
import { FF } from '@triviality/core';
import { JSONSerializer } from './JSONSerializer';

export interface JSONSerializerFeatureServices extends SerializerFeatureServices {
}

export const JSONSerializerFeature: FF<JSONSerializerFeatureServices> = ({ construct }) => ({
  serializer: construct(JSONSerializer),
});
