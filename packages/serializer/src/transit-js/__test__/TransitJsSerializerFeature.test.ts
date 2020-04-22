import triviality, { FF } from '@triviality/core';
import { Record } from 'immutable';
import { TransitJsSerializerFeature, TransitJsSerializerFeatureServices } from '../TransitJsSerializerFeature';

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

  const MyUserFeature: FF<unknown, TransitJsSerializerFeatureServices> = ({ registers: { serializableClasses, serializableRecords } }) => ({
    ...serializableClasses(['Address', () => Address]),
    ...serializableRecords(() => UserRecord),
  });

  const { serializer } = await triviality()
    .add(TransitJsSerializerFeature)
    .add(MyUserFeature)
    .build();

  const serialized = serializer.serialize(new UserRecord({ name: 'Eric', address: new Address('1234TR', 'Goes') }));

  expect(typeof serialized).toEqual('string');
  expect(serializer.deserialize(serialized)).toEqual(
    new UserRecord({ name: 'Eric', address: new Address('1234TR', 'Goes') }));
});
