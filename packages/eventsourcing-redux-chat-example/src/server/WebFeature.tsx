import { FF, SetupFeatureServices } from '@triviality/core';
import { SerializerInterface } from '@triviality/serializer';
import { IndexController } from './Controller/IndexController';
import { Express } from 'express';

export interface WebFeatureServices {
  indexController: IndexController;
}

export interface WebFeatureDependencies extends SetupFeatureServices {
  serializer: SerializerInterface;
  expressApp: Express;
}

export const WebFeature: FF<WebFeatureServices, WebFeatureDependencies> = ({ expressApp, dependencies, registers: { setupCallbacks } }) => {

  return {
    ...setupCallbacks(() => () => {
      const app = expressApp();
      const { indexController } = dependencies();
      app.get('*', indexController.action.bind(indexController));
    }),

    indexController() {
      return new IndexController();
    },
  };
};
