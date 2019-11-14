import { FeatureFactoryContext } from './FeatureFactoryContext';

const invokeContextStack: Array<FeatureFactoryContext<any>> = [];
export const getCurrentContext = <T, TPrivate = unknown>(): FeatureFactoryContext<T> & TPrivate => {
  const context = invokeContextStack[invokeContextStack.length - 1];
  if (!context) {
    throw new Error('Can only be called withing withGlobalContext');
  }
  return context as any;
};

export const inCurrentContext = (): boolean => invokeContextStack.length !== 0;

export const withGlobalContext = (context: FeatureFactoryContext<any>, callback: () => void): void => {
  invokeContextStack.push(context);
  try {
    callback();
  } finally {
    invokeContextStack.splice(invokeContextStack.indexOf(context), 1);
  }
};
