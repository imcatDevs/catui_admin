/**
 * Jest 테스트 셋업
 * 테스트 실행 전 공통 환경 설정
 */

// 전역 window 객체 설정
global.window = global;
global.document = window.document;

// console 에러 모킹 (필요시)
// jest.spyOn(console, 'error').mockImplementation(() => {});

// 타임아웃 설정
jest.setTimeout(10000);

// DOM 초기화 헬퍼
global.resetDOM = function() {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
};

// 모듈 로드 헬퍼
global.loadModule = function(modulePath) {
  // 캐시 초기화
  jest.resetModules();
  return require(modulePath);
};

// afterEach에서 DOM 정리
afterEach(() => {
  document.body.innerHTML = '';
});
