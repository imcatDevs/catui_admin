/**
 * $c (cui.js) DOM 라이브러리 테스트
 */

// 모듈 로드
require('../src/modules/cui.js');

describe('$c DOM Library', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test" class="container">
        <p class="text">Hello</p>
        <p class="text">World</p>
        <input type="text" id="input" value="test">
        <button id="btn" data-id="123">Click</button>
      </div>
    `;
  });

  describe('선택자', () => {
    test('ID 선택자', () => {
      const elem = $c('#test');
      expect(elem.length).toBe(1);
      expect(elem[0].id).toBe('test');
    });

    test('클래스 선택자', () => {
      const elems = $c('.text');
      expect(elems.length).toBe(2);
    });

    test('존재하지 않는 요소', () => {
      const elem = $c('#nonexistent');
      expect(elem.length).toBe(0);
    });

    test('HTML 문자열로 요소 생성', () => {
      const elem = $c('<div class="new">New Element</div>');
      expect(elem.length).toBe(1);
      expect(elem[0].className).toBe('new');
    });
  });

  describe('클래스 조작', () => {
    test('addClass', () => {
      const elem = $c('#test');
      elem.addClass('active');
      expect(elem[0].classList.contains('active')).toBe(true);
    });

    test('removeClass', () => {
      const elem = $c('#test');
      elem.addClass('active').removeClass('active');
      expect(elem[0].classList.contains('active')).toBe(false);
    });

    test('hasClass', () => {
      const elem = $c('#test');
      expect(elem.hasClass('container')).toBe(true);
      expect(elem.hasClass('nonexistent')).toBe(false);
    });

    test('toggleClass', () => {
      const elem = $c('#test');
      elem.toggleClass('toggled');
      expect(elem.hasClass('toggled')).toBe(true);
      elem.toggleClass('toggled');
      expect(elem.hasClass('toggled')).toBe(false);
    });
  });

  describe('속성 조작', () => {
    test('attr getter', () => {
      const elem = $c('#btn');
      expect(elem.attr('data-id')).toBe('123');
    });

    test('attr setter', () => {
      const elem = $c('#btn');
      elem.attr('data-name', 'test');
      expect(elem.attr('data-name')).toBe('test');
    });

    test('val getter', () => {
      const elem = $c('#input');
      expect(elem.val()).toBe('test');
    });

    test('val setter', () => {
      const elem = $c('#input');
      elem.val('new value');
      expect(elem.val()).toBe('new value');
    });
  });

  describe('콘텐츠 조작', () => {
    test('html getter', () => {
      const elem = $c('.text').eq(0);
      expect(elem.html()).toBe('Hello');
    });

    test('html setter', () => {
      const elem = $c('.text').eq(0);
      elem.html('<strong>Bold</strong>');
      expect(elem[0].innerHTML).toBe('<strong>Bold</strong>');
    });

    test('text getter', () => {
      const elem = $c('.text').eq(0);
      expect(elem.text()).toBe('Hello');
    });

    test('text setter', () => {
      const elem = $c('.text').eq(0);
      elem.text('New Text');
      expect(elem.text()).toBe('New Text');
    });
  });

  describe('DOM 조작', () => {
    test('append', () => {
      const elem = $c('#test');
      elem.append('<span class="appended">Appended</span>');
      expect(elem.find('.appended').length).toBe(1);
    });

    test('prepend', () => {
      const elem = $c('#test');
      elem.prepend('<span class="prepended">Prepended</span>');
      expect(elem[0].firstElementChild.className).toBe('prepended');
    });

    test('remove', () => {
      const elem = $c('#btn');
      elem.remove();
      expect($c('#btn').length).toBe(0);
    });
  });

  describe('탐색', () => {
    test('find', () => {
      const container = $c('#test');
      const texts = container.find('.text');
      expect(texts.length).toBe(2);
    });

    test('parent', () => {
      const text = $c('.text').eq(0);
      const parent = text.parent();
      expect(parent[0].id).toBe('test');
    });

    test('eq', () => {
      const texts = $c('.text');
      expect(texts.eq(1).text()).toBe('World');
    });
  });

  describe('이벤트', () => {
    test('on/trigger click', () => {
      const btn = $c('#btn');
      let clicked = false;
      
      btn.on('click', () => {
        clicked = true;
      });
      
      btn[0].click();
      expect(clicked).toBe(true);
    });
  });

  describe('유틸리티', () => {
    test('$c.extend', () => {
      const result = $c.extend({}, { a: 1 }, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    test('$c.each (배열)', () => {
      const arr = [1, 2, 3];
      const results = [];
      
      $c.each(arr, (i, item) => {
        results.push(item);
      });
      
      expect(results).toEqual([1, 2, 3]);
    });

    test('$c.each (객체)', () => {
      const obj = { a: 1, b: 2 };
      const keys = [];
      
      $c.each(obj, (key, value) => {
        keys.push(key);
      });
      
      expect(keys).toEqual(['a', 'b']);
    });
  });
});
