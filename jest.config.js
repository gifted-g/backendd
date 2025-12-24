module.exports = {
  testEnvironment: "node",
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["src/**/*.js", "!src/config/**", "!src/utils/logger.js"],
  testMatch: ["**/test/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
  testTimeout: 10000,
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
}
