import { compileTs, declarationOfTs } from './util/compileTs';

describe('TypeValidation', async () => {

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
        .toMatch("error TS2339: Property 'someNonExistingService' does not exist on type 'HasRegistries<{}>");
    });

    it('Should force the requirements of a Module', async () => {
      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';
        import { Module } from '../Module';
        import { Container } from '../Container';

        class Module1 implements Module {
          public userService() {
            return 'John';
          }
        }

        class Module2 implements Module {
          public constructor(private container: Container<Module1>) {

          }

          public halloService() {
            const userService = this.container.userService();
            return { speak: () => 'Hallo ' + userService }
          }
        }

        export const container = triviality()
          .add(Module2)
          .build();
      `))
        .rejects
        .toMatch("Property 'userService' is missing in type");
    });

    it('The build container should have the correct service declarations', async () => {
      // language=TypeScript
      return expect(declarationOfTs(__dirname, `
        import { triviality } from '../index';
        import { Module } from '../Module';

        class Module1 implements Module {
          public halloService() {
            return { hallo: () => 'hallo' };
          }
        }

        export const container = triviality()
          .add(Module1);
      `))
        .resolves
        .toMatchSnapshot();
    });

    it('A module cannot have the same service name', async () => {
      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';
        import { Module } from '../Module';

        class Module1 implements Module {
          public halloService() {
          }
        }

        class Module2 implements Module {
          public halloService() {
          }
        }

        triviality()
          .add(Module1)
          .add(Module2);
      `))
        .rejects
        .toMatch(/Types of property 'halloService' are incompatible./);
    });

    it('Register types should always match', async () => {

      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';
        import { Module } from '../Module';

        class Module1 implements Module {
          public registries() {
            return {
              // Template every listener should match to.
              someRegister: (): number[] => {
                return [];
              },
            };
          }
        }

        class Module2 implements Module {
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
          .add(Module1)
          .add(Module2)
          .build();
      `))
        .rejects
        .toMatch(/Types of property 'someRegister' are incompatible./);
    });

    it.skip('Cannot add extra services with serviceOverrides', async () => {
      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';
        import { Module } from '../Module';

        class MyModule implements Module {
          public serviceOverrides() {
            return {
              someExtraService: () => {
                return {};
              },
            };
          }

        }

        triviality()
          .add(MyModule)
          .build();
      `))
        .rejects
        .toMatch(/someExtraService./);
    });

    it('serviceOverrides should match service type', async () => {
      // language=TypeScript
      return expect(compileTs(__dirname, `
        import { triviality } from '../index';
        import { Module } from '../Module';

        class MyHalloModule implements Module {
          public halloService() {
            return { hallo: () => 'hallo', };
          }
        }


        class MyOverrideModule implements Module {
          public serviceOverrides() {
            return {
              halloService: () => {
                return {};
              },
            };
          }

        }

        triviality()
          .add(MyHalloModule)
          .add(MyOverrideModule)
          .build();
      `))
        .rejects
        .toMatch('Property \'hallo\' is missing in type \'{}\' but required in type \'{ hallo: () => string; }\'.');
    });

  });
});
