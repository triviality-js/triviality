import {CompileContext} from "../CompileContext";
import {ContainerError} from "../../Error";
import {InferListArgumentRegister, isRegisterListArguments, registerToList} from "./RegistryListContext";
import {InferMapArgumentsRegister, isRegisterMapArguments, registerToMap} from "./RegistryMapContext";
import {createOverrideContext, OverrideContext} from "../OverrideContext";

export interface RegistryContext<T> {
  register: <K extends keyof T>(name: K, ...args: (InferMapArgumentsRegister<T, T[K]> | InferListArgumentRegister<T, T[K]>)[]) => { };
}

export const registersTo = <T>(context: CompileContext<T>) => <K extends keyof T>(name: K, ...args: (InferMapArgumentsRegister<T, T[K]> | InferListArgumentRegister<T, T[K]>)[]): { } => {
  if (args.length === 0) {
    return {};
  }
  const override = createOverrideContext(context);
  const register = context.getServiceFactory(name);
  override.override(name, (register: any) => {
    if (isRegisterListArguments(args)) {
      return () => registerToList(context, register, args);
    } else if (isRegisterMapArguments(args)) {
      return () => registerToMap(context as CompileContext<unknown>, register, args);
    } else {
      throw new ContainerError('Wrong register arguments');
    }
  })
  return {};
};

export const createFeatureFactoryRegistryContext = <T>(context: CompileContext<T>): RegistryContext<T> => {
  return ({
    register: registersTo(context),
  });
};
