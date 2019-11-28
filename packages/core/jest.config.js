const jestBase = require("../../jest.base.config");

jestBase.modulePathIgnorePatterns.push('example');

module.exports = {
    ...jestBase,
};
