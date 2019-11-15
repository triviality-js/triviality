import { FF, triviality } from '../index';

interface SpeakServiceInterface {
  speak(name: string): string;
}

interface GreetingsFeatureServices {
  halloService: SpeakServiceInterface;

  byeService: SpeakServiceInterface;

  halloAndByeService: SpeakServiceInterface;
}

const GreetingsFeature: FF<GreetingsFeatureServices> = () => ({
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

  const MyHalloFeature: FF<void, GreetingsFeatureServices> = ({ override: { halloService } }) => {
    halloService(() => ({
      speak: (_name: string): string => {
        return '@'; // tumbleweed
      },
    }));
  };

  const container = await triviality()
    .add(GreetingsFeature)
    .add(MyHalloFeature)
    .build();

  expect(container.halloService.speak('John')).toEqual('@');
  expect(container.halloAndByeService.speak('John')).toEqual('@, Bye John');
});

const screamSpeakService = (service: SpeakServiceInterface): SpeakServiceInterface => ({
  speak: (name: string): string => `${service.speak(name)}!!!`,
});

const ScreamGreetingsFeature: FF<void, GreetingsFeatureServices> = ({ override }) => {
  override.halloService(screamSpeakService);
  override.byeService(screamSpeakService);
};

const HiHalloFeature: FF<void, GreetingsFeatureServices> = ({ override: { halloService } }) =>
  halloService((original) => ({
    speak: (name: string): string => original.speak(name).replace('Hallo', 'Hi'),
  }));

it('Can be decorated multiple times', async () => {
  const container = await triviality()
    .add(GreetingsFeature)
    .add(ScreamGreetingsFeature)
    .add(HiHalloFeature)
    .build();

  expect(container.halloService.speak('John')).toEqual('Hi John!!!');

  expect(container.halloAndByeService.speak('John')).toEqual('Hi John!!!, Bye John!!!');
});

it('Can be decorated in a different order', async () => {
  const container = await triviality()
    .add(GreetingsFeature)
    .add(HiHalloFeature)
    .add(ScreamGreetingsFeature)
    .build();

  expect(container.halloService.speak('John')).toEqual('Hi John!!!');

  expect(container.halloAndByeService.speak('John')).toEqual('Hi John!!!, Bye John!!!');
});

it('Can alter multiple services', async () => {
  const container = await triviality()
    .add(GreetingsFeature)
    .add(HiHalloFeature)
    .add(ScreamGreetingsFeature)
    .build();

  expect(container.byeService.speak('John')).toEqual('Bye John!!!');

  expect(container.halloAndByeService.speak('Jane')).toEqual('Hi Jane!!!, Bye Jane!!!');
});

it('Cannot add extra services with overrides', async () => {
  const MyHalloFeature: FF = ({ override }: any) => override('foobar', () => void 0);

  const container = await triviality()
    .add(MyHalloFeature);

  await expect(container.build()).rejects.toThrow();
})
;
