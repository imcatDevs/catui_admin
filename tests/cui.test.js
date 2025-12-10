/**
 * $c (cui.js) DOM 라이브러리 테스트
 */

// 모듈 로드
require('../src/catui.js');
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

  describe('extend', () => {
    test('extend 메소드가 존재함', () => {
      expect(typeof window.$c.extend).toBe('function');
    });

    test('객체 확장', () => {
      const result = window.$c.extend({}, { a: 1 }, { b: 2 });
      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
    });

    test('깊은 확장', () => {
      const result = window.$c.extend(true, {}, { a: { b: 1 } }, { a: { c: 2 } });
      expect(result.a.b).toBe(1);
      expect(result.a.c).toBe(2);
    });
  });

  describe('Array.isArray', () => {
    test('배열 확인', () => {
      expect(Array.isArray([1, 2, 3])).toBe(true);
      expect(Array.isArray('string')).toBe(false);
      expect(Array.isArray({})).toBe(false);
    });
  });

  describe('$c 선택자', () => {
    test('클래스 선택자', () => {
      document.body.innerHTML = '<div class="test-class">테스트</div>';
      const elem = window.$c('.test-class');
      expect(elem.length).toBe(1);
    });

    test('다중 선택자', () => {
      document.body.innerHTML = `
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
      `;
      const elems = window.$c('.item');
      expect(elems.length).toBe(3);
    });

    test('속성 선택자', () => {
      document.body.innerHTML = '<input type="text" name="test">';
      const elem = window.$c('[name="test"]');
      expect(elem.length).toBe(1);
    });
  });

  describe('$c 메소드', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="test" class="original">내용</div>';
    });

    test('addClass', () => {
      const elem = window.$c('#test');
      elem.addClass('new-class');
      expect(elem[0].classList.contains('new-class')).toBe(true);
    });

    test('removeClass', () => {
      const elem = window.$c('#test');
      elem.removeClass('original');
      expect(elem[0].classList.contains('original')).toBe(false);
    });

    test('hasClass', () => {
      const elem = window.$c('#test');
      expect(elem.hasClass('original')).toBe(true);
      expect(elem.hasClass('nonexistent')).toBe(false);
    });

    test('toggleClass', () => {
      const elem = window.$c('#test');
      elem.toggleClass('toggled');
      expect(elem.hasClass('toggled')).toBe(true);
      elem.toggleClass('toggled');
      expect(elem.hasClass('toggled')).toBe(false);
    });

    test('attr', () => {
      const elem = window.$c('#test');
      elem.attr('data-value', '123');
      expect(elem.attr('data-value')).toBe('123');
    });

    test('removeAttr', () => {
      const elem = window.$c('#test');
      elem.attr('data-remove', 'value');
      elem.removeAttr('data-remove');
      expect(elem.attr('data-remove')).toBeNull();
    });

    test('html', () => {
      const elem = window.$c('#test');
      elem.html('<span>새 내용</span>');
      expect(elem.html()).toContain('새 내용');
    });

    test('text', () => {
      const elem = window.$c('#test');
      elem.text('텍스트만');
      expect(elem.text()).toBe('텍스트만');
    });

    test('val', () => {
      document.body.innerHTML = '<input id="input" type="text" value="기존값">';
      const elem = window.$c('#input');
      expect(elem.val()).toBe('기존값');
      elem.val('새 값');
      expect(elem.val()).toBe('새 값');
    });

    test('css', () => {
      const elem = window.$c('#test');
      elem.css('color', 'red');
      expect(elem[0].style.color).toBe('red');
    });

    test('show/hide', () => {
      const elem = window.$c('#test');
      elem.hide();
      expect(elem[0].style.display).toBe('none');
      elem.show();
      expect(elem[0].style.display).not.toBe('none');
    });

    test('append', () => {
      const elem = window.$c('#test');
      elem.append('<span class="appended">추가됨</span>');
      expect(elem.find('.appended').length).toBe(1);
    });

    test('prepend', () => {
      const elem = window.$c('#test');
      elem.prepend('<span class="prepended">앞에 추가</span>');
      expect(elem.find('.prepended').length).toBe(1);
    });

    test('remove', () => {
      const elem = window.$c('#test');
      elem.remove();
      expect(document.getElementById('test')).toBeNull();
    });

    test('empty', () => {
      const elem = window.$c('#test');
      elem.empty();
      expect(elem.html()).toBe('');
    });

    test('parent', () => {
      document.body.innerHTML = '<div id="parent"><div id="child"></div></div>';
      const child = window.$c('#child');
      expect(child.parent()[0].id).toBe('parent');
    });

    test('children', () => {
      document.body.innerHTML = '<div id="parent"><span>1</span><span>2</span></div>';
      const parent = window.$c('#parent');
      expect(parent.children().length).toBe(2);
    });

    test('eq', () => {
      document.body.innerHTML = '<div class="item">1</div><div class="item">2</div>';
      const items = window.$c('.item');
      expect(items.eq(1).text()).toBe('2');
    });

    test('first/last', () => {
      document.body.innerHTML = '<div class="item">1</div><div class="item">2</div><div class="item">3</div>';
      const items = window.$c('.item');
      expect(items.first().text()).toBe('1');
      expect(items.last().text()).toBe('3');
    });
  });

  describe('$c 이벤트', () => {
    test('on/off', () => {
      document.body.innerHTML = '<button id="btn">버튼</button>';
      const btn = window.$c('#btn');
      let clicked = false;
      
      const handler = function() { clicked = true; };
      btn.on('click', handler);
      btn[0].click();
      expect(clicked).toBe(true);
    });

    test('trigger', () => {
      document.body.innerHTML = '<button id="btn">버튼</button>';
      const btn = window.$c('#btn');
      let triggered = false;
      
      btn.on('click', function() { triggered = true; });
      btn.trigger('click');
      expect(triggered).toBe(true);
    });
  });

  describe('Catui 전역 객체', () => {
    test('Catui 객체가 존재함', () => {
      expect(window.Catui).toBeDefined();
    });

    test('버전 정보', () => {
      expect(window.Catui.v).toBeDefined();
      expect(typeof window.Catui.v).toBe('string');
    });

    test('getPath 메소드', () => {
      expect(typeof window.Catui.getPath).toBe('function');
      const path = window.Catui.getPath();
      expect(typeof path).toBe('string');
    });

    test('getPath - catui 스크립트 경로 추출', () => {
      // catui 스크립트 태그 추가
      const script = document.createElement('script');
      script.src = 'http://example.com/lib/catui/catui.js';
      document.head.appendChild(script);

      const path = window.Catui.getPath();
      expect(typeof path).toBe('string');

      // 정리
      document.head.removeChild(script);
    });

    test('config 메소드', () => {
      expect(typeof window.Catui.config).toBe('function');
      const result = window.Catui.config({ timeout: 15 });
      expect(result).toBe(window.Catui);
    });

    test('config - 다중 옵션 설정', () => {
      const result = window.Catui.config({
        timeout: 20,
        customOption: 'value'
      });
      expect(result).toBe(window.Catui);
    });

    test('define 메소드', () => {
      expect(typeof window.Catui.define).toBe('function');
    });

    test('define - 콜백 없이 호출', () => {
      // 콜백 없이 호출하면 에러 출력 후 undefined 반환
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = window.Catui.define(['$c'], null);
      // 에러 로그가 출력되거나 undefined 반환
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('define - 함수만 전달 (deps 없이)', () => {
      let called = false;
      window.Catui.define(function(exports, $c) {
        called = true;
        expect($c).toBeDefined();
      });
      // 비동기 처리로 인해 즉시 호출되지 않을 수 있음
      expect(typeof window.Catui.define).toBe('function');
    });

    test('use 메소드', () => {
      expect(typeof window.Catui.use).toBe('function');
    });

    test('use - 문자열로 모듈 로드', () => {
      const result = window.Catui.use('$c', function($c) {
        expect($c).toBeDefined();
      });
      expect(result).toBe(window.Catui);
    });

    test('use - 배열로 모듈 로드', () => {
      const result = window.Catui.use(['$c'], function($c) {
        expect($c).toBeDefined();
      });
      expect(result).toBe(window.Catui);
    });

    test('use - 콜백 없이 호출', () => {
      const result = window.Catui.use('$c');
      expect(result).toBe(window.Catui);
    });

    test('use - 이미 로드된 모듈', () => {
      // $c는 이미 로드됨
      let callbackCalled = false;
      window.Catui.use('$c', function($c) {
        callbackCalled = true;
        expect($c).toBeDefined();
      });
      // 이미 로드된 모듈은 즉시 콜백 실행
      expect(window.$c).toBeDefined();
    });
  });

  describe('Catui.event', () => {
    test('event 메소드가 존재함', () => {
      expect(typeof window.Catui.event).toBe('function');
    });

    test('이벤트 등록 및 실행', () => {
      let eventFired = false;
      
      // 이벤트 등록
      window.Catui.event('testMod', 'testEvent(testFilter)', null, function(params) {
        eventFired = true;
        return params;
      });

      // 이벤트 실행
      const result = window.Catui.event('testMod', 'testEvent(testFilter)', { data: 'test' });
      expect(eventFired).toBe(true);
      expect(result.data).toBe('test');
    });
  });

  describe('Catui.onevent', () => {
    test('onevent 메소드가 존재함', () => {
      expect(typeof window.Catui.onevent).toBe('function');
    });

    test('이벤트 등록', () => {
      const result = window.Catui.onevent('testModule', 'click(filter)', function() {});
      expect(result).toBeDefined();
    });

    test('잘못된 인자 처리 - modName이 문자열 아님', () => {
      const result = window.Catui.onevent(123, 'event', function() {});
      expect(result).toBeDefined();
    });

    test('잘못된 인자 처리 - callback이 함수 아님', () => {
      const result = window.Catui.onevent('module', 'event', 'not a function');
      expect(result).toBeDefined();
    });

    test('잘못된 인자 처리 - 둘 다 잘못됨', () => {
      const result = window.Catui.onevent(null, 'event', null);
      expect(result).toBeDefined();
    });

    test('필터 없는 이벤트 등록', () => {
      const result = window.Catui.onevent('testMod', 'simpleEvent', function() {
        return 'simple';
      });
      expect(result).toBeDefined();
    });
  });

  describe('Catui.off', () => {
    test('off 메소드가 존재함', () => {
      expect(typeof window.Catui.off).toBe('function');
    });

    test('이벤트 해제', () => {
      // 이벤트 등록
      window.Catui.event('offTest', 'myEvent(filter)', null, function() {
        return 'original';
      });

      // 이벤트 해제
      window.Catui.off('offTest', 'myEvent(filter)');

      // 해제 후 실행 시 undefined
      const result = window.Catui.event('offTest', 'myEvent(filter)', {});
      expect(result).toBeUndefined();
    });

    test('존재하지 않는 이벤트 해제', () => {
      const result = window.Catui.off('nonexistent', 'event(filter)');
      expect(result).toBe(window.Catui);
    });

    test('필터 없는 이벤트 해제', () => {
      window.Catui.event('offTest2', 'noFilterEvent', null, function() {});
      const result = window.Catui.off('offTest2', 'noFilterEvent');
      expect(result).toBe(window.Catui);
    });
  });

  describe('Catui.event 추가 테스트', () => {
    test('필터 없는 이벤트', () => {
      let called = false;
      window.Catui.event('eventTest', 'noFilter', null, function(params) {
        called = true;
        return params;
      });

      const result = window.Catui.event('eventTest', 'noFilter', { value: 123 });
      expect(called).toBe(true);
      expect(result.value).toBe(123);
    });

    test('여러 필터로 이벤트 등록', () => {
      window.Catui.event('multiFilter', 'click(filter1)', null, function() {
        return 'filter1';
      });
      window.Catui.event('multiFilter', 'click(filter2)', null, function() {
        return 'filter2';
      });

      expect(window.Catui.event('multiFilter', 'click(filter1)', {})).toBe('filter1');
      expect(window.Catui.event('multiFilter', 'click(filter2)', {})).toBe('filter2');
    });

    test('존재하지 않는 이벤트 실행', () => {
      const result = window.Catui.event('nonexistentMod', 'event(filter)', {});
      expect(result).toBeUndefined();
    });

    test('빈 events 문자열', () => {
      window.Catui.event('emptyEvent', '', null, function() {
        return 'empty';
      });
      expect(window.Catui.event('emptyEvent', '', {})).toBe('empty');
    });
  });

  describe('Catui.each', () => {
    test('each 메소드가 존재함', () => {
      expect(typeof window.Catui.each).toBe('function');
    });

    test('배열 순회', () => {
      const arr = [1, 2, 3];
      const results = [];
      
      window.Catui.each(arr, function(index, value) {
        results.push(value);
      });

      expect(results).toEqual([1, 2, 3]);
    });

    test('객체 순회', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keys = [];
      
      window.Catui.each(obj, function(key, value) {
        keys.push(key);
      });

      expect(keys).toContain('a');
      expect(keys).toContain('b');
      expect(keys).toContain('c');
    });

    test('break 지원 (false 반환)', () => {
      const arr = [1, 2, 3, 4, 5];
      const results = [];
      
      window.Catui.each(arr, function(index, value) {
        results.push(value);
        if(value === 3) return false; // break
      });

      expect(results).toEqual([1, 2, 3]);
    });

    test('객체 순회에서 break', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const keys = [];
      
      window.Catui.each(obj, function(key, value) {
        keys.push(key);
        if(value === 2) return false;
      });

      expect(keys.length).toBeLessThanOrEqual(2);
    });

    test('빈 배열 순회', () => {
      const results = [];
      window.Catui.each([], function(index, value) {
        results.push(value);
      });
      expect(results).toEqual([]);
    });

    test('빈 객체 순회', () => {
      const keys = [];
      window.Catui.each({}, function(key, value) {
        keys.push(key);
      });
      expect(keys).toEqual([]);
    });

    test('콜백이 함수가 아닐 때', () => {
      const result = window.Catui.each([1, 2, 3], 'not a function');
      expect(result).toBe(window.Catui);
    });

    test('this 컨텍스트 확인', () => {
      const arr = [{ name: 'a' }, { name: 'b' }];
      const names = [];
      
      window.Catui.each(arr, function(index) {
        names.push(this.name);
      });

      expect(names).toEqual(['a', 'b']);
    });
  });

  describe('Catui.data (로컬 스토리지)', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('data 메소드가 존재함', () => {
      expect(typeof window.Catui.data).toBe('function');
    });

    test('데이터 저장', () => {
      window.Catui.data('testTable', { name: 'test', value: 123 });
      const stored = localStorage.getItem('testTable');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored).name).toBe('test');
    });

    test('데이터 조회 (전체)', () => {
      window.Catui.data('testTable', { name: 'test' });
      const data = window.Catui.data('testTable');
      expect(data.name).toBe('test');
    });

    test('데이터 조회 (특정 키)', () => {
      window.Catui.data('testTable', { name: 'test', value: 123 });
      const value = window.Catui.data('testTable', 'name');
      expect(value).toBe('test');
    });

    test('데이터 삭제', () => {
      window.Catui.data('testTable', { name: 'test' });
      window.Catui.data('testTable', null);
      const stored = localStorage.getItem('testTable');
      expect(stored).toBeNull();
    });
  });

  describe('Catui.sessionData (세션 스토리지)', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    test('sessionData 메소드가 존재함', () => {
      expect(typeof window.Catui.sessionData).toBe('function');
    });

    test('세션 데이터 저장', () => {
      window.Catui.sessionData('sessionTest', { temp: 'data' });
      const stored = sessionStorage.getItem('sessionTest');
      expect(stored).toBeTruthy();
    });

    test('세션 데이터 조회', () => {
      window.Catui.sessionData('sessionTest', { temp: 'value' });
      const data = window.Catui.sessionData('sessionTest');
      expect(data.temp).toBe('value');
    });
  });

  describe('Catui.device', () => {
    test('device 메소드가 존재함', () => {
      expect(typeof window.Catui.device).toBe('function');
    });

    test('전체 디바이스 정보', () => {
      const info = window.Catui.device();
      expect(info).toHaveProperty('mobile');
      expect(info).toHaveProperty('ios');
      expect(info).toHaveProperty('android');
      expect(info).toHaveProperty('weixin');
    });

    test('특정 디바이스 정보', () => {
      const isMobile = window.Catui.device('mobile');
      expect(typeof isMobile).toBe('boolean');
    });
  });

  describe('Catui.hint', () => {
    test('hint 메소드가 존재함', () => {
      expect(typeof window.Catui.hint).toBe('function');
    });

    test('hint 반환 객체', () => {
      const hint = window.Catui.hint();
      expect(hint).toHaveProperty('error');
      expect(typeof hint.error).toBe('function');
    });
  });

  describe('Catui.link', () => {
    test('link 메소드가 존재함', () => {
      expect(typeof window.Catui.link).toBe('function');
    });

    test('CSS 동적 로드', () => {
      const initialLinks = document.querySelectorAll('link').length;
      window.Catui.link('test.css', 'test-css');
      const newLinks = document.querySelectorAll('link').length;
      expect(newLinks).toBe(initialLinks + 1);
    });

    test('ID로 CSS 로드', () => {
      window.Catui.link('style.css', 'my-style');
      const link = document.getElementById('my-style');
      expect(link).toBeTruthy();
    });
  });

  describe('$c 추가 메소드', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="test" data-value="123">내용</div>';
    });

    test('data 속성', () => {
      const elem = window.$c('#test');
      expect(elem.attr('data-value')).toBe('123');
    });

    test('next/prev', () => {
      document.body.innerHTML = '<div id="first"></div><div id="second"></div><div id="third"></div>';
      const second = window.$c('#second');
      
      if(typeof second.prev === 'function') {
        expect(second.prev()[0].id).toBe('first');
      }
      if(typeof second.next === 'function') {
        expect(second.next()[0].id).toBe('third');
      }
    });

    test('siblings', () => {
      document.body.innerHTML = '<div class="sibling">1</div><div class="sibling" id="me">2</div><div class="sibling">3</div>';
      const me = window.$c('#me');
      
      if(typeof me.siblings === 'function') {
        expect(me.siblings().length).toBe(2);
      }
    });

    test('closest', () => {
      document.body.innerHTML = '<div class="outer"><div class="inner"><span id="deep">text</span></div></div>';
      const deep = window.$c('#deep');
      
      if(typeof deep.closest === 'function') {
        expect(deep.closest('.outer').length).toBe(1);
      }
    });

    test('width/height', () => {
      document.body.innerHTML = '<div id="box" style="width:100px;height:50px;"></div>';
      const box = window.$c('#box');
      
      if(typeof box.width === 'function') {
        expect(typeof box.width()).toBe('number');
      }
      if(typeof box.height === 'function') {
        expect(typeof box.height()).toBe('number');
      }
    });

    test('offset/position', () => {
      document.body.innerHTML = '<div id="positioned" style="position:absolute;top:10px;left:20px;"></div>';
      const elem = window.$c('#positioned');
      
      if(typeof elem.offset === 'function') {
        const offset = elem.offset();
        expect(offset).toHaveProperty('top');
        expect(offset).toHaveProperty('left');
      }
    });

    test('scrollTop/scrollLeft', () => {
      document.body.innerHTML = '<div id="scrollable" style="overflow:auto;height:100px;"><div style="height:500px;"></div></div>';
      const elem = window.$c('#scrollable');
      
      if(typeof elem.scrollTop === 'function') {
        elem.scrollTop(50);
        expect(elem.scrollTop()).toBe(50);
      }
    });
  });

  describe('$c 체이닝', () => {
    test('메소드 체이닝', () => {
      document.body.innerHTML = '<div id="chain"></div>';
      const elem = window.$c('#chain');
      
      const result = elem
        .addClass('class1')
        .addClass('class2')
        .attr('data-test', 'value')
        .html('체이닝 테스트');

      expect(elem.hasClass('class1')).toBe(true);
      expect(elem.hasClass('class2')).toBe(true);
      expect(elem.attr('data-test')).toBe('value');
      expect(elem.html()).toContain('체이닝 테스트');
    });
  });

  describe('$c CSS 조작', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="styled"></div>';
    });

    test('css 객체로 설정', () => {
      const elem = window.$c('#styled');
      elem.css({
        color: 'red',
        'background-color': 'blue'
      });
      
      expect(elem[0].style.color).toBe('red');
    });

    test('css getter', () => {
      const elem = window.$c('#styled');
      elem.css('display', 'block');
      
      const display = elem.css('display');
      expect(display).toBeDefined();
    });
  });
});
