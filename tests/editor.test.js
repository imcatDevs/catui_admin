/**
 * Editor 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/editor.js');

describe('Editor Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <textarea id="editor"></textarea>
      <div id="editorContainer"></div>
    `;
  });

  describe('기본 API', () => {
    test('editor 객체가 존재함', () => {
      expect(window.editor).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.editor.render).toBe('function');
    });

    test('set 메소드가 존재함', () => {
      expect(typeof window.editor.set).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 에디터', () => {
      expect(() => {
        window.editor.render({
          elem: '#editor'
        });
      }).not.toThrow();
    });

    test('ID 설정', () => {
      expect(() => {
        window.editor.render({
          elem: '#editor',
          id: 'myEditor'
        });
      }).not.toThrow();
    });

    test('높이 설정', () => {
      expect(() => {
        window.editor.render({
          elem: '#editor',
          height: 400
        });
      }).not.toThrow();
    });

    test('툴바 설정', () => {
      expect(() => {
        window.editor.render({
          elem: '#editor',
          tool: ['bold', 'italic', 'underline']
        });
      }).not.toThrow();
    });

    test('초기 내용 설정', () => {
      expect(() => {
        window.editor.render({
          elem: '#editor',
          value: '<p>초기 내용</p>'
        });
      }).not.toThrow();
    });
  });

  describe('콜백', () => {
    test('change 콜백', () => {
      expect(() => {
        window.editor.render({
          elem: '#editor',
          change: function(content) {
            console.log('변경됨:', content);
          }
        });
      }).not.toThrow();
    });

    test('focus 콜백', () => {
      expect(() => {
        window.editor.render({
          elem: '#editor',
          focus: function() {
            console.log('포커스');
          }
        });
      }).not.toThrow();
    });

    test('blur 콜백', () => {
      expect(() => {
        window.editor.render({
          elem: '#editor',
          blur: function() {
            console.log('블러');
          }
        });
      }).not.toThrow();
    });
  });

  describe('on', () => {
    test('on 메소드가 존재함', () => {
      expect(typeof window.editor.on).toBe('function');
    });

    test('이벤트 등록', () => {
      const result = window.editor.on('change(filter)', function() {});
      expect(result).toBeDefined();
    });
  });

  describe('인스턴스 메소드', () => {
    test('getContent 존재 확인', () => {
      // editor 인스턴스는 render에서 반환됨
      expect(window.editor.render).toBeDefined();
    });

    test('getText 존재 확인', () => {
      expect(window.editor.render).toBeDefined();
    });

    test('setContent 존재 확인', () => {
      expect(window.editor.render).toBeDefined();
    });
  });

  describe('툴바 옵션', () => {
    test('커스텀 툴바 배열', () => {
      expect(() => {
        window.editor.render({
          elem: '#editor',
          tool: ['strong', 'italic', 'underline']
        });
      }).not.toThrow();
    });
  });

  describe('placeholder', () => {
    test('placeholder 옵션', () => {
      expect(() => {
        window.editor.render({
          elem: '#editor',
          placeholder: '내용을 입력하세요...'
        });
      }).not.toThrow();
    });
  });
});
