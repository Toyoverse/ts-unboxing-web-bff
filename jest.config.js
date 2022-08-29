module.exports = {
  globals: {},
  transform: {
    '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  moduleFileExtensions: ['js', 'ts'],
  modulePathIgnorePatterns: ['<rootDir>/src/interfaces/'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  coverageReporters: ['lcov', 'text', 'cobertura'],
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        outputPath: './coverage/test-report.html',
      },
    ],
  ],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'src/**/**/*.{ts,tsx}'],
  testResultsProcessor: 'jest-sonar-reporter',
  testMatch: [
    '<rootDir>/tests/**/**/*.test.ts',
    '<rootDir>/tests/**/**/**/*.test.ts',
    '<rootDir>/src/**/**/**/*.test.ts',
  ],
  testEnvironment: 'node',
};
