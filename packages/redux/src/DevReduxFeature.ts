import { FF } from '@triviality/core';
// @ts-ignore
import { composeWithDevTools, EnhancerOptions } from 'redux-devtools-extension';
import { BaseReduxFeatureServices } from './BaseReduxFeature';

export interface DevReduxFeatureServices {
  devToolsOptions: EnhancerOptions;
}

export const DevReduxFeature: FF<DevReduxFeatureServices, BaseReduxFeatureServices<any, any>> = ({ override: { rootEnhancer }, enhancers, instance }) => ({
  devToolsOptions: () => ({}),
  ...rootEnhancer(() => composeWithDevTools(instance('devToolsOptions'))(...enhancers())),
});
