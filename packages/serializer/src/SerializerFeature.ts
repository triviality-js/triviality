import { Feature } from '@triviality/core';
import { SerializerInterface } from './SerializerInterface';

export interface SerializerFeature extends Feature {

  serializer(): SerializerInterface;

}
