import triviality, { Feature, OptionalRegistries } from '@triviality/core';
import { Record } from 'immutable';
import { TransitJsSerializerFeature } from '../TransitJsSerializerFeature';

it('Can use TransitJsSerializerFeature', async () => {

  class Address {

    constructor(private _postalCode: string, private _city: string) {

    }

    get postalCode(): string {
      return this._postalCode;
    }

    get city(): string {
      return this._city;
    }
  }

  const UserRecord = Record<{ name: string, address: Address }>({ name: null!, address: null! }, 'UserRecord');

  class MyUserFeature implements Feature {
    public registries(): OptionalRegistries<TransitJsSerializerFeature> {
      return {
        serializableClasses: () => {
          return {
            Address,
          };
        },
        serializableRecords: () => {
          return [UserRecord];
        },
      };
    }
  }

  const container = await triviality()
    .add(TransitJsSerializerFeature)
    .add(MyUserFeature)
    .build();

  const serializer = container.serializer();
  const serialized = serializer.serialize(new UserRecord({ name: 'Eric', address: new Address('1234TR', 'Goes') }));

  expect(typeof serialized).toEqual('string');
  expect(serializer.deserialize(serialized)).toEqual(new UserRecord({ name: 'Eric', address: new Address('1234TR', 'Goes') }));
});
