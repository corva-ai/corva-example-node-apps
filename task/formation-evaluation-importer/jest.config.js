module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['app/**/*.js', 'lib/**/*.js'],
    coverageReporters: ['lcov', 'text'],
    moduleFileExtensions: ['ts', 'js'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/config/'],
    verbose: true,
    reporters: [
        'default',
        [
            'jest-junit',
            {
                suiteName: 'jest tests',
                outputDirectory: './test-results/jest',
                outputName: 'results.xml',
            },
        ],
    ],
};
