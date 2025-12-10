/**
 * Catui 코어 모듈 테스트
 */

require('../src/catui.js');

describe('Catui Core', () => {
  
  describe('기본 객체', () => {
    test('Catui 객체가 존재함', () => {
      expect(window.Catui).toBeDefined();
    });

    test('v 버전 정보가 존재함', () => {
      expect(window.Catui.v).toBeDefined();
    });

    test('버전이 1.0.0', () => {
      expect(window.Catui.v).toBe('1.0.0');
    });
  });

  describe('config', () => {
    test('config 메소드가 존재함', () => {
      expect(typeof window.Catui.config).toBe('function');
    });

    test('전역 설정', () => {
      const result = window.Catui.config({
        base: '/catui/',
        timeout: 15
      });
      expect(result).toBe(window.Catui);
    });

    test('빈 옵션으로 설정', () => {
      const result = window.Catui.config();
      expect(result).toBe(window.Catui);
    });
  });

  describe('define', () => {
    test('define 메소드가 존재함', () => {
      expect(typeof window.Catui.define).toBe('function');
    });

    test('콜백 없이 호출 시 에러', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      window.Catui.define(['$c']);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('함수만 전달 (deps 생략)', () => {
      expect(() => {
        window.Catui.define(function(exports) {
          exports('testModule1', { name: 'test1' });
        });
      }).not.toThrow();
    });

    test('deps와 콜백 모두 전달', () => {
      expect(() => {
        window.Catui.define(['$c'], function(exports, $c) {
          exports('testModule2', { name: 'test2' });
        });
      }).not.toThrow();
    });
  });

  describe('use', () => {
    test('use 메소드가 존재함', () => {
      expect(typeof window.Catui.use).toBe('function');
    });

    test('use 호출 (빈 배열)', () => {
      const result = window.Catui.use([]);
      expect(result).toBe(window.Catui);
    });

    test('use 호출 (문자열)', () => {
      const result = window.Catui.use('$c');
      expect(result).toBe(window.Catui);
    });

    test('use 호출 (콜백 없이)', () => {
      const result = window.Catui.use(['$c'], null);
      expect(result).toBe(window.Catui);
    });
  });

  describe('each', () => {
    test('each 메소드가 존재함', () => {
      expect(typeof window.Catui.each).toBe('function');
    });

    test('배열 순회', () => {
      const results = [];
      window.Catui.each([1, 2, 3], function(index, item) {
        results.push(item);
      });
      expect(results).toEqual([1, 2, 3]);
    });

    test('객체 순회', () => {
      const keys = [];
      window.Catui.each({ a: 1, b: 2 }, function(key, value) {
        keys.push(key);
      });
      expect(keys).toContain('a');
      expect(keys).toContain('b');
    });

    test('콜백 없이 호출', () => {
      const result = window.Catui.each([1, 2, 3]);
      expect(result).toBe(window.Catui);
    });

    test('break 조건', () => {
      const results = [];
      window.Catui.each([1, 2, 3, 4, 5], function(index, item) {
        results.push(item);
        if (item === 3) return false; // break
      });
      expect(results).toEqual([1, 2, 3]);
    });

    test('객체 break 조건', () => {
      const keys = [];
      window.Catui.each({ a: 1, b: 2, c: 3 }, function(key, value) {
        keys.push(key);
        if (key === 'b') return false;
      });
      expect(keys.length).toBeLessThanOrEqual(2);
    });
  });

  describe('event', () => {
    test('event 메소드가 존재함', () => {
      expect(typeof window.Catui.event).toBe('function');
    });

    test('이벤트 등록', () => {
      let called = false;
      window.Catui.event('testMod', 'testEvent(filter1)', null, function(data) {
        called = true;
      });
      expect(called).toBe(false); // 등록만 함
    });

    test('이벤트 실행', () => {
      let receivedData = null;
      
      // 이벤트 등록
      window.Catui.event('testMod2', 'click(btn1)', null, function(data) {
        receivedData = data;
        return 'result';
      });
      
      // 이벤트 실행
      const result = window.Catui.event('testMod2', 'click(btn1)', { id: 123 });
      expect(receivedData).toEqual({ id: 123 });
      expect(result).toBe('result');
    });

    test('존재하지 않는 이벤트 실행', () => {
      const result = window.Catui.event('nonexistent', 'click(btn)', { id: 1 });
      expect(result).toBeUndefined();
    });
  });

  describe('onevent', () => {
    test('onevent 메소드가 존재함', () => {
      expect(typeof window.Catui.onevent).toBe('function');
    });

    test('onevent로 이벤트 등록', () => {
      const result = window.Catui.onevent('table', 'row(test)', function(obj) {
        return obj;
      });
      expect(result).toBeDefined();
    });

    test('잘못된 인자로 호출', () => {
      const result = window.Catui.onevent(123, 'event', function() {});
      expect(result).toBe(window.Catui);
    });

    test('콜백 없이 호출', () => {
      const result = window.Catui.onevent('mod', 'event', null);
      expect(result).toBe(window.Catui);
    });
  });

  describe('off', () => {
    test('off 메소드가 존재함', () => {
      expect(typeof window.Catui.off).toBe('function');
    });

    test('이벤트 해제', () => {
      // 이벤트 등록
      window.Catui.event('offTest', 'click(btn)', null, function() {});
      
      // 이벤트 해제
      const result = window.Catui.off('offTest', 'click(btn)');
      expect(result).toBe(window.Catui);
    });

    test('존재하지 않는 이벤트 해제', () => {
      const result = window.Catui.off('nonexistent', 'event');
      expect(result).toBe(window.Catui);
    });
  });

  describe('data (localStorage)', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('data 메소드가 존재함', () => {
      expect(typeof window.Catui.data).toBe('function');
    });

    test('데이터 저장', () => {
      window.Catui.data('testTable', { key: 'value' });
      const stored = localStorage.getItem('testTable');
      expect(JSON.parse(stored)).toEqual({ key: 'value' });
    });

    test('데이터 가져오기 (전체)', () => {
      window.Catui.data('testTable2', { a: 1, b: 2 });
      const data = window.Catui.data('testTable2');
      expect(data).toEqual({ a: 1, b: 2 });
    });

    test('데이터 가져오기 (특정 키)', () => {
      window.Catui.data('testTable3', { name: 'test', age: 20 });
      const name = window.Catui.data('testTable3', 'name');
      expect(name).toBe('test');
    });

    test('데이터 삭제', () => {
      window.Catui.data('deleteTest', { data: 'toDelete' });
      window.Catui.data('deleteTest', null);
      expect(localStorage.getItem('deleteTest')).toBeNull();
    });

    test('기본 테이블명', () => {
      window.Catui.data(undefined, { default: true });
      const stored = localStorage.getItem('catui');
      expect(JSON.parse(stored)).toEqual({ default: true });
    });
  });

  describe('sessionData (sessionStorage)', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    test('sessionData 메소드가 존재함', () => {
      expect(typeof window.Catui.sessionData).toBe('function');
    });

    test('세션 데이터 저장', () => {
      window.Catui.sessionData('sessionTest', { session: true });
      const stored = sessionStorage.getItem('sessionTest');
      expect(JSON.parse(stored)).toEqual({ session: true });
    });

    test('세션 데이터 가져오기', () => {
      window.Catui.sessionData('sessionTest2', { temp: 'data' });
      const data = window.Catui.sessionData('sessionTest2');
      expect(data.temp).toBe('data');
    });
  });

  describe('device', () => {
    test('device 메소드가 존재함', () => {
      expect(typeof window.Catui.device).toBe('function');
    });

    test('디바이스 정보 객체 반환', () => {
      const info = window.Catui.device();
      expect(info).toHaveProperty('mobile');
      expect(info).toHaveProperty('ios');
      expect(info).toHaveProperty('android');
      expect(info).toHaveProperty('weixin');
    });

    test('특정 키로 조회', () => {
      const isMobile = window.Catui.device('mobile');
      expect(typeof isMobile).toBe('boolean');
    });

    test('ios 확인', () => {
      const isIos = window.Catui.device('ios');
      expect(typeof isIos).toBe('boolean');
    });

    test('android 확인', () => {
      const isAndroid = window.Catui.device('android');
      expect(typeof isAndroid).toBe('boolean');
    });

    test('weixin 확인', () => {
      const isWeixin = window.Catui.device('weixin');
      expect(typeof isWeixin).toBe('boolean');
    });
  });

  describe('hint', () => {
    test('hint 메소드가 존재함', () => {
      expect(typeof window.Catui.hint).toBe('function');
    });

    test('hint 반환값에 error 존재', () => {
      const hint = window.Catui.hint();
      expect(typeof hint.error).toBe('function');
    });

    test('error 호출', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const hint = window.Catui.hint();
      hint.error('테스트 에러');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('link (CSS 동적 로드)', () => {
    test('link 메소드가 존재함', () => {
      expect(typeof window.Catui.link).toBe('function');
    });

    test('CSS 링크 추가', () => {
      const result = window.Catui.link('/test.css', 'test-css');
      expect(result).toBe(window.Catui);
      
      const link = document.getElementById('test-css');
      expect(link).toBeTruthy();
    });

    test('콜백과 함께 추가', () => {
      let loaded = false;
      window.Catui.link('/test2.css', function() {
        loaded = true;
      }, 'test-css-2');
      
      const link = document.getElementById('test-css-2');
      expect(link).toBeTruthy();
    });
  });

  describe('getPath', () => {
    test('getPath 메소드가 존재함', () => {
      expect(typeof window.Catui.getPath).toBe('function');
    });

    test('경로 반환', () => {
      const path = window.Catui.getPath();
      expect(typeof path).toBe('string');
    });
  });
});
