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
});
