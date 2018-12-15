import { compileTs } from './util/compileTs';

describe('TypeValidation', async () => {

  it('A module cannot have the same service name', async () => {
    // language=TypeScript
    return expect(compileTs(__dirname, `
      import { ContainerFactory } from '../ContainerFactory';
      import { Module } from '../Module';

      class Module1 implements Module {
        public halloService() {
        }
      }

      class Module2 implements Module {
        public halloService() {
        }
      }

      ContainerFactory
        .create()
        .add(Module1)
        .add(Module2);
    `))
      .rejects
      .toMatch(/Types of property 'halloService' are incompatible./);
  });

  it('registries function should be excluded from the container', async () => {
    // language=TypeScript
    return expect(compileTs(__dirname, `
      import { ContainerFactory } from '../ContainerFactory';
      import { Module } from '../Module';

      class Module1 implements Module {
        public registries() {
          return {
            personListeners: () => {
              return [];
            },
          };
        }
      }

      ContainerFactory
        .create()
        .add(Module1)
        .build().then(container => container.registries());
    `))
      .rejects
      .toMatch(/Property 'registries' does not exist on type./);
  });

  it('Register types should always match', async () => {

    // language=TypeScript
    return expect(compileTs(__dirname, `
      import { ContainerFactory } from '../ContainerFactory';
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

      ContainerFactory
        .create()
        .add(Module1)
        .add(Module2)
        .build();
    `))
      .rejects
      .toMatch(/Types of property 'someRegister' are incompatible./);
  });
});
