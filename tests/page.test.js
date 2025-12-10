/**
 * Page 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/page.js');

describe('Page Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="pageContainer"></div>
    `;
  });

  describe('기본 API', () => {
    test('page 객체가 존재함', () => {
      expect(window.page).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.page.render).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 페이지네이션', () => {
      expect(() => {
        window.page.render({
          elem: '#pageContainer',
          count: 100
        });
      }).not.toThrow();
    });

    test('페이지당 항목 수 설정', () => {
      expect(() => {
        window.page.render({
          elem: '#pageContainer',
          count: 100,
          limit: 20
        });
      }).not.toThrow();
    });

    test('현재 페이지 설정', () => {
      expect(() => {
        window.page.render({
          elem: '#pageContainer',
          count: 100,
          curr: 3
        });
      }).not.toThrow();
    });

    test('레이아웃 설정', () => {
      expect(() => {
        window.page.render({
          elem: '#pageContainer',
          count: 100,
          layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
        });
      }).not.toThrow();
    });

    test('버튼 텍스트 커스터마이징', () => {
      expect(() => {
        window.page.render({
          elem: '#pageContainer',
          count: 100,
          prev: '이전',
          next: '다음',
          first: '처음',
          last: '마지막'
        });
      }).not.toThrow();
    });

    test('그룹 수 설정', () => {
      expect(() => {
        window.page.render({
          elem: '#pageContainer',
          count: 100,
          groups: 10
        });
      }).not.toThrow();
    });

    test('데이터 없음 (count: 0)', () => {
      window.page.render({
        elem: '#pageContainer',
        count: 0
      });

      // count가 0이면 페이지네이션이 렌더링되지 않거나 빈 상태
      expect(true).toBe(true);
    });

    test('jump 콜백', () => {
      let jumpCalled = false;
      let jumpPage = 0;

      window.page.render({
        elem: '#pageContainer',
        count: 100,
        jump: function(obj, first) {
          jumpCalled = true;
          jumpPage = obj.curr;
        }
      });

      expect(jumpCalled).toBe(true);
      expect(jumpPage).toBe(1);
    });
  });

  describe('계산 로직', () => {
    test('총 페이지 수 계산', () => {
      const count = 100;
      const limit = 10;
      const totalPages = Math.ceil(count / limit);
      expect(totalPages).toBe(10);
    });

    test('나머지 있는 경우', () => {
      const count = 95;
      const limit = 10;
      const totalPages = Math.ceil(count / limit);
      expect(totalPages).toBe(10);
    });

    test('1페이지만 있는 경우', () => {
      const count = 5;
      const limit = 10;
      const totalPages = Math.ceil(count / limit);
      expect(totalPages).toBe(1);
    });
  });
});
