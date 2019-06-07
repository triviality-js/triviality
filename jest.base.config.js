module.exports = {
    collectCoverage: false,
    testEnvironment: "node",
    coverageDirectory: "reports/coverage",
    collectCoverageFrom: [
        "src/**/*.{tsx?}",
        "!example/**/*",
        "!__test__/*",
        "!**/__test__/**",
        "!**/build",
        "!**/.stryker-tmp",
    ],
    coverageReporters: [
        "json-summary",
        "text",
        "lcov",
    ],
    modulePathIgnorePatterns: [
        ".stryker-tmp",
    ],
    coverageThreshold: {
        "global": {
            "branches": 100,
            "functions": 100,
            "lines": 100,
            "statements": 100,
        },
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
    ],
    transform: {
        "\\.(ts|tsx)$": "ts-jest",
    },
    testRegex: ".*\\.test\\.tsx?$",
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    }
};
