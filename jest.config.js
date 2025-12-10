/**
 * Catui Jest Configuration
 */
module.exports = {
  // 테스트 환경 (브라우저 DOM 시뮬레이션)
  testEnvironment: 'jsdom',

  // 테스트 파일 패턴
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],

  // 무시할 경로
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],

  // 모듈 경로 별칭
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // 셋업 파일
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // 커버리지 설정
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.min.js'
  ],

  // 커버리지 리포터
  coverageReporters: ['text', 'lcov', 'html'],

  // 커버리지 디렉토리
  coverageDirectory: 'coverage',

  // 상세 출력
  verbose: true
};
