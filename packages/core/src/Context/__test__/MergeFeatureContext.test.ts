import triviality, { createFeatureFactoryContext, createMutableContainer, FF, RegistrySet } from '../..';
import { invokeFeatureFactory } from '../../invokeFeatureFactory';

it('Can merge features', async () => {
  interface MyFeatureServices {
    foo: number;
    bar: string;
  }

  const context = createFeatureFactoryContext<{}, {}>(createMutableContainer(), invokeFeatureFactory);
  const myFeature: FF<MyFeatureServices> = () => ({
    bar: () => 'bar',
    foo: () => 1,
  });
  const services = context.merge(myFeature).services();
  expect(services.foo()).toEqual(1);
  expect(services.bar()).toEqual('bar');
});

it('Can merge multiple features', async () => {
  interface UserServices {
    users: number;
  }

  const userFeature: FF<UserServices> = () => ({
    users: () => 3,
  });

  interface BuildingServices {
    buildings: number;
  }

  const buildingFeature: FF<BuildingServices> = () => ({
    buildings: () => 10,
  });

  const context = createFeatureFactoryContext<{}, {}>(createMutableContainer(), invokeFeatureFactory);
  const services = context
    .merge(userFeature)
    .with(buildingFeature)
    .services();
  expect(services.users()).toEqual(3);
  expect(services.buildings()).toEqual(10);
});

it.skip('Can merge multiple times', async () => {

  interface User {
    age: number;
  }

  let a = 20;

  interface UserServices {
    users: User;
  }

  const userFeature: FF<UserServices> = () => ({
    users: () => {
      a *= 2;
      return { age: a };
    },
  });

  interface Building {
    size: number;
  }

  interface BuildingServices {
    buildings: Building;
  }

  let i = 0;
  const buildingFeature: FF<BuildingServices> = () => ({
    buildings: () => {
      i += 1;
      return ({ size: i });
    },
  });

  interface MyFeatureServices {
    buildings1: Building;
    buildings2: Building;
    users1: User;
    users2: User;
  }

  const myFeature: FF<MyFeatureServices> = ({ merge }) => {
    const withUserFeature = merge(userFeature);
    const { buildings: buildings1, users: users1 } = withUserFeature
      .with(buildingFeature)
      .services();
    const { buildings: buildings2, users: users2 } = withUserFeature
      .with(buildingFeature)
      .services();
    return {
      buildings1,
      buildings2,
      users1,
      users2,
    };
  };

  const { buildings1: b1, buildings2: b2, users1: u1, users2: u2 } = await triviality().add(myFeature).build();

  expect(b1).toEqual({ size: 1 });
  expect(b2).toEqual({ size: 2 });
  expect(u1).toEqual({ age: 40 });
  expect(u2).toEqual({ age: 80 });
});

it('Can merge with registers', async () => {

  interface User {
    name: string;
  }

  interface UserServices {
    users: RegistrySet<User>;
  }

  const userFeature: FF<UserServices> = ({ registerSet }) => ({
    users: registerSet(),
  });

  const johnUserFeature: FF<{}, UserServices> = ({ registers: { users } }) => ({
    ...users(() => ({ name: 'John' })),
  });

  const JaneUserFeature: FF<{}, UserServices> = ({ registers: { users } }) => ({
    ...users(() => ({ name: 'Jane' })),
  });

  interface MyFeatureServices {
    names: string[];
    users: RegistrySet<User>;
  }

  const myFeature: FF<MyFeatureServices, {}> = ({ merge }) => {
    const { users } = merge(userFeature).with(johnUserFeature).with(JaneUserFeature).services();
    return {
      users,
      names: () => users().map(({ name }) => name),
    };
  };

  const { names } = await triviality()
    .add(myFeature)
    .build();

  expect(names).toEqual(['John', 'Jane']);
});
