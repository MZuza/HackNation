module.exports = {
  roots: ['<rootDir>/src/'],
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@env/(.*)': '<rootDir>/src/environments/$1',
    '^lodash-es$': 'lodash',
  }
};
