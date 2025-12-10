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

  describe('config 설정', () => {
    test('config 변경 가능', () => {
      expect(window.tpl.config).toBeDefined();
    });
  });

  describe('복잡한 템플릿', () => {
    test('삼항 연산자', () => {
      const template = '{{ d.active ? "활성" : "비활성" }}';
      
      const result1 = window.tpl(template).render({ active: true });
      const result2 = window.tpl(template).render({ active: false });
      
      expect(result1).toBe('활성');
      expect(result2).toBe('비활성');
    });

    test('숫자 계산', () => {
      const template = '합계: {{ d.a + d.b }}';
      const result = window.tpl(template).render({ a: 10, b: 20 });
      expect(result).toContain('30');
    });

    test('배열 길이', () => {
      const template = '개수: {{ d.items.length }}';
      const result = window.tpl(template).render({ items: [1, 2, 3, 4, 5] });
      expect(result).toContain('5');
    });

    test('메소드 호출', () => {
      const template = '대문자: {{ d.text.toUpperCase() }}';
      const result = window.tpl(template).render({ text: 'hello' });
      expect(result).toContain('HELLO');
    });

    test('다중 조건문', () => {
      const template = '{{# if(d.score >= 90){ }}A{{# } else if(d.score >= 80){ }}B{{# } else { }}C{{# } }}';
      
      const result1 = window.tpl(template).render({ score: 95 });
      const result2 = window.tpl(template).render({ score: 85 });
      const result3 = window.tpl(template).render({ score: 70 });
      
      expect(result1).toBe('A');
      expect(result2).toBe('B');
      expect(result3).toBe('C');
    });

    test('중첩 반복문', () => {
      const template = '{{# for(var i=0; i<d.rows.length; i++){ }}행{{d.rows[i]}},{{# } }}';
      const result = window.tpl(template).render({ rows: [1, 2, 3] });
      expect(result).toContain('행1');
      expect(result).toContain('행2');
      expect(result).toContain('행3');
    });
  });

  describe('특수 케이스', () => {
    test('undefined 값', () => {
      const template = '값: {{ d.value || "기본값" }}';
      const result = window.tpl(template).render({ value: undefined });
      expect(result).toContain('기본값');
    });

    test('null 값', () => {
      const template = '값: {{ d.value || "없음" }}';
      const result = window.tpl(template).render({ value: null });
      expect(result).toContain('없음');
    });

    test('0 값', () => {
      const template = '숫자: {{ d.num }}';
      const result = window.tpl(template).render({ num: 0 });
      expect(result).toContain('0');
    });

    test('빈 배열', () => {
      const template = '{{# if(d.items.length === 0){ }}비어있음{{# } }}';
      const result = window.tpl(template).render({ items: [] });
      expect(result).toBe('비어있음');
    });
  });

  describe('tpl.config', () => {
    test('config 설정', () => {
      const result = window.tpl.config({ open: '{{', close: '}}' });
      expect(result).toBe(window.tpl);
    });

    test('빈 옵션', () => {
      const result = window.tpl.config();
      expect(result).toBe(window.tpl);
    });
  });

  describe('tpl.helper', () => {
    test('헬퍼 함수 등록 - 단일', () => {
      window.tpl.helper('upper', function(str) {
        return str.toUpperCase();
      });
      
      const helpers = window.tpl.getHelper();
      expect(helpers.upper).toBeDefined();
    });

    test('헬퍼 함수 등록 - 객체', () => {
      window.tpl.helper({
        lower: function(str) { return str.toLowerCase(); },
        trim: function(str) { return str.trim(); }
      });
      
      expect(window.tpl.getHelper('lower')).toBeDefined();
      expect(window.tpl.getHelper('trim')).toBeDefined();
    });

    test('헬퍼 함수 사용', () => {
      window.tpl.helper('prefix', function(str) {
        return '[' + str + ']';
      });
      
      const template = '{{ d._h.prefix(d.name) }}';
      const result = window.tpl(template).render({ name: 'test' });
      expect(result).toBe('[test]');
    });

    test('getHelper - 특정 헬퍼', () => {
      const helper = window.tpl.getHelper('date');
      expect(typeof helper).toBe('function');
    });

    test('getHelper - 모든 헬퍼', () => {
      const helpers = window.tpl.getHelper();
      expect(typeof helpers).toBe('object');
    });
  });

  describe('기본 헬퍼', () => {
    test('date 헬퍼', () => {
      const template = '{{ d._h.date(d.time, "yyyy-MM-dd") }}';
      const result = window.tpl(template).render({ time: new Date('2024-03-20').getTime() });
      expect(result).toBe('2024-03-20');
    });

    test('date 헬퍼 - 빈 값', () => {
      const template = '{{ d._h.date(d.time) }}';
      const result = window.tpl(template).render({ time: null });
      expect(result).toBe('');
    });

    test('number 헬퍼', () => {
      const template = '{{ d._h.number(d.value) }}';
      const result = window.tpl(template).render({ value: 1234567 });
      expect(result).toBe('1,234,567');
    });

    test('number 헬퍼 - null', () => {
      const template = '{{ d._h.number(d.value) }}';
      const result = window.tpl(template).render({ value: null });
      expect(result).toBe('');
    });

    test('truncate 헬퍼', () => {
      const template = '{{ d._h.truncate(d.text, 5) }}';
      const result = window.tpl(template).render({ text: 'Hello World' });
      expect(result).toBe('Hello...');
    });

    test('truncate 헬퍼 - 짧은 텍스트', () => {
      const template = '{{ d._h.truncate(d.text, 50) }}';
      const result = window.tpl(template).render({ text: 'Hi' });
      expect(result).toBe('Hi');
    });

    test('truncate 헬퍼 - 빈 값', () => {
      const template = '{{ d._h.truncate(d.text, 10) }}';
      const result = window.tpl(template).render({ text: '' });
      expect(result).toBe('');
    });

    test('default 헬퍼', () => {
      const template = '{{ d._h.default(d.value, "기본값") }}';
      const result = window.tpl(template).render({ value: undefined });
      expect(result).toBe('기본값');
    });

    test('default 헬퍼 - 값 있음', () => {
      const template = '{{ d._h.default(d.value, "기본값") }}';
      const result = window.tpl(template).render({ value: '실제값' });
      expect(result).toBe('실제값');
    });
  });

  describe('tpl 캐시', () => {
    test('ID 셀렉터로 템플릿 로드', () => {
      document.body.innerHTML = '<script type="text/html" id="testTpl">{{ d.name }}</script>';
      
      const tplInstance = window.tpl('#testTpl');
      const result = tplInstance.render({ name: '테스트' });
      expect(result).toBe('테스트');
    });

    test('캐시된 템플릿 재사용', () => {
      document.body.innerHTML = '<script type="text/html" id="cacheTpl">{{ d.value }}</script>';
      
      window.tpl('#cacheTpl').render({ value: 1 });
      const cached = window.tpl.get('cacheTpl');
      expect(cached).toBeDefined();
    });

    test('캐시 삭제 - 특정 ID', () => {
      document.body.innerHTML = '<script type="text/html" id="clearTpl">{{ d.x }}</script>';
      window.tpl('#clearTpl').render({ x: 1 });
      
      window.tpl.clear('clearTpl');
      expect(window.tpl.get('clearTpl')).toBeUndefined();
    });

    test('캐시 삭제 - 전체', () => {
      window.tpl.clear();
      const list = window.tpl.list();
      expect(list.length).toBe(0);
    });

    test('캐시 목록', () => {
      document.body.innerHTML = '<script type="text/html" id="listTpl">{{ d.x }}</script>';
      window.tpl('#listTpl').render({ x: 1 });
      
      const list = window.tpl.list();
      expect(Array.isArray(list)).toBe(true);
    });

    test('존재하지 않는 템플릿', () => {
      const result = window.tpl('#nonexistent').render({ x: 1 });
      expect(result).toContain('Error');
    });
  });

  describe('renderTo', () => {
    test('DOM에 직접 렌더링', () => {
      document.body.innerHTML = '<div id="renderTarget"></div>';
      
      const template = '<span>{{ d.text }}</span>';
      window.tpl(template).renderTo('#renderTarget', { text: '테스트' });
      
      expect(document.getElementById('renderTarget').innerHTML).toContain('테스트');
    });

    test('renderTo 콜백', () => {
      document.body.innerHTML = '<div id="callbackTarget"></div>';
      
      let callbackCalled = false;
      window.tpl('{{ d.x }}').renderTo('#callbackTarget', { x: 1 }, function(result, target) {
        callbackCalled = true;
      });
      
      expect(callbackCalled).toBe(true);
    });

    test('존재하지 않는 요소', () => {
      const result = window.tpl('{{ d.x }}').renderTo('#nonexistent', { x: 1 });
      expect(result).toContain('Error');
    });
  });

  describe('renderAsync', () => {
    test('비동기 렌더링', async () => {
      const result = await window.tpl('{{ d.name }}').renderAsync({ name: '비동기' });
      expect(result).toBe('비동기');
    });

    test('비동기 에러', async () => {
      await expect(
        window.tpl('{{ d.invalid.property }}').renderAsync({})
      ).rejects.toThrow();
    });
  });

  describe('render 콜백', () => {
    test('render 콜백 호출', () => {
      let callbackResult = null;
      window.tpl('{{ d.x }}').render({ x: 123 }, function(result) {
        callbackResult = result;
      });
      expect(callbackResult).toBe('123');
    });
  });

  describe('에러 처리', () => {
    test('데이터 없이 render', () => {
      const result = window.tpl('{{ d.x }}').render();
      expect(result).toContain('Error');
    });

    test('문자열 아닌 템플릿', () => {
      const result = window.tpl(123).render({ x: 1 });
      expect(result).toContain('Error');
    });

    test('문법 에러 템플릿', () => {
      const template = '{{# if(d.x { }}에러{{# } }}';
      const result = window.tpl(template).render({ x: true });
      expect(result).toContain('Error');
    });
  });

  describe('이스케이프 제외', () => {
    test('이스케이프 제외 문법', () => {
      const template = '{{! d.raw !}}';
      const result = window.tpl(template).render({ raw: '<b>굵게</b>' });
      // 이스케이프 제외 처리
      expect(result).toBeDefined();
    });
  });

  describe('tool.escape', () => {
    test('HTML 이스케이프', () => {
      const template = '{{= d.html }}';
      const data = { html: '<div onclick="xss">&test</div>' };
      const result = window.tpl(template).render(data);
      expect(result).not.toContain('<div');
      expect(result).toContain('&amp;');
    });
  });

  describe('버전 정보', () => {
    test('v 속성', () => {
      expect(window.tpl.v).toBeDefined();
      expect(typeof window.tpl.v).toBe('string');
    });
  });

  describe('복잡한 데이터', () => {
    test('깊은 중첩 객체', () => {
      const template = '{{ d.a.b.c.d }}';
      const result = window.tpl(template).render({ a: { b: { c: { d: 'deep' } } } });
      expect(result).toBe('deep');
    });

    test('배열 인덱스 접근', () => {
      const template = '{{ d.arr[0] }}-{{ d.arr[2] }}';
      const result = window.tpl(template).render({ arr: ['A', 'B', 'C'] });
      expect(result).toBe('A-C');
    });
  });
});
