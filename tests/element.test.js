/**
 * Element 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/element.js');

describe('Element Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="cui-tab" cui-filter="testTab">
        <ul class="cui-tab-title">
          <li class="cui-this" cui-id="tab1">탭 1</li>
          <li cui-id="tab2">탭 2</li>
          <li cui-id="tab3">탭 3</li>
        </ul>
        <div class="cui-tab-content">
          <div class="cui-tab-item cui-show">내용 1</div>
          <div class="cui-tab-item">내용 2</div>
          <div class="cui-tab-item">내용 3</div>
        </div>
      </div>
      
      <div class="cui-progress" id="progress1">
        <div class="cui-progress-bar" cui-percent="50%"></div>
      </div>
      
      <ul class="cui-nav" cui-filter="testNav">
        <li class="cui-nav-item cui-this"><a href="#">메뉴 1</a></li>
        <li class="cui-nav-item"><a href="#">메뉴 2</a></li>
      </ul>
      
      <div class="cui-collapse" cui-filter="testCollapse">
        <div class="cui-collapse-item">
          <h2 class="cui-collapse-title">패널 1</h2>
          <div class="cui-collapse-content">내용 1</div>
        </div>
      </div>
    `;
  });

  describe('기본 API', () => {
    test('element 객체가 존재함', () => {
      expect(window.element).toBeDefined();
    });

    test('tabAdd 메소드가 존재함', () => {
      expect(typeof window.element.tabAdd).toBe('function');
    });

    test('tabDelete 메소드가 존재함', () => {
      expect(typeof window.element.tabDelete).toBe('function');
    });

    test('tabChange 메소드가 존재함', () => {
      expect(typeof window.element.tabChange).toBe('function');
    });

    test('progress 메소드가 존재함', () => {
      expect(typeof window.element.progress).toBe('function');
    });

    test('on 메소드가 존재함', () => {
      expect(typeof window.element.on).toBe('function');
    });
  });

  describe('Tab', () => {
    test('탭 추가', () => {
      window.element.tabAdd('testTab', {
        title: '새 탭',
        content: '새 탭 내용',
        id: 'newTab'
      });

      const tabs = document.querySelectorAll('.cui-tab-title li');
      expect(tabs.length).toBe(4);
    });

    test('탭 삭제', () => {
      window.element.tabDelete('testTab', 'tab3');
      
      const tabs = document.querySelectorAll('.cui-tab-title li');
      expect(tabs.length).toBe(2);
    });

    test('탭 변경', () => {
      // tabChange는 내부적으로 click을 호출
      expect(() => {
        window.element.tabChange('testTab', 'tab2');
      }).not.toThrow();
    });
  });

  describe('Progress', () => {
    test('프로그레스 업데이트', () => {
      expect(() => {
        window.element.progress('progress1', '75%');
      }).not.toThrow();
    });

    test('프로그레스 0%', () => {
      expect(() => {
        window.element.progress('progress1', '0%');
      }).not.toThrow();
    });

    test('프로그레스 100%', () => {
      expect(() => {
        window.element.progress('progress1', '100%');
      }).not.toThrow();
    });
  });

  describe('render', () => {
    test('요소 렌더링', () => {
      expect(() => {
        window.element.render();
      }).not.toThrow();
    });

    test('특정 필터만 렌더링', () => {
      expect(() => {
        window.element.render('tab');
      }).not.toThrow();
    });
  });
});
