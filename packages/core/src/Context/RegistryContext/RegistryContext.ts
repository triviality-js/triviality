import { keys } from 'lodash/fp';
import { ServiceFactory } from '../../ServiceFactory';
import { BaseFactoryContext } from '../BaseFactoryContext';
import { OverrideContext } from '../OverrideContext';
import { GetService, ServicesContext } from '../ServicesContext';
import {
  InferListArgumentRegisters,
  isRegisterListArguments,
  registerToList,
} from './RegistryListContext';
import { InferMapArgumentsRegisters, registerToMap } from './RegistryMapContext';

export type InferRegisters<T> = InferListArgumentRegisters<T> & InferMapArgumentsRegisters<T>;

export interface RegistryContext<T> {
  registers: InferRegisters<T>;
}

export type RegistryFeatureContext<TDependencies> =
  BaseFactoryContext<TDependencies, TDependencies> &
  ServicesContext<TDependencies> &
  OverrideContext<TDependencies>;

export const registersTo = <TDependencies, TRegister>(getService: GetService<TDependencies>, parent: ServiceFactory<TRegister>, ...args: any): TRegister => {
  if (args.length === 0) {
    return parent();
  }
  if (isRegisterListArguments(args)) {
    return registerToList(getService, parent, ...args);
  }
  return registerToMap(getService, parent, ...args);
};

export const createFeatureFactoryRegistryContext = <TDependencies>(context: RegistryFeatureContext<TDependencies>): RegistryContext<TDependencies> => {
  return ({
    get registers() {
      const registers = {};
      for (const key of keys(context.dependencies())) {
        Object.defineProperty(registers, key, {
          get: ((...registerServiceFactories: any[]) => {
            return {
              [key]: () => {
                return registersTo(context.service, key as any, ...registerServiceFactories);
              },
            }
          }) as any,
        });
      }
      return registers as any;
    },
  });
};
