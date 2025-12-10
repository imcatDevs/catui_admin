/**
 * Code 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/code.js');

describe('Code Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <pre id="codeBlock"><code class="lang-javascript">console.log('Hello');</code></pre>
      <pre><code id="htmlCode" class="language-html">&lt;div&gt;test&lt;/div&gt;</code></pre>
      <pre><code id="cssCode" class="lang-css">.test { color: red; }</code></pre>
      <pre><code id="jsonCode" class="lang-json">{"key": "value"}</code></pre>
      <pre><code id="plainCode">plain text</code></pre>
      <div id="lineCode" class="cui-code-line">line 1\nline 2</div>
    `;
  });

  describe('기본 API', () => {
    test('code 객체가 존재함', () => {
      expect(window.code).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.code.render).toBe('function');
    });

    test('highlight 메소드가 존재함', () => {
      expect(typeof window.code.highlight).toBe('function');
    });

    test('detectLanguage 메소드가 존재함', () => {
      expect(typeof window.code.detectLanguage).toBe('function');
    });

    test('parse 메소드가 존재함', () => {
      expect(typeof window.code.parse).toBe('function');
    });

    test('escape 메소드가 존재함', () => {
      expect(typeof window.code.escape).toBe('function');
    });

    test('on 메소드가 존재함', () => {
      expect(typeof window.code.on).toBe('function');
    });
  });

  describe('set', () => {
    test('전역 설정', () => {
      const result = window.code.set({ theme: 'dark' });
      expect(result).toBe(window.code);
    });
  });

  describe('render', () => {
    test('기본 렌더링', () => {
      expect(() => {
        window.code.render();
      }).not.toThrow();
    });

    test('선택자로 렌더링', () => {
      expect(() => {
        window.code.render('#codeBlock code');
      }).not.toThrow();
    });

    test('커스텀 선택자', () => {
      expect(() => {
        window.code.render('.cui-code');
      }).not.toThrow();
    });
  });

  describe('highlight', () => {
    test('단일 요소 하이라이팅', () => {
      const elem = document.querySelector('#codeBlock code');
      window.code.highlight(elem);
      expect(elem.getAttribute('data-highlighted')).toBe('true');
    });

    test('언어 감지 후 설정', () => {
      const elem = document.querySelector('#codeBlock code');
      window.code.highlight(elem);
      expect(elem.getAttribute('data-lang')).toBe('javascript');
    });

    test('이미 하이라이팅된 요소 스킵', () => {
      const elem = document.querySelector('#codeBlock code');
      window.code.highlight(elem);
      const firstContent = elem.innerHTML;
      window.code.highlight(elem);
      expect(elem.innerHTML).toBe(firstContent);
    });

    test('줄번호 추가 (cui-code-line)', () => {
      const elem = document.querySelector('#lineCode');
      window.code.highlight(elem);
      expect(elem.getAttribute('data-highlighted')).toBe('true');
    });
  });

  describe('detectLanguage', () => {
    test('class에서 lang-* 감지', () => {
      const elem = document.querySelector('#codeBlock code');
      expect(window.code.detectLanguage(elem)).toBe('javascript');
    });

    test('class에서 language-* 감지', () => {
      const elem = document.querySelector('#htmlCode');
      expect(window.code.detectLanguage(elem)).toBe('html');
    });

    test('내용으로 HTML 추측', () => {
      document.body.innerHTML = '<code id="test">&lt;div&gt;test&lt;/div&gt;</code>';
      const elem = document.querySelector('#test');
      expect(window.code.detectLanguage(elem)).toBe('html');
    });

    test('내용으로 JavaScript 추측', () => {
      document.body.innerHTML = '<code id="test">function test() {}</code>';
      const elem = document.querySelector('#test');
      expect(window.code.detectLanguage(elem)).toBe('javascript');
    });

    test('내용으로 CSS 추측', () => {
      document.body.innerHTML = '<code id="test">.test { color: red; }</code>';
      const elem = document.querySelector('#test');
      expect(window.code.detectLanguage(elem)).toBe('css');
    });

    test('알 수 없는 언어는 text 반환', () => {
      document.body.innerHTML = '<code id="test">plain text here</code>';
      const elem = document.querySelector('#test');
      expect(window.code.detectLanguage(elem)).toBe('text');
    });
  });

  describe('parse', () => {
    test('JavaScript 파싱', () => {
      const result = window.code.parse('function test() {}', 'javascript');
      expect(result).toContain('cui-code-keyword');
    });

    test('JS 축약어로 파싱', () => {
      const result = window.code.parse('var x = 1;', 'js');
      expect(result).toContain('cui-code-keyword');
    });

    test('HTML 파싱', () => {
      const result = window.code.parse('<div class="test">content</div>', 'html');
      expect(result).toContain('cui-code-tag');
    });

    test('XML로 HTML 파싱', () => {
      const result = window.code.parse('<root>content</root>', 'xml');
      expect(result).toContain('cui-code-tag');
    });

    test('CSS 파싱', () => {
      const result = window.code.parse('.test { color: red; }', 'css');
      expect(result).toContain('cui-code-selector');
    });

    test('JSON 파싱', () => {
      const result = window.code.parse('{"key": "value", "num": 123}', 'json');
      expect(result).toContain('cui-code-property');
    });

    test('알 수 없는 언어는 그대로 반환', () => {
      const result = window.code.parse('plain text', 'unknown');
      expect(result).toBe('plain text');
    });
  });

  describe('parseJS', () => {
    test('문자열 하이라이팅', () => {
      const result = window.code.parseJS('"hello"');
      expect(result).toContain('cui-code-string');
    });

    test('작은따옴표 문자열', () => {
      const result = window.code.parseJS("'hello'");
      expect(result).toContain('cui-code-string');
    });

    test('템플릿 리터럴', () => {
      const result = window.code.parseJS('`hello`');
      expect(result).toContain('cui-code-string');
    });

    test('한줄 주석', () => {
      const result = window.code.parseJS('// comment');
      expect(result).toContain('cui-code-comment');
    });

    test('여러줄 주석', () => {
      const result = window.code.parseJS('/* comment */');
      expect(result).toContain('cui-code-comment');
    });

    test('키워드 하이라이팅', () => {
      const result = window.code.parseJS('function var let const');
      expect(result).toContain('cui-code-keyword');
    });

    test('숫자 하이라이팅', () => {
      const result = window.code.parseJS('123 45.67');
      expect(result).toContain('cui-code-number');
    });

    test('함수 하이라이팅', () => {
      const result = window.code.parseJS('myFunc()');
      expect(result).toContain('cui-code-function');
    });
  });

  describe('parseHTML', () => {
    test('태그 하이라이팅', () => {
      const result = window.code.parseHTML('&lt;div&gt;');
      expect(result).toContain('cui-code-tag');
    });

    test('속성 하이라이팅', () => {
      const result = window.code.parseHTML('&lt;div class=&quot;test&quot;&gt;');
      expect(result).toContain('cui-code-attr');
    });

    test('HTML 주석', () => {
      const result = window.code.parseHTML('&lt;!-- comment --&gt;');
      expect(result).toContain('cui-code-comment');
    });
  });

  describe('parseCSS', () => {
    test('선택자 하이라이팅', () => {
      const result = window.code.parseCSS('.test {');
      expect(result).toContain('cui-code-selector');
    });

    test('속성 하이라이팅', () => {
      const result = window.code.parseCSS('color:');
      expect(result).toContain('cui-code-property');
    });

    test('값 하이라이팅', () => {
      const result = window.code.parseCSS('color: red');
      expect(result).toContain('cui-code-value');
    });

    test('단위 하이라이팅', () => {
      const result = window.code.parseCSS('10px 20em');
      expect(result).toContain('cui-code-number');
    });

    test('CSS 주석', () => {
      const result = window.code.parseCSS('/* comment */');
      expect(result).toContain('cui-code-comment');
    });
  });

  describe('parseJSON', () => {
    test('키 하이라이팅', () => {
      const result = window.code.parseJSON('&quot;key&quot;:');
      expect(result).toContain('cui-code-property');
    });

    test('문자열 값 하이라이팅', () => {
      const result = window.code.parseJSON(': &quot;value&quot;');
      expect(result).toContain('cui-code-string');
    });

    test('숫자 값 하이라이팅', () => {
      const result = window.code.parseJSON(': 123');
      expect(result).toContain('cui-code-number');
    });

    test('불린/null 하이라이팅', () => {
      const result = window.code.parseJSON(': true : false : null');
      expect(result).toContain('cui-code-keyword');
    });
  });

  describe('escape', () => {
    test('& 이스케이프', () => {
      expect(window.code.escape('a&b')).toBe('a&amp;b');
    });

    test('< 이스케이프', () => {
      expect(window.code.escape('<div>')).toBe('&lt;div&gt;');
    });

    test('" 이스케이프', () => {
      expect(window.code.escape('"test"')).toBe('&quot;test&quot;');
    });

    test("' 이스케이프", () => {
      expect(window.code.escape("'test'")).toBe("&#39;test&#39;");
    });
  });

  describe('addLineNumbers', () => {
    test('줄번호 추가', () => {
      document.body.innerHTML = '<pre><code id="test">line1\nline2\nline3</code></pre>';
      const elem = document.querySelector('#test');
      window.code.addLineNumbers(elem);
      expect(elem.innerHTML).toContain('cui-code-line-num');
    });
  });

  describe('addCopyButton', () => {
    test('복사 버튼 추가', () => {
      document.body.innerHTML = '<pre><code id="test">code</code></pre>';
      const elem = document.querySelector('#test');
      window.code.addCopyButton(elem);
      expect(document.querySelector('.cui-code-wrapper')).toBeTruthy();
      expect(document.querySelector('.cui-code-copy')).toBeTruthy();
    });
  });

  describe('on', () => {
    test('이벤트 등록', () => {
      const result = window.code.on('test', function() {});
      expect(result).toBe(window.code);
    });
  });
});
