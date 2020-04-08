import { testFeatureFactory } from '../../testing';

it('KernelFeature', async () => {
  // KernelFeature will automatically be added
  const { kernel } = await testFeatureFactory(() => ({}), {});

  expect(kernel.callStack()).toMatchInlineSnapshot(`
    ImmutableServiceReferenceList {
      "references": Array [],
    }
  `);
  expect(kernel.references()).toMatchInlineSnapshot(`
    ImmutableServiceReferenceList {
      "references": Array [
        TaggedServiceFactoryReference {
          "_configuration": Object {
            "proxy": [Function],
            "uuid": "1",
          },
          "dependencies": ImmutableServiceReferenceList {
            "references": Array [],
          },
          "factory": [Function],
          "feature": [Function],
          "overrides": Array [],
          "service": Object {
            "callStack": [Function],
            "references": [Function],
          },
          "serviceDefined": true,
          "serviceFactoryInvoked": true,
          "tag": "kernel",
          "type": "tagged",
        },
        InternalServiceFactoryReference {
          "_configuration": Object {
            "proxy": [Function],
            "uuid": "2",
          },
          "dependencies": ImmutableServiceReferenceList {
            "references": Array [],
          },
          "factory": [Function],
          "feature": [Function],
          "proxies": Array [
            TaggedServiceFactoryReference {
              "_configuration": Object {
                "proxy": [Function],
                "uuid": "3",
              },
              "dependencies": ImmutableServiceReferenceList {
                "references": Array [
                  [Circular],
                ],
              },
              "factory": [Function],
              "feature": [Function],
              "overrides": Array [],
              "service": ImmutableRegistryList {
                "length": 0,
              },
              "serviceDefined": true,
              "serviceFactoryInvoked": true,
              "tag": "setupCallbacks",
              "type": "tagged",
            },
          ],
          "service": ImmutableRegistryList {
            "length": 0,
          },
          "serviceDefined": true,
          "serviceFactoryInvoked": true,
          "type": "internal",
        },
        TaggedServiceFactoryReference {
          "_configuration": Object {
            "proxy": [Function],
            "uuid": "3",
          },
          "dependencies": ImmutableServiceReferenceList {
            "references": Array [
              InternalServiceFactoryReference {
                "_configuration": Object {
                  "proxy": [Function],
                  "uuid": "2",
                },
                "dependencies": ImmutableServiceReferenceList {
                  "references": Array [],
                },
                "factory": [Function],
                "feature": [Function],
                "proxies": Array [
                  [Circular],
                ],
                "service": ImmutableRegistryList {
                  "length": 0,
                },
                "serviceDefined": true,
                "serviceFactoryInvoked": true,
                "type": "internal",
              },
            ],
          },
          "factory": [Function],
          "feature": [Function],
          "overrides": Array [],
          "service": ImmutableRegistryList {
            "length": 0,
          },
          "serviceDefined": true,
          "serviceFactoryInvoked": true,
          "tag": "setupCallbacks",
          "type": "tagged",
        },
      ],
    }
  `);
});
