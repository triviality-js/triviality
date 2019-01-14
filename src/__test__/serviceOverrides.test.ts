import { Feature } from '../Feature';
import { ContainerError, OptionalContainer, triviality } from '../index';
import { Container } from '../Container';

interface SpeakServiceInterface {
  speak(name: string): string;
}

class GreetingsFeature implements Feature {

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

  class MyHalloFeature implements Feature {
    public serviceOverrides(): OptionalContainer<GreetingsFeature> {
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

  const container = await triviality()
    .add(GreetingsFeature)
    .add(MyHalloFeature)
    .build();

  expect(container.halloService().speak('John')).toEqual('@');
  expect(container.halloAndByeService().speak('John')).toEqual('@, Bye John');
});

it('Can decorate by function', async () => {

  class MyHalloFeature implements Feature {
    public async serviceOverrides(c: Container<GreetingsFeature>): Promise<OptionalContainer<GreetingsFeature>> {
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

  const container = await triviality()
    .add(GreetingsFeature)
    .add(MyHalloFeature)
    .build();

  expect(container.halloService().speak('John')).toEqual('Hallo John!!!');
  expect(container.halloAndByeService().speak('John')).toEqual('Hallo John!!!, Bye John');
});

class ScreamGreetingsFeature implements Feature {
  public serviceOverrides(c: Container<GreetingsFeature>) {
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

class HiHalloFeature implements Feature {
  public serviceOverrides(c: Container<GreetingsFeature>) {
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
  const container = await triviality()
    .add(GreetingsFeature)
    .add(ScreamGreetingsFeature)
    .add(HiHalloFeature)
    .build();

  expect(container.halloService().speak('John')).toEqual('Hi John!!!');

  expect(container.halloAndByeService().speak('John')).toEqual('Hi John!!!, Bye John!!!');
});

it('Can be decorated in a different order', async () => {
  const container = await triviality()
    .add(GreetingsFeature)
    .add(HiHalloFeature)
    .add(ScreamGreetingsFeature)
    .build();

  expect(container.halloService().speak('John')).toEqual('Hi John!!!');

  expect(container.halloAndByeService().speak('John')).toEqual('Hi John!!!, Bye John!!!');
});

it('Can alter multiple services', async () => {
  const container = await triviality()
    .add(GreetingsFeature)
    .add(HiHalloFeature)
    .add(ScreamGreetingsFeature)
    .build();

  expect(container.byeService().speak('John')).toEqual('Bye John!!!');

  expect(container.halloAndByeService().speak('Jane')).toEqual('Hi Jane!!!, Bye Jane!!!');
});

it('Cannot add extra services', async () => {

  class MyHalloFeature implements Feature {
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

  const container = await triviality()
    .add(GreetingsFeature)
    .add(MyHalloFeature as any);

  await expect(container.build()).rejects.toThrow('Cannot add extra service "halloServiceDope" with serviceOverrides');
});

it('Can override nothing', async () => {
  class UselessFeature implements Feature {
    public serviceOverrides() {
      return {};
    }
  }

  const container = await triviality()
    .add(GreetingsFeature)
    .add(UselessFeature)
    .build();

  expect(container.halloService().speak('John')).toEqual('Hallo John');
});

it('Cannot return container', async () => {
  class UselessFeature implements Feature {
    public serviceOverrides(c: Container<GreetingsFeature>) {
      return c;
    }
  }

  const container = await triviality()
    .add(GreetingsFeature)
    .add(UselessFeature);

  await expect(container.build()).rejects.toThrow('serviceOverrides should return new object with services');
});

it('Can use service as from arguments', async () => {
  class MyHalloFeature implements Feature {
    public async serviceOverrides(c: Container<GreetingsFeature>) {
      return {
        halloService: () => {
          return c.byeService();
        },
      };
    }
  }

  const container = await triviality()
    .add(GreetingsFeature)
    .add(MyHalloFeature)
    .build();

  expect(container.halloService().speak('Eric')).toEqual('Bye Eric');
});

it('Can override properties', async () => {
  const container = await triviality()
    .add(class {
      public property: number = 1;
    })
    .add(class {
      public serviceOverrides() {
        return {
          property: 2,
        };
      }
    })
    .build();
  expect(container.property).toEqual(2);
});

it('Can not directly fetch registries from service overrides', async () => {
  class MyFeatures implements Feature {
    public property: number[] = [1];

    public registries() {
      return {
        testRegistry: () => [2],
      };
    }
  }
  const container = triviality()
    .add(MyFeatures)
    .add(class implements Feature {
      public serviceOverrides(c: Container<MyFeatures>): OptionalContainer<MyFeatures> {
        return {
          property: c.registries().testRegistry(),
        };
      }
    })
    .build();
  return expect(container).rejects.toEqual(ContainerError.containerIsLockedDuringBuild());
});

it('Can indirectly fetch registries from service overrides', async () => {
  class MyFeatures implements Feature {
    public property: () => number = () => 1;

    public registries() {
      return {
        testRegistry: () => [2],
      };
    }
  }
  const container = await triviality()
    .add(MyFeatures)
    .add(class implements Feature {
      public serviceOverrides(c: Container<MyFeatures>) {
        return {
          property: () => c.registries().testRegistry()[0],
        };
      }
    })
    .build();
  expect(container.property()).toEqual(2);
});
