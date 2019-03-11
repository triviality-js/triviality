import {
  FeatureConstructor,
  FeatureConstructor as FC,
  FeatureOptionalRegistries as FO,
  FeatureRegistries as FR,
  FeatureServices as FS,
} from './Type/FeatureTypes';
import { BuildableContainer } from './Buildable/BuildableContainer';
import { FeatureDependencyCollection } from './Value/FeatureDependencyCollection';
import { ServiceContainer } from './Type/Container';
import { BuildContext } from './BuildStep/BuildStep';
import { BuildChain } from './BuildStep/BuildChain';

/**
 * Container factory.
 */
export class ContainerFactory<S /* Services */, R /* Registries */> {

  public static create(): ContainerFactory<{}, {}> {
    return new ContainerFactory<{}, {}>();
  }

  public constructor(
    private featureClasses: Array<FeatureConstructor<any, S, R>> = [],
    private buildChain = new BuildChain<S, R>()) {
  }

  /**
   * Only add feature as rest argument when there are circular dependencies between them.
   */
  public add<F1 extends FO<S, R>>(f1: FC<F1, S, R>): ContainerFactory<(S & FS<F1>), (R & FR<F1>)>;
  public add<F1 extends FO<S, R>, F2 extends FO<S, R>>(f1: FC<F1, S & FS<F2>, R & FR<F2>>, f2: FC<F2, S & FS<F1>, R & FR<F1>>): ContainerFactory<(S & FS<F1> & FS<F2>), (R & FR<F1> & FR<F2>)>;
  public add<F1 extends FO<S, R>, F2 extends FO<S, R>, F3 extends FO<S, R>>(f1: FC<F1, S & FS<F2> & FS<F3>, R & FR<F2> & FR<F3>>, f2: FC<F2, S & FS<F1> & FS<F3>, R & FR<F1> & FR<F3>>, f3: FC<F3, S & FS<F1> & FS<F2>, R & FR<F1> & FR<F2>>): ContainerFactory<(S & FS<F1> & FS<F2> & FS<F3>), (R & FR<F1> & FR<F2> & FR<F3>)>;
  public add<F1 extends FO<S, R>, F2 extends FO<S, R>, F3 extends FO<S, R>, F4 extends FO<S, R>>(f1: FC<F1, S & FS<F2> & FS<F3> & FS<F4>, R & FR<F2> & FR<F3> & FR<F4>>, f2: FC<F2, S & FS<F1> & FS<F3> & FS<F4>, R & FR<F1> & FR<F3> & FR<F4>>, f3: FC<F3, S & FS<F1> & FS<F2> & FS<F4>, R & FR<F1> & FR<F2> & FR<F4>>, f4: FC<F4, S & FS<F1> & FS<F2> & FS<F3>, R & FR<F1> & FR<F2> & FR<F3>>): ContainerFactory<(S & FS<F1> & FS<F2> & FS<F3> & FS<F4>), (R & FR<F1> & FR<F2> & FR<F3> & FR<F4>)>;
  public add<F1 extends FO<S, R>, F2 extends FO<S, R>, F3 extends FO<S, R>, F4 extends FO<S, R>, F5 extends FO<S, R>>(f1: FC<F1, S & FS<F2> & FS<F3> & FS<F4> & FS<F5>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5>>, f2: FC<F2, S & FS<F1> & FS<F3> & FS<F4> & FS<F5>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5>>, f3: FC<F3, S & FS<F1> & FS<F2> & FS<F4> & FS<F5>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5>>, f4: FC<F4, S & FS<F1> & FS<F2> & FS<F3> & FS<F5>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5>>, f5: FC<F5, S & FS<F1> & FS<F2> & FS<F3> & FS<F4>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4>>): ContainerFactory<(S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5>), (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5>)>;
  public add<F1 extends FO<S, R>, F2 extends FO<S, R>, F3 extends FO<S, R>, F4 extends FO<S, R>, F5 extends FO<S, R>, F6 extends FO<S, R>>(f1: FC<F1, S & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6>>, f2: FC<F2, S & FS<F1> & FS<F3> & FS<F4> & FS<F5> & FS<F6>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5> & FR<F6>>, f3: FC<F3, S & FS<F1> & FS<F2> & FS<F4> & FS<F5> & FS<F6>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5> & FR<F6>>, f4: FC<F4, S & FS<F1> & FS<F2> & FS<F3> & FS<F5> & FS<F6>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5> & FR<F6>>, f5: FC<F5, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F6>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F6>>, f6: FC<F6, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5>>): ContainerFactory<(S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6>), (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6>)>;
  public add<F1 extends FO<S, R>, F2 extends FO<S, R>, F3 extends FO<S, R>, F4 extends FO<S, R>, F5 extends FO<S, R>, F6 extends FO<S, R>, F7 extends FO<S, R>>(f1: FC<F1, S & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7>>, f2: FC<F2, S & FS<F1> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7>>, f3: FC<F3, S & FS<F1> & FS<F2> & FS<F4> & FS<F5> & FS<F6> & FS<F7>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5> & FR<F6> & FR<F7>>, f4: FC<F4, S & FS<F1> & FS<F2> & FS<F3> & FS<F5> & FS<F6> & FS<F7>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5> & FR<F6> & FR<F7>>, f5: FC<F5, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F6> & FS<F7>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F6> & FR<F7>>, f6: FC<F6, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F7>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F7>>, f7: FC<F7, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6>>): ContainerFactory<(S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7>), (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7>)>;
  public add<F1 extends FO<S, R>, F2 extends FO<S, R>, F3 extends FO<S, R>, F4 extends FO<S, R>, F5 extends FO<S, R>, F6 extends FO<S, R>, F7 extends FO<S, R>, F8 extends FO<S, R>>(f1: FC<F1, S & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8>>, f2: FC<F2, S & FS<F1> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8>>, f3: FC<F3, S & FS<F1> & FS<F2> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8>>, f4: FC<F4, S & FS<F1> & FS<F2> & FS<F3> & FS<F5> & FS<F6> & FS<F7> & FS<F8>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5> & FR<F6> & FR<F7> & FR<F8>>, f5: FC<F5, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F6> & FS<F7> & FS<F8>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F6> & FR<F7> & FR<F8>>, f6: FC<F6, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F7> & FS<F8>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F7> & FR<F8>>, f7: FC<F7, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F8>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F8>>, f8: FC<F8, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7>>): ContainerFactory<(S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8>), (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8>)>;
  public add<F1 extends FO<S, R>, F2 extends FO<S, R>, F3 extends FO<S, R>, F4 extends FO<S, R>, F5 extends FO<S, R>, F6 extends FO<S, R>, F7 extends FO<S, R>, F8 extends FO<S, R>, F9 extends FO<S, R>>(f1: FC<F1, S & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>, f2: FC<F2, S & FS<F1> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>, f3: FC<F3, S & FS<F1> & FS<F2> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>, f4: FC<F4, S & FS<F1> & FS<F2> & FS<F3> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>, f5: FC<F5, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>, f6: FC<F6, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F7> & FR<F8> & FR<F9>>, f7: FC<F7, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F8> & FR<F9>>, f8: FC<F8, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F9>>, f9: FC<F9, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8>>): ContainerFactory<(S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>), (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>)>;
  public add<F1 extends FO<S, R>, F2 extends FO<S, R>, F3 extends FO<S, R>, F4 extends FO<S, R>, F5 extends FO<S, R>, F6 extends FO<S, R>, F7 extends FO<S, R>, F8 extends FO<S, R>, F9 extends FO<S, R>, F10 extends FO<S, R>>(f1: FC<F1, S & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f2: FC<F2, S & FS<F1> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f3: FC<F3, S & FS<F1> & FS<F2> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f4: FC<F4, S & FS<F1> & FS<F2> & FS<F3> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f5: FC<F5, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f6: FC<F6, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f7: FC<F7, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F8> & FR<F9> & FR<F10>>, f8: FC<F8, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F9> & FR<F10>>, f9: FC<F9, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F10>>, f10: FC<F10, S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>): ContainerFactory<(S & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>), (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>)>;
  public add(...featureClasses: Array<FeatureConstructor<any, S, R>>): ContainerFactory<any, any> {
    return new ContainerFactory([...this.featureClasses, ...featureClasses], this.buildChain);
  }

  public async build(): Promise<ServiceContainer<S, R>> {
    const context = this.createBuildContext();
    const { buildChain, container } = context;
    for (const step of buildChain.getStepsInOrder()) {
      await step.build(context);
    }
    return container.getReference();
  }

  /**
   * Only used between Buildable feature and maybe for debuggable purposes.
   */
  public createBuildContext(): BuildContext<S, R> {
    // tslint:disable-next-line
    const { featureClasses, buildChain } = this;
    const features = new FeatureDependencyCollection();
    const container = new BuildableContainer<S, R>();
    return {
      features,
      container,
      featureClasses,
      buildChain,
    };
  }
}
