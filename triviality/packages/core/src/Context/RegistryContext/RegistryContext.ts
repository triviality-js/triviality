import {CompileContext} from "../CompileContext";
import {ContainerError} from "../../Error";
import {InferListArgumentRegister, isRegisterListArguments, registerToList} from "./RegistryListContext";
import {InferMapArgumentsRegister, isRegisterMapArguments, registerToMap} from "./RegistryMapContext";

export interface RegistryContext<T> {
  register: <K extends keyof T>(name: K, ...args: (InferMapArgumentsRegister<T, T[K]> | InferListArgumentRegister<T, T[K]>)[]) => { };
}

export const registersTo = <T>(context: CompileContext<T>) => <K extends keyof T>(name: K, ...args: (InferMapArgumentsRegister<T, T[K]> | InferListArgumentRegister<T, T[K]>)[]): { } => {
  if (args.length === 0) {
    return {};
  }
  const register = context.getServiceFactory(name);
  if (isRegisterListArguments(args)) {
    return registerToList(context, register, args);
  }
  if (isRegisterMapArguments(args)) {
    return registerToMap(context as CompileContext<unknown>, register, args);
  }
  throw new ContainerError('Wrong register arguments');
};

export const createFeatureFactoryRegistryContext = <T>(context: CompileContext<T>): RegistryContext<T> => {
  return ({
    register: registersTo(context),
  });
};
