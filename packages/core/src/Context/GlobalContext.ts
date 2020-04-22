// tslint:disable-next-line
import type { FeatureFactoryContext } from './FeatureFactoryContext';
import { ServiceFunctionReferenceContainerInterface } from '../Containerd/ServiceFunctionReferenceContainerInterface';
import { FF } from '../FeatureFactory';

/**
 * TODO: rename everything as invoke context.
 */
export interface InvokeContext {
  context: FeatureFactoryContext<any>;
  container: ServiceFunctionReferenceContainerInterface;
  featureFactory: FF<any, any>;
}

const invokeContextStack: InvokeContext[] = [];

function getCurrent() {
  const context = invokeContextStack[invokeContextStack.length - 1];
  if (!context) {
    throw new Error('Can only be called withing withGlobalContext');
  }
  return context;
}

export const getCurrentContext = <T>(): FeatureFactoryContext<T> => {
  return getCurrent().context;
};

export const getCurrentFeatureFactory = (): FF => {
  return getCurrent().featureFactory;
};

export const getCurrentContainer = (): ServiceFunctionReferenceContainerInterface => {
  return getCurrent().container;
};

export const inCurrentContext = (): boolean => invokeContextStack.length !== 0;

export const withGlobalContext = (context: InvokeContext, callback: () => void): void => {
  invokeContextStack.push(context);
  try {
    callback();
  } finally {
    invokeContextStack.splice(invokeContextStack.indexOf(context), 1);
  }
};
