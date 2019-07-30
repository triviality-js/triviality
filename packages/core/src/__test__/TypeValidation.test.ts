import { compileTs, declarationOfTs } from './util/compileTs';

describe.skip('TypeValidation',  () => {

  describe('triviality', () => {

    it('Container should not have dependencies by default', async () => {
      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';

        triviality()
          .build()
          .then((container) => {
            container.someNonExistingService();
          });
      `))
        .rejects
        .toMatch("Property 'someNonExistingService' does not exist on type");
    });

    it('Should force the requirements of a Feature', async () => {
      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';
        import { Feature } from '../Type/Feature';
        import { Container } from '../Type/Container';

        class Feature1 implements Feature {
          public userService() {
            return 'John';
          }
        }

        class Feature2 implements Feature {
          public constructor(private container: Container<Feature1>) {

          }

          public halloService() {
            const userService = this.container.userService();
            return { speak: () => 'Hallo ' + userService }
          }
        }

        export const container = triviality()
          .add(Feature2)
          .build();
      `))
        .rejects
        .toMatch("Property 'userService' is missing in type");
    });

    it('The build container should have the correct service declarations', async () => {
      // language=TypeScript
      return expect(declarationOfTs(__dirname, `
        import { triviality } from '../index';
        import { Feature } from '../Type/Feature';

        class Feature1 implements Feature {
          public halloService() {
            return { hallo: () => 'hallo' };
          }
        }

        export const container = triviality()
          .add(Feature1);
      `))
        .resolves
        .toMatchSnapshot();
    });

    it('A feature cannot have the same service name', async () => {
      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';
        import { Feature } from '../Type/Feature';

        class Feature1 implements Feature {
          public halloService() {
          }
        }

        class Feature2 implements Feature {
          public halloService() {
          }
        }

        triviality()
          .add(Feature1)
          .add(Feature2);
      `))
        .rejects
        .toMatch(/Types of property 'halloService' are incompatible./);
    });

    it('Register types should always match', async () => {

      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';
        import { Feature } from '../Type/Feature';

        class Feature1 implements Feature {
          public registries() {
            return {
              // Template every listener should match to.
              someRegister: (): number[] => {
                return [];
              },
            };
          }
        }

        class Feature2 implements Feature {
          public registries() {
            return {
              // Template every listener should match to.
              someRegister: (): string[] => {
                return [];
              },
            };
          }
        }

        triviality()
          .add(Feature1)
          .add(Feature2)
          .build();
      `))
        .rejects
        .toMatch(/Types of property 'someRegister' are incompatible./);
    });

    it('Cannot add extra services with serviceOverrides defined with an OptionalContainer type', async () => {
      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';
        import { Feature } from '../Type/Feature';
        import { OptionalContainer } from '../Type/Container';

        class MyFeature implements Feature {
          public serviceOverrides(): OptionalContainer<{}> {
            return {
              someExtraService: () => {
                return {};
              },
            };
          }

        }

        triviality()
          .add(MyFeature)
          .build();
      `))
        .rejects
        .toMatch('Object literal may only specify known properties, and \'someExtraService\' does not exist in type ');
    });

    it.skip('Cannot add extra services with serviceOverrides', async () => {
      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';
        import { Feature } from '../Type/Feature';

        class MyFeature implements Feature {
          public serviceOverrides() {
            return {
              someExtraService: () => {
                return {};
              },
            };
          }

        }

        triviality()
          .add(MyFeature)
          .build();
      `))
        .rejects
        .toMatch(/someExtraService./);
    });

    it('serviceOverrides should match service type', async () => {
      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';
        import { Feature } from '../Type/Feature';

        class MyHalloFeature implements Feature {
          public halloService() {
            return { hallo: () => 'hallo', };
          }
        }


        class MyOverrideFeature implements Feature {
          public serviceOverrides() {
            return {
              halloService: () => {
                return {};
              },
            };
          }

        }

        triviality()
          .add(MyHalloFeature)
          .add(MyOverrideFeature)
          .build();
      `))
        .rejects
        .toMatch('Property \'hallo\' is missing in type \'{}\' but required in type \'{ hallo: () => string; }\'.');
    });

  });
});
