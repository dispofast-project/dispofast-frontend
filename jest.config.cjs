/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/features/dashboard/secret/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/**/types.ts',
    '!src/**/index.ts',
    '!src/**/setup.ts',
    '!src/**/constants.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/**/*.{ts,tsx,js,jsx}': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/lib/apiClient$': '<rootDir>/__mocks__/apiClient.ts',
    '^@/utils/constants': '<rootDir>/__mocks__/constantMock.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testTimeout: 50000,
};

module.exports = config;
