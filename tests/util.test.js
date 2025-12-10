/**
 * Util 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/util.js');

describe('Util Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="fixbar"></div>
      <div id="countdown"></div>
      <span id="time"></span>
    `;
  });

  describe('기본 API', () => {
    test('util 객체가 존재함', () => {
      expect(window.util).toBeDefined();
    });

    test('timeAgo 메소드가 존재함', () => {
      expect(typeof window.util.timeAgo).toBe('function');
    });

    test('toDateString 메소드가 존재함', () => {
      expect(typeof window.util.toDateString).toBe('function');
    });

    test('digit 메소드가 존재함', () => {
      expect(typeof window.util.digit).toBe('function');
    });

    test('escape 메소드가 존재함', () => {
      expect(typeof window.util.escape).toBe('function');
    });

    test('unescape 메소드가 존재함', () => {
      expect(typeof window.util.unescape).toBe('function');
    });

    test('countdown 메소드가 존재함', () => {
      expect(typeof window.util.countdown).toBe('function');
    });

    test('fixbar 메소드가 존재함', () => {
      expect(typeof window.util.fixbar).toBe('function');
    });
  });

  describe('timeAgo', () => {
    test('방금 전', () => {
      const now = Date.now();
      const result = window.util.timeAgo(now);
      expect(result).toContain('방금');
    });

    test('분 전', () => {
      const fiveMinAgo = Date.now() - (5 * 60 * 1000);
      const result = window.util.timeAgo(fiveMinAgo);
      expect(result).toContain('분');
    });

    test('시간 전', () => {
      const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
      const result = window.util.timeAgo(twoHoursAgo);
      expect(result).toContain('시간');
    });

    test('타임스탬프 (초 단위)', () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const result = window.util.timeAgo(timestamp);
      expect(result).toBeDefined();
    });
  });

  describe('toDateString', () => {
    test('기본 포맷', () => {
      const date = new Date('2024-01-15');
      const result = window.util.toDateString(date);
      expect(result).toContain('2024');
    });

    test('타임스탬프 변환', () => {
      const timestamp = new Date('2024-06-15').getTime();
      const result = window.util.toDateString(timestamp, 'yyyy-MM-dd');
      expect(result).toBe('2024-06-15');
    });

    test('커스텀 포맷', () => {
      const date = new Date('2024-03-20 14:30:00');
      const result = window.util.toDateString(date, 'yyyy년 MM월 dd일');
      expect(result).toContain('2024년');
    });
  });

  describe('digit', () => {
    test('한 자리 숫자 (0 채움)', () => {
      expect(window.util.digit(5)).toBe('05');
    });

    test('두 자리 숫자', () => {
      expect(window.util.digit(15)).toBe('15');
    });

    test('0', () => {
      expect(window.util.digit(0)).toBe('00');
    });

    test('커스텀 길이', () => {
      expect(window.util.digit(5, 3)).toBe('005');
    });
  });

  describe('escape/unescape', () => {
    test('HTML 이스케이프', () => {
      const html = '<script>alert("xss")</script>';
      const escaped = window.util.escape(html);
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;');
    });

    test('HTML 언이스케이프', () => {
      const escaped = '&lt;div&gt;테스트&lt;/div&gt;';
      const unescaped = window.util.unescape(escaped);
      expect(unescaped).toContain('<div>');
    });

    test('특수 문자 이스케이프', () => {
      const text = 'A & B < C > D "E" \'F\'';
      const escaped = window.util.escape(text);
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
    });

    test('빈 문자열', () => {
      expect(window.util.escape('')).toBe('');
      expect(window.util.unescape('')).toBe('');
    });
  });

  describe('countdown', () => {
    test('카운트다운 반환값', () => {
      const future = Date.now() + 5000;
      
      const timer = window.util.countdown(future, function(d, h, m, s, status) {
        // 콜백
      });
      
      expect(timer).toBeDefined();
      clearInterval(timer);
    });
  });

  describe('fixbar', () => {
    test('고정 바 생성', () => {
      expect(() => {
        window.util.fixbar({
          bar1: true,
          bar2: true
        });
      }).not.toThrow();
    });

    test('콜백 설정', () => {
      expect(() => {
        window.util.fixbar({
          bar1: true,
          click: function(type) {
            console.log(type);
          }
        });
      }).not.toThrow();
    });

    test('배경색 설정', () => {
      expect(() => {
        window.util.fixbar({
          bar1: true,
          bgcolor: '#333'
        });
      }).not.toThrow();
    });

    test('CSS 설정', () => {
      expect(() => {
        window.util.fixbar({
          bar1: true,
          css: { right: 50, bottom: 100 }
        });
      }).not.toThrow();
    });
  });

  describe('timeAgo 확장', () => {
    test('일 전', () => {
      const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
      const result = window.util.timeAgo(twoDaysAgo);
      expect(result).toContain('일');
    });

    test('월 전', () => {
      const twoMonthsAgo = Date.now() - (60 * 24 * 60 * 60 * 1000);
      const result = window.util.timeAgo(twoMonthsAgo);
      expect(result).toBeDefined();
    });

    test('년 전', () => {
      const twoYearsAgo = Date.now() - (2 * 365 * 24 * 60 * 60 * 1000);
      const result = window.util.timeAgo(twoYearsAgo);
      expect(result).toBeDefined();
    });

    test('Date 객체', () => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - 10);
      const result = window.util.timeAgo(date);
      expect(result).toContain('분');
    });
  });

  describe('toDateString 확장', () => {
    test('시간 포함', () => {
      const date = new Date('2024-03-20 14:30:45');
      const result = window.util.toDateString(date, 'yyyy-MM-dd HH:mm:ss');
      expect(result).toContain('14:30:45');
    });

    test('월만', () => {
      const date = new Date('2024-06-15');
      const result = window.util.toDateString(date, 'MM월');
      expect(result).toBe('06월');
    });

    test('일만', () => {
      const date = new Date('2024-06-15');
      const result = window.util.toDateString(date, 'dd일');
      expect(result).toBe('15일');
    });

    test('12시간 형식', () => {
      const date = new Date('2024-03-20 14:30:00');
      const result = window.util.toDateString(date, 'hh:mm');
      expect(result).toBeDefined();
    });
  });

  describe('on', () => {
    test('on 메소드가 존재함', () => {
      expect(typeof window.util.on).toBe('function');
    });
  });

  describe('comma', () => {
    test('천단위 콤마', () => {
      expect(window.util.comma(1234567)).toBe('1,234,567');
    });

    test('소수점 있는 경우', () => {
      expect(window.util.comma(1234.56)).toBe('1,234.56');
    });

    test('null/undefined', () => {
      expect(window.util.comma(null)).toBe('');
      expect(window.util.comma(undefined)).toBe('');
    });
  });

  describe('deepClone', () => {
    test('객체 깊은 복사', () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = window.util.deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.b).not.toBe(obj.b);
    });

    test('배열 깊은 복사', () => {
      const arr = [1, [2, 3], { a: 4 }];
      const clone = window.util.deepClone(arr);
      expect(clone).toEqual(arr);
      expect(clone).not.toBe(arr);
    });

    test('null 반환', () => {
      expect(window.util.deepClone(null)).toBe(null);
    });

    test('기본값 반환', () => {
      expect(window.util.deepClone(123)).toBe(123);
      expect(window.util.deepClone('str')).toBe('str');
    });
  });

  describe('debounce', () => {
    test('디바운스 함수 반환', () => {
      const fn = jest.fn();
      const debounced = window.util.debounce(fn, 100);
      expect(typeof debounced).toBe('function');
    });
  });

  describe('throttle', () => {
    test('쓰로틀 함수 반환', () => {
      const fn = jest.fn();
      const throttled = window.util.throttle(fn, 100);
      expect(typeof throttled).toBe('function');
    });
  });

  describe('parseQuery', () => {
    test('쿼리스트링 파싱', () => {
      const result = window.util.parseQuery('?a=1&b=2');
      expect(result.a).toBe('1');
      expect(result.b).toBe('2');
    });

    test('? 없이', () => {
      const result = window.util.parseQuery('a=1&b=2');
      expect(result.a).toBe('1');
    });

    test('빈 문자열', () => {
      const result = window.util.parseQuery('');
      expect(result).toEqual({});
    });
  });

  describe('toQuery', () => {
    test('쿼리스트링 생성', () => {
      const result = window.util.toQuery({ a: 1, b: 2 });
      expect(result).toContain('a=1');
      expect(result).toContain('b=2');
    });

    test('undefined 값 제외', () => {
      const result = window.util.toQuery({ a: 1, b: undefined });
      expect(result).toBe('a=1');
    });
  });

  describe('uuid', () => {
    test('UUID 생성', () => {
      const uuid = window.util.uuid();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    test('매번 다른 UUID', () => {
      const uuid1 = window.util.uuid();
      const uuid2 = window.util.uuid();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('shortId', () => {
    test('기본 길이 8', () => {
      const id = window.util.shortId();
      expect(id.length).toBe(8);
    });

    test('커스텀 길이', () => {
      const id = window.util.shortId(12);
      expect(id.length).toBe(12);
    });
  });

  describe('isEmpty', () => {
    test('null/undefined', () => {
      expect(window.util.isEmpty(null)).toBe(true);
      expect(window.util.isEmpty(undefined)).toBe(true);
    });

    test('빈 문자열', () => {
      expect(window.util.isEmpty('')).toBe(true);
      expect(window.util.isEmpty('  ')).toBe(true);
    });

    test('빈 배열', () => {
      expect(window.util.isEmpty([])).toBe(true);
    });

    test('빈 객체', () => {
      expect(window.util.isEmpty({})).toBe(true);
    });

    test('값이 있는 경우', () => {
      expect(window.util.isEmpty('test')).toBe(false);
      expect(window.util.isEmpty([1])).toBe(false);
      expect(window.util.isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe('isEmail', () => {
    test('유효한 이메일', () => {
      expect(window.util.isEmail('test@example.com')).toBe(true);
    });

    test('유효하지 않은 이메일', () => {
      expect(window.util.isEmail('invalid')).toBe(false);
      expect(window.util.isEmail('test@')).toBe(false);
    });
  });

  describe('isPhone', () => {
    test('유효한 전화번호', () => {
      expect(window.util.isPhone('010-1234-5678')).toBe(true);
      expect(window.util.isPhone('01012345678')).toBe(true);
    });

    test('유효하지 않은 전화번호', () => {
      expect(window.util.isPhone('12345')).toBe(false);
    });
  });

  describe('scrollTo', () => {
    test('scrollTo 메소드가 존재함', () => {
      expect(typeof window.util.scrollTo).toBe('function');
    });
  });

  describe('쿠키', () => {
    test('setCookie 메소드가 존재함', () => {
      expect(typeof window.util.setCookie).toBe('function');
    });

    test('getCookie 메소드가 존재함', () => {
      expect(typeof window.util.getCookie).toBe('function');
    });

    test('removeCookie 메소드가 존재함', () => {
      expect(typeof window.util.removeCookie).toBe('function');
    });

    test('쿠키 설정/조회/삭제', () => {
      window.util.setCookie('testCookie', 'testValue', 1);
      // jsdom에서는 document.cookie가 제한적으로 작동
      expect(document.cookie).toBeDefined();
      
      window.util.removeCookie('testCookie');
    });

    test('쿠키 만료일 설정', () => {
      expect(() => {
        window.util.setCookie('expireCookie', 'value', 7);
      }).not.toThrow();
    });
  });

  describe('isUrl', () => {
    test('유효한 URL', () => {
      expect(window.util.isUrl('http://example.com')).toBe(true);
      expect(window.util.isUrl('https://example.com/path')).toBe(true);
    });

    test('유효하지 않은 URL', () => {
      expect(window.util.isUrl('invalid')).toBe(false);
      expect(window.util.isUrl('ftp://example.com')).toBe(false);
    });
  });

  describe('stripScripts', () => {
    test('스크립트 태그 제거', () => {
      const html = '<div>안녕<script>alert("xss")</script></div>';
      const result = window.util.stripScripts(html);
      expect(result).not.toContain('<script>');
      expect(result).toContain('<div>안녕</div>');
    });

    test('대소문자 혼합 스크립트 태그', () => {
      const html = '<ScRiPt>alert("xss")</ScRiPt>';
      const result = window.util.stripScripts(html);
      expect(result).not.toContain('alert');
    });

    test('이벤트 핸들러 제거', () => {
      const html = '<div onclick="alert(1)">클릭</div>';
      const result = window.util.stripScripts(html);
      expect(result).not.toContain('onclick');
    });

    test('닫는 태그 없는 스크립트', () => {
      const html = '<div>테스트<script>alert(1)';
      const result = window.util.stripScripts(html);
      expect(result).toBe('<div>테스트');
    });

    test('문자열 아닌 경우', () => {
      expect(window.util.stripScripts(123)).toBe(123);
      expect(window.util.stripScripts(null)).toBe(null);
    });
  });

  describe('sanitize', () => {
    test('허용되지 않은 태그 제거', () => {
      const html = '<div><script>alert(1)</script><b>굵게</b></div>';
      const result = window.util.sanitize(html);
      expect(result).not.toContain('<script>');
      expect(result).toContain('<b>굵게</b>');
    });

    test('이벤트 핸들러 제거', () => {
      const html = '<a href="#" onclick="alert(1)">링크</a>';
      const result = window.util.sanitize(html);
      expect(result).not.toContain('onclick');
    });

    test('javascript: 프로토콜 제거', () => {
      const html = '<a href="javascript:alert(1)">링크</a>';
      const result = window.util.sanitize(html);
      expect(result).not.toContain('javascript:');
    });

    test('커스텀 허용 태그', () => {
      const html = '<div><span>스팬</span><em>강조</em></div>';
      const result = window.util.sanitize(html, {
        allowedTags: ['span']
      });
      expect(result).toContain('<span>');
    });

    test('문자열 아닌 경우', () => {
      expect(window.util.sanitize(123)).toBe(123);
    });
  });

  describe('escapeSql', () => {
    test('SQL 특수문자 이스케이프', () => {
      const sql = "O'Reilly";
      const result = window.util.escapeSql(sql);
      expect(result).toBe("O''Reilly");
    });

    test('백슬래시 이스케이프', () => {
      const sql = "path\\to\\file";
      const result = window.util.escapeSql(sql);
      expect(result).toContain('\\\\');
    });

    test('개행 문자 이스케이프', () => {
      const sql = "line1\nline2";
      const result = window.util.escapeSql(sql);
      expect(result).toContain('\\n');
    });

    test('문자열 아닌 경우', () => {
      expect(window.util.escapeSql(123)).toBe(123);
    });
  });

  describe('escapeRegex', () => {
    test('정규식 특수문자 이스케이프', () => {
      const str = 'a.b*c?d';
      const result = window.util.escapeRegex(str);
      expect(result).toContain('\\.');
      expect(result).toContain('\\*');
      expect(result).toContain('\\?');
    });

    test('대괄호 이스케이프', () => {
      const str = '[test]';
      const result = window.util.escapeRegex(str);
      expect(result).toContain('\\[');
      expect(result).toContain('\\]');
    });

    test('문자열 아닌 경우', () => {
      expect(window.util.escapeRegex(123)).toBe(123);
    });
  });

  describe('safeJsonParse', () => {
    test('유효한 JSON', () => {
      const json = '{"a":1,"b":"test"}';
      const result = window.util.safeJsonParse(json);
      expect(result.a).toBe(1);
      expect(result.b).toBe('test');
    });

    test('유효하지 않은 JSON', () => {
      const invalid = 'not json';
      const result = window.util.safeJsonParse(invalid);
      expect(result).toBe(null);
    });

    test('기본값 지정', () => {
      const invalid = 'not json';
      const result = window.util.safeJsonParse(invalid, {});
      expect(result).toEqual({});
    });

    test('문자열 아닌 경우', () => {
      expect(window.util.safeJsonParse(123, 'default')).toBe('default');
    });
  });

  describe('safeEncodeUri', () => {
    test('URI 인코딩', () => {
      const str = 'hello world';
      const result = window.util.safeEncodeUri(str);
      expect(result).toBe('hello%20world');
    });

    test('특수문자 인코딩', () => {
      const str = "test's value!";
      const result = window.util.safeEncodeUri(str);
      expect(result).not.toContain("'");
      expect(result).not.toContain("!");
    });

    test('문자열 아닌 경우', () => {
      expect(window.util.safeEncodeUri(123)).toBe(123);
    });
  });

  describe('countdown 상세', () => {
    test('서버 시간 사용', () => {
      const future = Date.now() + 3000;
      const serverTime = Date.now();
      
      const timer = window.util.countdown(future, serverTime, function(d, h, m, s, status) {
        // 콜백
      });
      
      expect(timer).toBeDefined();
      clearInterval(timer);
    });

    test('이미 종료된 시간', () => {
      const past = Date.now() - 10000;
      let called = false;
      
      window.util.countdown(past, function(d, h, m, s, status) {
        called = true;
        expect(status).toBe('end');
      });

      expect(called).toBe(true);
    });
  });

  describe('timeAgo onlyDate', () => {
    test('onlyDate=true', () => {
      const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
      const result = window.util.timeAgo(twoWeeksAgo, true);
      expect(result).not.toContain(':');
      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    test('onlyDate=false (기본값)', () => {
      const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
      const result = window.util.timeAgo(twoWeeksAgo, false);
      expect(result).toContain(':');
    });

    test('유효하지 않은 날짜', () => {
      const result = window.util.timeAgo('invalid');
      expect(result).toBe('');
    });
  });

  describe('debounce 실제 동작', () => {
    jest.useFakeTimers();

    test('딜레이 후 호출', () => {
      const fn = jest.fn();
      const debounced = window.util.debounce(fn, 100);
      
      debounced();
      debounced();
      debounced();
      
      expect(fn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      
      expect(fn).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.useRealTimers();
    });
  });

  describe('throttle 실제 동작', () => {
    test('즉시 호출', () => {
      const fn = jest.fn();
      const throttled = window.util.throttle(fn, 100);
      
      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
      
      throttled();
      expect(fn).toHaveBeenCalledTimes(1); // 쓰로틀됨
    });
  });

  describe('on 이벤트 위임', () => {
    test('이벤트 위임', () => {
      document.body.innerHTML = `
        <div id="container">
          <button class="btn">버튼1</button>
          <button class="btn">버튼2</button>
        </div>
      `;

      let clicked = false;
      window.util.on('#container', 'click', '.btn', function(e) {
        clicked = true;
      });

      // 버튼 클릭 시뮬레이션
      const btn = document.querySelector('.btn');
      btn.click();
      
      expect(clicked).toBe(true);
    });
  });

  describe('fixbar 클릭 이벤트', () => {
    test('bar1 클릭', () => {
      let clickedType = null;
      
      window.util.fixbar({
        bar1: true,
        click: function(type) {
          clickedType = type;
        }
      });

      const bar1 = document.querySelector('.cui-fixbar-bar1');
      if(bar1) {
        bar1.click();
        expect(clickedType).toBe('bar1');
      }
    });

    test('bar2 클릭', () => {
      let clickedType = null;
      
      window.util.fixbar({
        bar2: true,
        click: function(type) {
          clickedType = type;
        }
      });

      const bar2 = document.querySelector('.cui-fixbar-bar2');
      if(bar2) {
        bar2.click();
        expect(clickedType).toBe('bar2');
      }
    });

    test('커스텀 bar1 내용', () => {
      window.util.fixbar({
        bar1: '<span>커스텀</span>'
      });

      const bar1 = document.querySelector('.cui-fixbar-bar1');
      expect(bar1.innerHTML).toContain('커스텀');
    });

    test('중복 생성 방지', () => {
      window.util.fixbar({ bar1: true });
      window.util.fixbar({ bar1: true });
      
      const fixbars = document.querySelectorAll('.cui-fixbar');
      expect(fixbars.length).toBe(1);
    });
  });

  describe('scrollTo', () => {
    test('스크롤 애니메이션', () => {
      expect(() => {
        window.util.scrollTo(100, 100);
      }).not.toThrow();
    });

    test('기본 duration', () => {
      expect(() => {
        window.util.scrollTo(0);
      }).not.toThrow();
    });
  });

  describe('countUp', () => {
    test('countUp 메소드가 존재함', () => {
      expect(typeof window.util.countUp).toBe('function');
    });

    test('카운트업 애니메이션', () => {
      document.body.innerHTML = '<span id="counter"></span>';
      
      expect(() => {
        window.util.countUp({
          elem: '#counter',
          start: 0,
          end: 100,
          duration: 100
        });
      }).not.toThrow();
    });

    test('옵션 설정', () => {
      document.body.innerHTML = '<span id="counter2"></span>';
      
      expect(() => {
        window.util.countUp({
          elem: '#counter2',
          start: 0,
          end: 1000,
          decimals: 2,
          separator: ',',
          prefix: '$',
          suffix: ' USD',
          easing: false,
          callback: function() {}
        });
      }).not.toThrow();
    });

    test('요소 없을 때', () => {
      expect(() => {
        window.util.countUp({
          elem: '#nonexistent',
          end: 100
        });
      }).not.toThrow();
    });
  });

  describe('toDateString 추가', () => {
    test('연도 2자리', () => {
      const date = new Date('2024-03-20');
      const result = window.util.toDateString(date, 'yy-MM-dd');
      expect(result).toBe('24-03-20');
    });

    test('월/일 패딩 없이', () => {
      const date = new Date('2024-03-05');
      const result = window.util.toDateString(date, 'M월 d일');
      expect(result).toBe('3월 5일');
    });

    test('시/분/초 패딩 없이', () => {
      const date = new Date('2024-03-20 09:05:03');
      const result = window.util.toDateString(date, 'H:m:s');
      expect(result).toBe('9:5:3');
    });

    test('유효하지 않은 날짜', () => {
      expect(window.util.toDateString('invalid')).toBe('');
      expect(window.util.toDateString(null)).toBe('');
    });
  });

  describe('digit 추가', () => {
    test('다양한 길이', () => {
      expect(window.util.digit(7, 4)).toBe('0007');
      expect(window.util.digit(123, 5)).toBe('00123');
    });
  });

  describe('parseQuery 추가', () => {
    test('인코딩된 값', () => {
      const result = window.util.parseQuery('?name=%ED%85%8C%EC%8A%A4%ED%8A%B8');
      expect(result.name).toBe('테스트');
    });

    test('값 없는 파라미터', () => {
      const result = window.util.parseQuery('?flag=&name=test');
      expect(result.flag).toBe('');
      expect(result.name).toBe('test');
    });
  });

  describe('toQuery 추가', () => {
    test('특수문자 인코딩', () => {
      const result = window.util.toQuery({ name: '테스트', value: 'a&b' });
      expect(result).toContain('%');
    });
  });
});
