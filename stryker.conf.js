module.exports = function(config) {
    config.set({
        mutator: "typescript",
        packageManager: "yarn",
        reporters: ["clear-text", "progress", "html"],
        testRunner: "jest",
        transpilers: [],
        coverageAnalysis: "off",
        mutate: [
            "packages/*/src/**/*.ts",
            "!**/__test__/*.test.ts",
        ],
        jest: {
            projectType: "custom",
            config: require(__dirname + "/jest.stryker.config.js"),
        },
    });
};
