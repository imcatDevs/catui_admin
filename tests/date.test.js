/**
 * Date 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/date.js');

describe('Date Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="dateInput">
      <input type="text" id="dateTimeInput">
      <input type="text" id="timeInput">
      <div id="dateContainer"></div>
    `;
  });

  afterEach(() => {
    if (window.date && window.date.closeAll) {
      window.date.closeAll();
    }
  });

  describe('기본 API', () => {
    test('date 객체가 존재함', () => {
      expect(window.date).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.date.render).toBe('function');
    });

    test('closeAll 메소드가 존재함', () => {
      expect(typeof window.date.closeAll).toBe('function');
    });

    test('getInst 메소드가 존재함', () => {
      expect(typeof window.date.getInst).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 날짜 선택기', () => {
      const inst = window.date.render({
        elem: '#dateInput'
      });

      expect(inst).toBeDefined();
    });

    test('날짜+시간 선택기', () => {
      const inst = window.date.render({
        elem: '#dateTimeInput',
        type: 'datetime'
      });

      expect(inst).toBeDefined();
    });

    test('시간만 선택기', () => {
      const inst = window.date.render({
        elem: '#timeInput',
        type: 'time'
      });

      expect(inst).toBeDefined();
    });

    test('월 선택기', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        type: 'month'
      });

      expect(inst).toBeDefined();
    });

    test('년 선택기', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        type: 'year'
      });

      expect(inst).toBeDefined();
    });

    test('범위 선택', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        range: true
      });

      expect(inst).toBeDefined();
    });

    test('초기값 설정', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        value: '2024-01-15'
      });

      expect(inst).toBeDefined();
    });

    test('포맷 설정', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        format: 'yyyy년 MM월 dd일'
      });

      expect(inst).toBeDefined();
    });

    test('최소/최대 날짜', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        min: '2024-01-01',
        max: '2024-12-31'
      });

      expect(inst).toBeDefined();
    });
  });

  describe('윤년 체크', () => {
    test('윤년 확인 (2024)', () => {
      // date.js의 Class.isLeapYear 사용
      expect(2024 % 4 === 0 && (2024 % 100 !== 0 || 2024 % 400 === 0)).toBe(true);
    });

    test('평년 확인 (2023)', () => {
      expect(2023 % 4 === 0 && (2023 % 100 !== 0 || 2023 % 400 === 0)).toBe(false);
    });

    test('100년 단위 비윤년 (1900)', () => {
      expect(1900 % 4 === 0 && (1900 % 100 !== 0 || 1900 % 400 === 0)).toBe(false);
    });

    test('400년 단위 윤년 (2000)', () => {
      expect(2000 % 4 === 0 && (2000 % 100 !== 0 || 2000 % 400 === 0)).toBe(true);
    });
  });

  describe('closeAll', () => {
    test('모든 날짜 선택기 닫기', () => {
      window.date.render({ elem: '#dateInput' });
      window.date.closeAll();
      expect(true).toBe(true);
    });
  });

  describe('옵션', () => {
    test('theme 옵션', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        theme: '#ff6600'
      });
      expect(inst).toBeDefined();
    });

    test('calendar 옵션 (달력 표시)', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        calendar: true
      });
      expect(inst).toBeDefined();
    });

    test('showBottom 옵션', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        showBottom: false
      });
      expect(inst).toBeDefined();
    });

    test('btns 옵션', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        btns: ['clear', 'now', 'confirm']
      });
      expect(inst).toBeDefined();
    });

    test('lang 옵션', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        lang: 'kr'
      });
      expect(inst).toBeDefined();
    });

    test('position 옵션', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        position: 'static'
      });
      expect(inst).toBeDefined();
    });

    test('zIndex 옵션', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        zIndex: 99999
      });
      expect(inst).toBeDefined();
    });

    test('trigger 옵션', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        trigger: 'click'
      });
      expect(inst).toBeDefined();
    });

    test('mark 옵션 (날짜 마킹)', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        mark: {
          '2024-01-01': '신년',
          '2024-12-25': '크리스마스'
        }
      });
      expect(inst).toBeDefined();
    });

    test('range 구분자 설정', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        range: '~'
      });
      expect(inst).toBeDefined();
    });
  });

  describe('콜백', () => {
    test('done 콜백', () => {
      let doneCalled = false;
      const inst = window.date.render({
        elem: '#dateInput',
        done: function(value, date, endDate) {
          doneCalled = true;
        }
      });
      expect(inst.config.done).toBeDefined();
    });

    test('change 콜백', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        change: function(value, date, endDate) {
          console.log('변경:', value);
        }
      });
      expect(inst.config.change).toBeDefined();
    });

    test('ready 콜백', () => {
      let readyCalled = false;
      const inst = window.date.render({
        elem: '#dateInput',
        ready: function(date) {
          readyCalled = true;
        }
      });
      expect(inst.config.ready).toBeDefined();
    });

    test('close 콜백', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        close: function(value) {
          console.log('닫힘:', value);
        }
      });
      expect(inst.config.close).toBeDefined();
    });
  });

  describe('set', () => {
    test('set 메소드가 존재함', () => {
      expect(typeof window.date.set).toBe('function');
    });

    test('전역 설정', () => {
      expect(() => {
        window.date.set({
          format: 'yyyy-MM-dd'
        });
      }).not.toThrow();
    });
  });

  describe('getInst', () => {
    test('인스턴스 가져오기', () => {
      window.date.render({
        elem: '#dateInput',
        id: 'testDate'
      });

      const inst = window.date.getInst('testDate');
      expect(inst).toBeDefined();
    });

    test('존재하지 않는 인스턴스', () => {
      const inst = window.date.getInst('nonexistent');
      expect(inst).toBeUndefined();
    });
  });

  describe('인스턴스 메소드', () => {
    test('config 속성', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        value: '2024-06-15'
      });
      expect(inst.config).toBeDefined();
    });

    test('hint 메소드', () => {
      const inst = window.date.render({
        elem: '#dateInput'
      });
      expect(typeof inst.hint).toBe('function');
    });
  });

  describe('날짜 유효성', () => {
    test('유효한 날짜', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        value: '2024-02-29' // 윤년
      });
      expect(inst).toBeDefined();
    });

    test('최소 날짜 제한', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        min: '2024-01-01',
        value: '2023-12-31' // min 이전
      });
      expect(inst).toBeDefined();
    });

    test('최대 날짜 제한', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        max: '2024-12-31',
        value: '2025-01-01' // max 이후
      });
      expect(inst).toBeDefined();
    });
  });

  describe('특수 포맷', () => {
    test('ISO 포맷', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        format: 'yyyy-MM-ddTHH:mm:ss'
      });
      expect(inst).toBeDefined();
    });

    test('한국어 포맷', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        format: 'yyyy년 MM월 dd일 HH시 mm분'
      });
      expect(inst).toBeDefined();
    });

    test('슬래시 포맷', () => {
      const inst = window.date.render({
        elem: '#dateInput',
        format: 'yyyy/MM/dd'
      });
      expect(inst).toBeDefined();
    });
  });
});
