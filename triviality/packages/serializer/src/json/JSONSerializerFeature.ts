import { SerializerFeatureServices } from '../SerializerFeatureServices';
import { FF } from '@triviality/core';
import { JSONSerializer } from './JSONSerializer';

export type JSONSerializerFeatureServices = SerializerFeatureServices

export const JSONSerializerFeature: FF<JSONSerializerFeatureServices> = ({ construct }) => ({
  serializer: construct(JSONSerializer),
});
