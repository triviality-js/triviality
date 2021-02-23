import {CompileContext, FeatureFactoryContext} from "../Context";

export type CompilerPass = <S>(context: CompileContext<S>, featureContext: FeatureFactoryContext<S>) => Promise<void> | void;
