import { ContainerError, override, SF, triviality } from '../index';

interface SpeakServiceInterface {
  speak(name: string): string;
}

const GreetingsFeature = () => ({
  halloService(): SpeakServiceInterface {
    return {
      speak: (name: string): string => {
        return `Hallo ${name}`;
      },
    };
  },

  byeService(): SpeakServiceInterface {
    return {
      speak: (name: string): string => {
        return `Bye ${name}`;
      },
    };
  },

  halloAndByeService(): SpeakServiceInterface {
    return {
      speak: (name: string): string => {
        return `${this.halloService().speak(name)}, ${this.byeService().speak(name)}`;
      },
    };
  },
});

it('Override service', async () => {

  const MyHalloFeature = () => ({
    halloService: override(() => () => ({
      speak: (_name: string): string => {
        return '@'; // tumbleweed
      },
    })),
  });

  const container = await triviality()
    .add(GreetingsFeature)
    .add(MyHalloFeature)
    .build();

  expect(container.halloService().speak('John')).toEqual('@');
  expect(container.halloAndByeService().speak('John')).toEqual('@, Bye John');
});

it('Override service should be cached', async () => {

  const MyHalloFeature = () => ({
    halloService: override(() => () => ({
      speak: (_name: string): string => {
        return '@'; // tumbleweed
      },
    })),
  });

  const container = await triviality()
    .add(GreetingsFeature)
    .add(MyHalloFeature)
    .build();

  expect(container.halloService()).toBe(container.halloService());
});

it('Can decorate by function', async () => {

  const MyHalloFeature = () => ({
    halloService: override((original: () => SpeakServiceInterface) => () => ({
      speak: (name: string): string => {
        return `${original().speak(name)}!!!`;
      },
    })),
  });

  const container = await triviality()
    .add(GreetingsFeature)
    .add(MyHalloFeature)
    .build();

  expect(container.halloService().speak('John')).toEqual('Hallo John!!!');
  expect(container.halloAndByeService().speak('John')).toEqual('Hallo John!!!, Bye John');
});

const screamSpeakService = (service: SpeakServiceInterface): SpeakServiceInterface => ({
  speak: (name: string): string => `${service.speak(name)}!!!`,
});

const ScreamGreetingsFeature = () => ({
  halloService: override<SF<SpeakServiceInterface>>((halloService) => () => screamSpeakService(halloService())),
  byeService: override<SF<SpeakServiceInterface>>((byeService) => () => screamSpeakService(byeService())),
});

const HiHalloFeature = () => ({
  halloService: override((parent: SF<SpeakServiceInterface>) => () => ({
    speak: (name: string): string => {
      return parent().speak(name).replace('Hallo', 'Hi');
    },
  })),
});

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

it('Cannot add extra services with overrides', async () => {
  const MyHalloFeature = () => ({
    halloServiceDope: override(() => () => ({
      speak: (_name: string): string => {
        return '@'; // tumbleweed
      },
    })),
  });

  const container = await triviality()
    .add(MyHalloFeature);

  await expect(container.build()).rejects.toThrow(ContainerError.cannotOverrideNonExistingService('halloServiceDope'));
});
