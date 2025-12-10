/**
 * Flow 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/flow.js');

describe('Flow Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="flowContainer" style="height: 500px; overflow: auto;">
        <ul id="flowList"></ul>
      </div>
      <div id="imageContainer">
        <img cui-src="/img1.jpg" src="">
        <img cui-src="/img2.jpg" src="">
      </div>
    `;
  });

  describe('기본 API', () => {
    test('flow 객체가 존재함', () => {
      expect(window.flow).toBeDefined();
    });

    test('load 메소드가 존재함', () => {
      expect(typeof window.flow.load).toBe('function');
    });

    test('set 메소드가 존재함', () => {
      expect(typeof window.flow.set).toBe('function');
    });
  });

  describe('load', () => {
    test('기본 무한 스크롤', () => {
      expect(() => {
        window.flow.load({
          elem: '#flowList',
          done: function(page, next) {
            // 데이터 로드 시뮬레이션
            next('<li>항목 ' + page + '</li>', page < 3);
          }
        });
      }).not.toThrow();
    });

    test('스크롤 요소 지정', () => {
      expect(() => {
        window.flow.load({
          elem: '#flowList',
          scrollElem: '#flowContainer',
          done: function(page, next) {
            next('', false);
          }
        });
      }).not.toThrow();
    });

    test('자동 로드 비활성화', () => {
      expect(() => {
        window.flow.load({
          elem: '#flowList',
          isAuto: false,
          done: function(page, next) {
            next('', false);
          }
        });
      }).not.toThrow();
    });

    test('종료 메시지 설정', () => {
      expect(() => {
        window.flow.load({
          elem: '#flowList',
          end: '더 이상 데이터가 없습니다.',
          done: function(page, next) {
            next('', false);
          }
        });
      }).not.toThrow();
    });

    test('마진 바텀 설정', () => {
      expect(() => {
        window.flow.load({
          elem: '#flowList',
          mb: 100,
          done: function(page, next) {
            next('', false);
          }
        });
      }).not.toThrow();
    });
  });

  describe('스크롤 옵션', () => {
    test('scrollElem 옵션', () => {
      document.body.innerHTML = `
        <div id="scrollContainer" style="height:200px;overflow:auto;">
          <div id="flowContent"></div>
        </div>
      `;

      expect(() => {
        window.flow.load({
          elem: '#flowContent',
          scrollElem: '#scrollContainer',
          done: function(page, next) {
            next('', false);
          }
        });
      }).not.toThrow();
    });
  });
});
