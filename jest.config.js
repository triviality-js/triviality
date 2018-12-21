module.exports = {
    collectCoverage: false,
    testEnvironment: 'node',
    coverageDirectory: "reports/coverage",
    collectCoverageFrom: [
        "src/**/*.{ts}",
        "!example/**/*",
        "!**/__test__/**/*",
        "!**/*test.{ts}",
        "!**/*.d.{ts}",
        "!**/build",
        "!**/src/cli/*",
        "!**/.stryker-tmp",
    ],
    coverageReporters: [
        "json-summary",
        "text",
        "lcov"
    ],
    modulePathIgnorePatterns: [
        ".stryker-tmp"
    ],
    coverageThreshold: {
        "global": {
            "branches": 100,
            "functions": 100,
            "lines": 100,
            "statements": 100
        }
    },
    moduleFileExtensions: [
        "ts",
        "js",
    ],
    transform: {
        "\\.(ts|tsx)$": "ts-jest"
    },
    testRegex: ".*\\.test\\.ts$",
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json",
        }
    }
};