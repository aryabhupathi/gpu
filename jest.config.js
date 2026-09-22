const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testPathIgnorePatterns: ['<rootDir>/e2e/', '<rootDir>/__tests__/mocks/'],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"]
}
module.exports = createJestConfig(customJestConfig)
