import type {Config} from 'jest';

const config: Config = {
  verbose: true, // Enables detailed output for test results
  preset: 'ts-jest', // Use ts-jest for TypeScript compatibility
  testEnvironment: 'jsdom', // Use jsdom for testing React components
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Configure custom Jest setup
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'], // Supported file extensions
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to handle TypeScript files
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'], // Ignore these directories
  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy', // Mock CSS imports
    '^@/(.*)$': '<rootDir>/$1', // Support alias for importing
  },
};

export default config;
