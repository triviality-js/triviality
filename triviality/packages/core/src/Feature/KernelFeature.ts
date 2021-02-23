import type {FF} from "../Value";
import type {CompileContext} from "../Context";
import {RegisterLike} from "../Context/RegistryContext";
import {GlobalInvokeStack} from "../GlobalInvokeStack";
import {FeatureFactoryContext} from "../Context";
import type {CompilerPass} from "../Value/CompilerPass";

export interface KernelFeatureServices {
  compilerPass: RegisterLike<CompilerPass>;
}

export const KernelFeature: FF<KernelFeatureServices> = function setupFeature({synchronize, compose}) {
  return {
    compilerPass: () => ({
      register: (pass: CompilerPass) => {
        GlobalInvokeStack.addCompilerPass(pass);
      }
    }),
  };
};
