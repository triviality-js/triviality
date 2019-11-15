import { FF } from '@triviality/core';
import { LoggerFeatureServices } from '../../src';
import { HalloService } from './HalloService';

interface MyFeatureServices {
  halloService: HalloService;
}

export const MyFeature: FF<MyFeatureServices, LoggerFeatureServices> = ({ construct }) => ({
  halloService: construct(HalloService, 'logger'),
});
