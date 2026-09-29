module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/auth/**/*.test.ts'],
  setupFiles: ['<rootDir>/tests/auth/setup.cjs'],
};
