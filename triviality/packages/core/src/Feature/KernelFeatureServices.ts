import {RegisterLike} from "../Context/RegistryContext";
import { FeatureGroupBuildInfo, CompilerPass } from "../Value";

export interface KernelFeatureServices {
  compilerPass: RegisterLike<CompilerPass>;
  compilerInfo: FeatureGroupBuildInfo;
}
