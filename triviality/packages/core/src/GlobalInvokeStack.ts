import {
  InvokeWindow,
  isFeatureFactoryInvokeWindow,
  isServiceFactoryInvokeWindow,
} from './Value';
import {CompilerPass} from "./Value/CompilerPass";

const invokeWindowStack: InvokeWindow[] = [];

const addCompilerPass = (compilerPass: CompilerPass) => {
  return getCurrentInvokeWindow().serviceContainer.addCompilerPass(compilerPass);
};

const currentInvokeWindow = () => {
  return invokeWindowStack[invokeWindowStack.length - 1] ?? null;
};

const getCurrentInvokeWindow = () => {
  const window = invokeWindowStack[invokeWindowStack.length - 1];
  if (!window) {
    throw new Error('Can only be called withing GlobalInvokeStack');
  }
  return window;
};

async function asyncInvokeWindow<T>(this: unknown, window: InvokeWindow<T>, callback: (window: InvokeWindow<T>) => Promise<void>): Promise<void> {
  invokeWindowStack.push(window as InvokeWindow);
  try {
    await callback.call(this, window);
  } finally {
    invokeWindowStack.splice(invokeWindowStack.indexOf(window as InvokeWindow), 1);
  }
}

function invokeWindow<T, R = void>(this: unknown, window: InvokeWindow<T>, callback: () => R): R {
  invokeWindowStack.push(window as InvokeWindow);
  try {
    return callback.call(this);
  } finally {
    invokeWindowStack.splice(invokeWindowStack.indexOf(window as InvokeWindow), 1);
  }
}

const printInvokeStack = () => {
  return invokeWindowStack.reverse().map((window, index) => {
    const serviceContainerName = `[${index + 1}]:SC<${window.serviceContainer.name}>`;
    if (!isFeatureFactoryInvokeWindow(window)) {
      return serviceContainerName;
    }
    const featureFactoryName = `FF<${window.featureFactory.featureFactoryFunction.name}>`;
    if (!isServiceFactoryInvokeWindow(window)) {
      return `${serviceContainerName}.${featureFactoryName}`
    }
    return `${serviceContainerName}.${featureFactoryName}.SF<${window.serviceFactory.serviceFactoryFunction.name}>`
  }).join('\n');
};

export const GlobalInvokeStack = {
  run: invokeWindow,
  runAsync: asyncInvokeWindow,
  printStack: printInvokeStack,
  getCurrent: getCurrentInvokeWindow,
  current: currentInvokeWindow,
  addCompilerPass,
  getStack: () => [...invokeWindowStack]
};
