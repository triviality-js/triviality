import { createFeatureFactoryContext, createMutableContainer, FF } from '../..';
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
