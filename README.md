# Triviality

- Promotes re-use from all different libraries (Internal and external).

<p align="center">
    <a href="https://www.npmjs.com/package/@triviality/core"><img alt="npm Downloads" src="https://img.shields.io/npm/dm/@triviality/core.svg?maxAge=43200&label=npm%20downloads"></a>
</p>

<p align="center">
  <a href="https://travis-ci.org/triviality/core"><img alt="Travis Status" src="https://img.shields.io/travis/triviality/core/master.svg?label=travis&maxAge=43200"></a>
</p>

[See core readme.md](packages/core/README.md)

## Develop

```
npm install --global lerna yarn
lerna bootstrap
yarn build 
yarn watch
``` 

It uses Lerna to manage multiple packages at once, you can scope the commands for only certain packages.

```
yarn watch --scope=@traviality/core 
```

### How is the repo structured?

All officially maintained modules are in the same repo maintained with [lerna](https://github.com/lerna/lerna). 

### How is a single package structured? 

```<package>/src/``` The actual typescript source code
```<package>/*(.d.ts|.js)``` Typescript output, placed in root of project for easy reference 

## Quality 

- TypeScript
- Ts lint
- Code duplication
- Jest
- Stryker mutation testing

## License

[MIT](LICENSE)
