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
    test('카운트다운 시작', (done) => {
      const future = Date.now() + 5000; // 5초 후
      
      let called = false;
      window.util.countdown(future, function(date, timer) {
        if (!called) {
          called = true;
          expect(date).toBeDefined();
          clearInterval(timer);
          done();
        }
      });
    }, 10000);
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

  describe('batKey', () => {
    test('batKey 메소드가 존재함', () => {
      expect(typeof window.util.batKey).toBe('function');
    });

    test('랜덤 키 생성', () => {
      const key = window.util.batKey();
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });
  });

  describe('event', () => {
    test('event 메소드가 존재함', () => {
      expect(typeof window.util.event).toBe('function');
    });

    test('이벤트 바인딩', () => {
      document.body.innerHTML = '<div id="eventTest"><span>클릭</span></div>';
      
      expect(() => {
        window.util.event('click', {
          test: function() {
            return true;
          }
        });
      }).not.toThrow();
    });
  });

  describe('openWin', () => {
    test('openWin 메소드가 존재함', () => {
      expect(typeof window.util.openWin).toBe('function');
    });
  });

  describe('set', () => {
    test('set 메소드가 존재함', () => {
      expect(typeof window.util.set).toBe('function');
    });

    test('전역 설정', () => {
      expect(() => {
        window.util.set({
          fixbar: { bar1: false }
        });
      }).not.toThrow();
    });
  });

  describe('on', () => {
    test('on 메소드가 존재함', () => {
      expect(typeof window.util.on).toBe('function');
    });

    test('이벤트 등록', () => {
      const result = window.util.on('click(test)', function() {});
      expect(result).toBeDefined();
    });
  });
});
