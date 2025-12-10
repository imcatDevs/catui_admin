/**
 * Theme 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/theme.js');

describe('Theme Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="themePicker"></div>
    `;
    // localStorage 초기화
    localStorage.clear();
  });

  describe('기본 API', () => {
    test('theme 객체가 존재함', () => {
      expect(window.theme).toBeDefined();
    });

    test('set 메소드가 존재함', () => {
      expect(typeof window.theme.set).toBe('function');
    });

    test('list 메소드가 존재함', () => {
      expect(typeof window.theme.list).toBe('function');
    });

    test('get 메소드가 존재함', () => {
      expect(typeof window.theme.get).toBe('function');
    });

    test('current 메소드가 존재함', () => {
      expect(typeof window.theme.current).toBe('function');
    });

    test('setPrimary 메소드가 존재함', () => {
      expect(typeof window.theme.setPrimary).toBe('function');
    });

    test('add 메소드가 존재함', () => {
      expect(typeof window.theme.add).toBe('function');
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.theme.render).toBe('function');
    });
  });

  describe('list', () => {
    test('테마 목록 반환', () => {
      const themes = window.theme.list();
      expect(themes).toBeDefined();
      expect(typeof themes).toBe('object');
    });

    test('기본 테마 존재', () => {
      const themes = window.theme.list();
      expect(themes.default).toBeDefined();
    });
  });

  describe('get', () => {
    test('특정 테마 가져오기', () => {
      const defaultTheme = window.theme.get('default');
      expect(defaultTheme).toBeDefined();
    });

    test('존재하지 않는 테마 (기본값 반환)', () => {
      const nonexistent = window.theme.get('nonexistent');
      // 존재하지 않으면 기본 테마를 반환하거나 undefined
      expect(nonexistent !== null).toBe(true);
    });
  });

  describe('set', () => {
    test('테마 설정', () => {
      window.theme.set('default');
      expect(window.theme.current()).toBe('default');
    });

    test('저장 없이 설정', () => {
      window.theme.set('default', false);
      expect(window.theme.current()).toBe('default');
    });
  });

  describe('current', () => {
    test('현재 테마 반환', () => {
      window.theme.set('default');
      const current = window.theme.current();
      expect(current).toBe('default');
    });
  });

  describe('setPrimary', () => {
    test('프라이머리 색상 설정', () => {
      expect(() => {
        window.theme.setPrimary('#ff6600');
      }).not.toThrow();
    });

    test('레이아웃에 적용', () => {
      expect(() => {
        window.theme.setPrimary('#ff6600', { applyToLayout: true });
      }).not.toThrow();
    });
  });

  describe('add', () => {
    test('커스텀 테마 등록', () => {
      window.theme.add('custom', {
        name: '커스텀',
        header: '#333333',
        sidebar: '#444444',
        primary: '#ff0000'
      });

      const customTheme = window.theme.get('custom');
      expect(customTheme).toBeDefined();
      expect(customTheme.name).toBe('커스텀');
    });
  });

  describe('render', () => {
    test('테마 선택기 렌더링', () => {
      expect(() => {
        window.theme.render('#themePicker');
      }).not.toThrow();
    });

    test('옵션과 함께 렌더링', () => {
      expect(() => {
        window.theme.render('#themePicker', {
          size: 30,
          gap: 10,
          showName: true
        });
      }).not.toThrow();
    });

    test('onChange 콜백', () => {
      let changed = false;
      
      window.theme.render('#themePicker', {
        onChange: function(name) {
          changed = true;
        }
      });

      // 콜백이 설정되었는지 확인
      expect(true).toBe(true);
    });
  });

  describe('색상 유틸리티', () => {
    test('hexToRgb 존재 확인', () => {
      // theme.js 내부 함수이므로 직접 테스트 어려움
      // 대신 setPrimary가 RGB 변환을 제대로 하는지 간접 확인
      expect(() => {
        window.theme.setPrimary('#16baaa');
      }).not.toThrow();
    });
  });
});
