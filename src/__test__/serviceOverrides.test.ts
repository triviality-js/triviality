import { Module } from '../Module';
import { ContainerFactory } from '../ContainerFactory';
import { Container } from '../Container';

describe('ContainerFactory', () => {

  interface SpeakServiceInterface {
    speak(name: string): string;
  }

  class GreetingsModule implements Module {

    public halloService(): SpeakServiceInterface {
      return {
        speak: (name: string): string => {
          return `Hallo ${name}`;
        },
      };
    }

    public byeService(): SpeakServiceInterface {
      return {
        speak: (name: string): string => {
          return `Bye ${name}`;
        },
      };
    }

    public halloAndByeService(): SpeakServiceInterface {
      return {
        speak: (name: string): string => {
          return `${this.halloService().speak(name)}, ${this.byeService().speak(name)}`;
        },
      };
    }

  }

  it('Override service', async () => {

    class MyHalloModule implements Module {
      public serviceOverrides() {
        return {
          halloService: () => {
            return this.ignoreService();
          },
        };
      }

      public ignoreService(): SpeakServiceInterface {
        return {
          speak: (_name: string): string => {
            return '@'; // tumbleweed
          },
        };
      }

    }

    const container = await ContainerFactory
      .create()
      .add(GreetingsModule)
      .add(MyHalloModule)
      .build();

    expect(container.halloService().speak('John')).toEqual('@');
    expect(container.halloAndByeService().speak('John')).toEqual('@, Bye John');
  });

  it('Can decorate by function', async () => {

    class MyHalloModule implements Module {
      public async serviceOverrides(c: Container<GreetingsModule>) {
        return {
          halloService: () => {
            return this.officialHalloService(c.halloService());
          },
        };
      }

      public officialHalloService(service: SpeakServiceInterface): SpeakServiceInterface {
        return {
          speak: (name: string): string => {
            return `${service.speak(name)}!!!`;
          },
        };
      }

    }

    const container = await ContainerFactory
      .create()
      .add(GreetingsModule)
      .add(MyHalloModule)
      .build();

    expect(container.halloService().speak('John')).toEqual('Hallo John!!!');
    expect(container.halloAndByeService().speak('John')).toEqual('Hallo John!!!, Bye John');
  });

  class ScreamGreetingsModule implements Module {
    public serviceOverrides(c: Container<GreetingsModule>) {
      return {
        halloService: () => {
          return this.screamSpeakService(c.halloService());
        },
        byeService: () => {
          return this.screamSpeakService(c.byeService());
        },
      };
    }

    public screamSpeakService(service: SpeakServiceInterface): SpeakServiceInterface {
      return {
        speak: (name: string): string => {
          return `${service.speak(name)}!!!`;
        },
      };
    }

  }

  class HiHalloModule implements Module {
    public serviceOverrides(c: Container<GreetingsModule>) {
      return {
        halloService: () => {
          return this.hiHalloService(c.halloService());
        },
      };
    }

    public hiHalloService(service: SpeakServiceInterface): SpeakServiceInterface {
      return {
        speak: (name: string): string => {
          return service.speak(name).replace('Hallo', 'Hi');
        },
      };
    }

  }

  it('Can be decorated multiple times', async () => {
    const container = await ContainerFactory
      .create()
      .add(GreetingsModule)
      .add(ScreamGreetingsModule)
      .add(HiHalloModule)
      .build();

    expect(container.halloService().speak('John')).toEqual('Hi John!!!');

    expect(container.halloAndByeService().speak('John')).toEqual('Hi John!!!, Bye John!!!');
  });

  it('Can be decorated in a different order', async () => {
    const container = await ContainerFactory
      .create()
      .add(GreetingsModule)
      .add(HiHalloModule)
      .add(ScreamGreetingsModule)
      .build();

    expect(container.halloService().speak('John')).toEqual('Hi John!!!');

    expect(container.halloAndByeService().speak('John')).toEqual('Hi John!!!, Bye John!!!');
  });

  it('Can alter multiple services', async () => {
    const container = await ContainerFactory
      .create()
      .add(GreetingsModule)
      .add(HiHalloModule)
      .add(ScreamGreetingsModule)
      .build();

    expect(container.byeService().speak('John')).toEqual('Bye John!!!');

    expect(container.halloAndByeService().speak('Jane')).toEqual('Hi Jane!!!, Bye Jane!!!');
  });

  it('Cannot add extra services', async () => {

    class MyHalloModule implements Module {
      public serviceOverrides() {
        return {
          halloServiceDope: () => {
            return this.dopeService();
          },
        };
      }

      public dopeService(): SpeakServiceInterface {
        return {
          speak: (_name: string): string => {
            return 'Dope';
          },
        };
      }

    }

    const container = await ContainerFactory
      .create()
      .add(GreetingsModule)
      .add(MyHalloModule as any);

    await expect(container.build()).rejects.toThrow('Cannot add extra service "halloServiceDope" with serviceOverrides');
  });

  it('Can override nothing', async () => {
    class UselessModule implements Module {
      public serviceOverrides() {
        return {

        };
      }
    }

    const container = await ContainerFactory
      .create()
      .add(GreetingsModule)
      .add(UselessModule)
      .build();

    expect(container.halloService().speak('John')).toEqual('Hallo John');
  });

  it('Cannot return container', async () => {
    class UselessModule implements Module {
      public serviceOverrides(c: Container<GreetingsModule>) {
        return c;
      }
    }

    const container = await ContainerFactory
      .create()
      .add(GreetingsModule)
      .add(UselessModule);

    await expect(container.build()).rejects.toThrow('serviceOverrides should return new object with services');
  });

  it('Can use service as from arguments', async () => {
    class MyHalloModule implements Module {
      public async serviceOverrides(c: Container<GreetingsModule>) {
        return {
          halloService: () => {
            return c.byeService();
          },
        };
      }
    }
    const container = await ContainerFactory
      .create()
      .add(GreetingsModule)
      .add(MyHalloModule)
      .build();

    expect(container.halloService().speak('Eric')).toEqual('Bye Eric');
  });
});
