import {FF, triviality, getServiceInstances, SF, KernelFeatureServices, FeatureGroupBuildInfo} from "../../index";

interface Person {
  readonly name: string;
}

const cleanService = (cleaner: Person) => (item: string, room: string) => {
  return `${cleaner.name} has cleaned the ${item} in the ${room}`;
};

const kookingService = (kook: Person) => (recipe: string, food: string[]) => {
  const start = `${kook.name} has kooked ${recipe}`;
  if (food.length === 0) {
    return start;
  }
  if (food.length > 1) {
    return `${start} with ${food.slice(0, -1).join(', ')} and ${food[food.length - 1]}`;
  }
  return `${start} with ${food[0]}`;
};

interface HouseServices {
  cleanService: (item: string, room: string) => string;
  kookService: (recipe: string, food: string[]) => string;
}

interface HouseDependencies {
  cook: Person;
  cleaner: Person;
}

const MyHouse: FF<HouseServices, HouseDependencies> = ({ compose }) => {
  return {
    cleanService: compose(cleanService, 'cleaner'),
    kookService: compose(kookingService, 'cook'),
  };
};

const Personnel1: FF<HouseDependencies> = () => {
  return {
    cleaner: () => ({name: 'John'}),
    cook: () => ({name: 'Jane'}),
  };
};

const Personnel2: FF<HouseDependencies> = () => {
  return {
    cleaner: () => ({name: 'Eve'}),
    cook: () => ({name: 'Bob'}),
  };
};

const test = (house: HouseServices) => {
  expect(house.cleanService('carpet', 'living room')).toEqual('John has cleaned the carpet in the living room');
  expect(house.kookService('dame blanche', ['ice', 'chocolate', 'banana'])).toEqual('Jane has kooked dame blanche with ice, chocolate and banana');
};

describe('Can merge a single feature', () => {
  it('Width passed dependencies ', async () => {
    const MergedFeature: FF<HouseServices, HouseDependencies> = ({ merge }) => {
      return merge('cook', 'cleaner').with(MyHouse).create();
    };
    test(await triviality().add(Personnel1).add(MergedFeature).build());
  });
  it('Can name container ', async () => {
    const MergedFeature: FF<HouseServices, HouseDependencies> = ({ merge }) => {
      return merge('cook', 'cleaner').with(MyHouse).create({name: 'internal container'});
    };
    const services = await triviality().add(Personnel1).add(MergedFeature).build();
    test(services);
  });
  it('Width private services ', async () => {
    const MergedFeature: FF<HouseServices> = ({ merge }) => {
      return merge<HouseDependencies>(Personnel1).with(MyHouse).create();
    };
    test(await triviality().add(MergedFeature).build());
  });
  it('Can pick single service ', async () => {
    const MergedFeature: FF<Pick<HouseServices, 'cleanService'>> = ({ merge }) => {
      return merge<HouseDependencies>(Personnel1).with(MyHouse).create('cleanService');
    };
    const services = await triviality().add(MergedFeature).build();
    expect(services.cleanService('carpet', 'living room')).toEqual('John has cleaned the carpet in the living room');
    expect(services).not.toHaveProperty('kookService');
  });
});

it('Can merge multiple features', async () => {
  const MergedFeature: FF<{
    house1: HouseServices,
    house2: HouseServices,
    house3: HouseServices
  }, HouseDependencies> = ({ merge }) => {
    const merged = merge('cook', 'cleaner').with(MyHouse);
    return {
      house1: merged.createInstance(),
      house2: merge(Personnel2).with(MyHouse).createInstance(),
      house3: merged.createInstance(),
    };
  };
  const services = await triviality().add(Personnel1).add(MergedFeature).build();
  test(services.house1);

  expect(services.house2.cleanService('carpet', 'living room')).toEqual('Eve has cleaned the carpet in the living room');
  expect(services.house2.kookService('dame blanche', ['ice', 'chocolate', 'banana'])).toEqual('Bob has kooked dame blanche with ice, chocolate and banana');

  // Should be new instances
  expect(services.house3.cleanService).not.toBe(services.house1.cleanService);
});


it('Merge features can access KernelFeature', async () => {
  const MergedFeature: FF<{ info: FeatureGroupBuildInfo }, KernelFeatureServices> = ({ merge }) => {
    const hasCompilerPass: FF<{info: FeatureGroupBuildInfo}, KernelFeatureServices> = ({dependencies}) => {
      return {
        info: () => dependencies.compilerInfo(),
      };
    };
    // TODO: fix direct dependenies
    return {
      // // Direct dependency
      // info: merge(hasCompilerPass).create('info').info,
      // // First FF then with
      // info2: merge(() => ({})).with(hasCompilerPass).create('info').info,
      // // With dependency keys
      // info3: merge('info').with(hasCompilerPass).create('info').info,
      // // Duplicate dependencies
      ...merge('compilerInfo', 'compilerPass').with(hasCompilerPass).create('info'),
    };
  };
  const services = await triviality().add(Personnel1).add(MergedFeature).build();
  expect(services.info).toBe(services.compilerInfo);
  // expect(services.info2).toBe(services.compilerInfo);
  // expect(services.info3).toBe(services.compilerInfo);
  // expect(services.info4).toBe(services.compilerInfo);

  expect(services.info.name).toEqual('root');
  // expect(services.info2.name).toEqual('root');
  // expect(services.info3.name).toEqual('root');
  // expect(services.info4.name).toEqual('root');
});
