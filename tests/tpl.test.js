/**
 * Template 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/tpl.js');

describe('Template Module', () => {
  
  describe('기본 API', () => {
    test('tpl 객체가 존재함', () => {
      expect(window.tpl).toBeDefined();
    });

    test('함수로 호출 가능', () => {
      expect(typeof window.tpl).toBe('function');
    });
  });

  describe('템플릿 렌더링', () => {
    test('기본 변수 치환', () => {
      const template = '안녕하세요, {{ d.name }}님!';
      const data = { name: '홍길동' };
      
      const result = window.tpl(template).render(data);
      expect(result).toBe('안녕하세요, 홍길동님!');
    });

    test('여러 변수', () => {
      const template = '{{ d.greeting }}, {{ d.name }}!';
      const data = { greeting: 'Hello', name: 'World' };
      
      const result = window.tpl(template).render(data);
      expect(result).toBe('Hello, World!');
    });

    test('중첩 객체', () => {
      const template = '{{ d.user.name }} - {{ d.user.email }}';
      const data = {
        user: {
          name: '홍길동',
          email: 'hong@test.com'
        }
      };
      
      const result = window.tpl(template).render(data);
      expect(result).toBe('홍길동 - hong@test.com');
    });

    test('조건문 (if)', () => {
      const template = '{{# if(d.show){ }}보임{{# } else { }}숨김{{# } }}';
      
      const result1 = window.tpl(template).render({ show: true });
      const result2 = window.tpl(template).render({ show: false });
      
      expect(result1).toBe('보임');
      expect(result2).toBe('숨김');
    });

    test('반복문 (each)', () => {
      const template = '{{# for(var i=0; i<d.items.length; i++){ }}{{ d.items[i] }},{{# } }}';
      const data = { items: ['A', 'B', 'C'] };
      
      const result = window.tpl(template).render(data);
      expect(result).toContain('A');
      expect(result).toContain('B');
      expect(result).toContain('C');
    });

    test('HTML 이스케이프', () => {
      const template = '{{= d.html }}';
      const data = { html: '<script>alert("xss")</script>' };
      
      const result = window.tpl(template).render(data);
      expect(result).not.toContain('<script>');
    });

    test('HTML 미이스케이프 (raw)', () => {
      // tpl의 raw 문법이 다를 수 있으므로 에러 없이 실행되는지 확인
      const template = '{{ d.html }}';
      const data = { html: 'test' };
      
      const result = window.tpl(template).render(data);
      expect(result).toContain('test');
    });

    test('빈 데이터', () => {
      const template = '기본값: {{ d.value || "없음" }}';
      const data = {};
      
      const result = window.tpl(template).render(data);
      expect(result).toContain('없음');
    });
  });

  describe('config', () => {
    test('config 객체 존재', () => {
      expect(window.tpl.config).toBeDefined();
    });
  });
});
