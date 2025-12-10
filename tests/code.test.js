/**
 * Code 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/code.js');

describe('Code Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <pre id="codeBlock"><code>console.log('Hello');</code></pre>
      <textarea id="codeEditor">function test() { return true; }</textarea>
    `;
  });

  describe('기본 API', () => {
    test('code 객체가 존재함', () => {
      expect(window.code).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.code.render).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 코드 하이라이팅', () => {
      expect(() => {
        window.code.render({
          elem: '#codeBlock'
        });
      }).not.toThrow();
    });

    test('언어 지정', () => {
      expect(() => {
        window.code.render({
          elem: '#codeBlock',
          lang: 'javascript'
        });
      }).not.toThrow();
    });

    test('라인 번호', () => {
      expect(() => {
        window.code.render({
          elem: '#codeBlock',
          lineNumber: true
        });
      }).not.toThrow();
    });

    test('테마 설정', () => {
      expect(() => {
        window.code.render({
          elem: '#codeBlock',
          theme: 'dark'
        });
      }).not.toThrow();
    });

    test('복사 버튼', () => {
      expect(() => {
        window.code.render({
          elem: '#codeBlock',
          copy: true
        });
      }).not.toThrow();
    });
  });
});
