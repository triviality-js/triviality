import 'jest';
import { AnyAction } from 'redux';
import { StoreRepository } from '../StoreRepository';
import { StateReadModel } from '../../Model/StateReadModel';
import { StoreFactory } from '../../../Redux/Store/StoreFactory';
import { StoreReadModel } from '../../Model/StoreReadModel';
import { Repository } from '@triviality/eventsourcing/ReadModel/Repository';
import { ScalarIdentity } from '@triviality/eventsourcing/ValueObject/ScalarIdentity';

it('Should be able to save a model', async () => {
  const store: Repository<StateReadModel<string>> = {
    save: jest.fn(),
  } as any;
  const repository = new StoreRepository(store, null as any);

  const id = new ScalarIdentity(1);
  const storeReadModel: StoreReadModel<string> = {
    getId: () => id,
    getPlayhead: () => 2,
    getStore: jest.fn().mockReturnValue({
      getState: jest.fn().mockReturnValue('Some value'),
    }),
  } as any;
  await repository.save(storeReadModel);
  expect(store.save).toBeCalledWith(new StateReadModel(id, 'Some value', 2));
});

it('Should know it has a read model', async () => {
  const factory: StoreFactory<string, AnyAction> = {
    create: jest.fn(),
    createFromState: jest.fn(),
  };
  const store: Repository<StateReadModel<string>> = {
    has: jest.fn((value: ScalarIdentity<number>) => {
      return value.getValue() === 1;
    }),
  } as any;
  const repository = new StoreRepository(store, factory as any);
  const id = new ScalarIdentity(1);
  expect(await repository.has(id)).toBeTruthy();
  expect(await repository.has(new ScalarIdentity(2))).toBeFalsy();
});

it('Should know how to get a read model', async () => {
  const dummyStore = {};
  const factory: StoreFactory<string, AnyAction> = {
    create: jest.fn(),
    createFromState: jest.fn().mockReturnValue(dummyStore),
  };
  const id = new ScalarIdentity(1);
  const store: Repository<StateReadModel<string>> = {
    get: jest.fn().mockReturnValue(new StateReadModel(id, 'Some value', 2)),
  } as any;
  const repository = new StoreRepository(store, factory as any);
  expect(await repository.get(id)).toEqual(new StoreReadModel(id, dummyStore as any, 2));
  expect(factory.createFromState).toBeCalledWith('Some value');
});

it('Should be able to find a read model', async () => {
  const dummyStore = {};
  const factory: StoreFactory<string> = {
    create: jest.fn(),
    createFromState: jest.fn().mockReturnValue(dummyStore),
  } as any;
  const id = new ScalarIdentity(1);
  const store: Repository<StateReadModel<string>> = {
    find: jest.fn().mockReturnValue(new StateReadModel(id, 'Some value', 2)),
  } as any;
  const repository = new StoreRepository(store, factory as any);
  expect(await repository.find(id)).toEqual(new StoreReadModel(id, dummyStore as any, 2));
  expect(factory.createFromState).toBeCalledWith('Some value');
});

it('Should be able to find a read model that does not exists', async () => {
  const id = new ScalarIdentity(1);
  const store: Repository<StateReadModel<string>> = {
    find: jest.fn().mockReturnValue(null),
  } as any;
  const repository = new StoreRepository(store, null as any);
  expect(await repository.find(id)).toEqual(null);
});

it('Should be able to remove a readmodel', async () => {
  const id = new ScalarIdentity(1);
  const store: Repository<StateReadModel<string>> = {
    remove: jest.fn(),
  } as any;
  const repository = new StoreRepository(store, null as any);
  await repository.remove(id);
  expect(store.remove).toBeCalled();
});

it('Should be able to create a new readmodel', async () => {
  const dummyStore = {};
  const factory: StoreFactory<string> = {
    create: jest.fn().mockReturnValue(dummyStore),
  } as any;
  const store: Repository<StateReadModel<string>> = {
    has: jest.fn((value: ScalarIdentity<number>) => {
      return value.getValue() === 1;
    }),
  } as any;
  const repository = new StoreRepository(store, factory as any);
  const id = new ScalarIdentity(1);
  expect(await repository.create(id)).toEqual(new StoreReadModel(id, dummyStore as any, 0));
});
