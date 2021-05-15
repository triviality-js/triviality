import type {CompilerPass, FF} from "../Value";
import type {CompileContext} from "../Context";
import {RegisterLike} from "../Context/RegistryContext";
import {GlobalInvokeStack} from "../GlobalInvokeStack";
import {FeatureFactoryContext} from "../Context";
import {FeatureGroupBuildInfo} from "../Value";
import {KernelFeatureServices} from "./KernelFeatureServices";

export const KernelFeature: FF<KernelFeatureServices> = function kernelFeature({synchronize, compose}) {
  return {
    compilerPass: () => ({
      register: (pass: CompilerPass) => {
        GlobalInvokeStack.addCompilerPass(pass);
      }
    }),
    compilerInfo: () => GlobalInvokeStack.getRoot()
  };
};
