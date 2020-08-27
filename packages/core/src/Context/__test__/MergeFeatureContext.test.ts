import triviality, {
  createFeatureFactoryContext,
  FF,
  ServiceFunctionReferenceContainer,
  SetupFeatureServices,
} from '../..';
import { invokeFeatureFactory } from '../../invokeFeatureFactory';

it('Can merge features', async () => {
  interface MyFeatureServices {
    foo: number;
    bar: string;
  }

  const container = new ServiceFunctionReferenceContainer();
  const context = createFeatureFactoryContext<{}, {}>({ container, invoke: invokeFeatureFactory });
  const myFeature: FF<MyFeatureServices> = () => ({
    bar: () => 'bar',
    foo: () => 1,
  });
  const services = context.merge(myFeature).services('bar', 'foo');
  await container.build();
  expect(services.foo()).toEqual(1);
  expect(services.bar()).toEqual('bar');
});

it('Merged services can use default services', async () => {
  const spy = jest.fn();
  const myFeature: FF<{}, SetupFeatureServices> = ({ registers: { setupCallbacks } }) => ({
    ...setupCallbacks(() => spy),
  });
  await triviality().add(({ merge }) => {
    merge(myFeature);
    return {};
  }).build();
  expect(spy).toBeCalled();
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

  const container = new ServiceFunctionReferenceContainer();
  const context = createFeatureFactoryContext<{}, {}>({ container, invoke: invokeFeatureFactory });
  const services = context
    .merge(userFeature)
    .with(buildingFeature)
    .services('users', 'buildings');
  await container.build();
  expect(services.users()).toEqual(3);
  expect(services.buildings()).toEqual(10);
});

it('Can merge multiple times', async () => {

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
      .services('buildings', 'users');
    const { buildings: buildings2, users: users2 } = withUserFeature
      .with(buildingFeature)
      .services('buildings', 'users');
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
  expect(u2).toEqual({ age: 40 });
});

it('Can merge multiple services', async () => {

  interface F1 {
    one: number;
  }

  const f1: FF<F1> = () => ({ one: () => 1 });

  interface F2 {
    two: number;
  }

  const f2: FF<F2> = () => ({ two: () => 2 });

  interface F3 {
    three: number;
  }

  const f3: FF<F3> = () => ({ three: () => 3 });

  interface MyFeature extends F1, F2, F3 {
  }

  const myFeature: FF<MyFeature, {}> = ({ merge }) => {
    return merge(f1).with(f2).with(f3).all();
  };

  const { one, two, three } = await triviality()
    .add(myFeature)
    .build();

  expect([one, two, three]).toEqual([1, 2, 3]);
});

it('Can override merged services', async () => {

  interface Orginal {
    one: number;
  }

  const orginalFeature: FF<Orginal> = () => ({ one: () => 1 });

  interface F2 {
    two: number;
  }

  const f2: FF<F2, Orginal> = ({ one: o }) => ({ two: () => o() + 2 });

  interface F3 {
    three: number;
  }

  const f3: FF<F3, Orginal> = ({ one: o }) => ({ three: () => o() + 3 });

  interface MyFeature extends Orginal, F2, F3 {
  }

  const myFeature: FF<MyFeature, {}> = ({ merge }) => {
    return merge(orginalFeature).with(f2).with(f3).all();
  };

  const myFeatureOverride: FF<{}, Orginal> = ({ override: { one: o } }) => {
    return {
      ...o(() => 10),
    };
  };

  const { one, two, three } = await triviality()
    .add(myFeature)
    .add(myFeatureOverride)
    .build();

  expect([one, two, three]).toEqual([10, 12, 13]);
});

it('Can directly fetch all new services', async () => {

  interface User {
    name: string;
  }

  interface UserServices {
    users: User[];
  }

  const userFeature: FF<UserServices> = () => ({
    users: () => [],
  });

  const johnUserFeature: FF<{}, UserServices> = ({ registers: { users } }) => ({
    ...users(() => ({ name: 'John' })),
  });

  const JaneUserFeature: FF<{}, UserServices> = ({ registers: { users } }) => ({
    ...users(() => ({ name: 'Jane' })),
  });

  interface MyFeatureServices {
    names: string[];
    users: User[];
  }

  const myFeature: FF<MyFeatureServices, {}> = ({ merge }) => {
    const { users } = merge(userFeature).with(johnUserFeature).with(JaneUserFeature).services('users');
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
