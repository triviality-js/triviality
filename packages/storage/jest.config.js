const jestBase = require("../../jest.base.config");

module.exports = {
    ...jestBase,
    testEnvironment: "jsdom",
};
