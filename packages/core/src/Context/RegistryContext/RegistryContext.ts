import {InferListArgumentRegisters, registerList, RegisterListArgument} from './RegistryListContext';
import {InferMapArgumentsRegisters, RegisterMapArgument, registerToMap} from './RegistryMapContext';
import { fromPairs } from 'ramda';
import { ServiceTag } from '../../ServiceFactory';
import { ServiceFunctionReferenceContainerInterface } from '../../Container/ServiceFunctionReferenceContainerInterface';

export type InferRegisters<T> = InferListArgumentRegisters<T> & InferMapArgumentsRegisters<T>;

export interface RegistryContext<T> {
  registers: InferRegisters<T>;
}

export const registersTo = (container: ServiceFunctionReferenceContainerInterface, name: ServiceTag) => {
  return (...args: any) => {
    if (args.length === 0) {
      return {};
    }
    const first: RegisterMapArgument<unknown, unknown, unknown> | RegisterListArgument<unknown, unknown> = args[0];
    if (typeof first === 'function' || typeof first === 'string') {
      registerList(container, name, ...args);
      return {};
    }
    registerToMap(container, name, ...args);
    return {};
  };
};

export const createFeatureFactoryRegisterContext = (container: ServiceFunctionReferenceContainerInterface) =>
  fromPairs(container.references().taggedPairs().map(([name]) => [name, registersTo(container, name)]));

export const createFeatureFactoryRegistryContext = <T>(container: ServiceFunctionReferenceContainerInterface): RegistryContext<T> => ({
  registers: createFeatureFactoryRegisterContext(container) as any,
});
