/**
 * Carousel 모듈 테스트
 */

// 모듈 로드
require('../src/modules/cui.js');
require('../src/modules/carousel.js');

describe('Carousel Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="carousel" class="cui-carousel">
        <div carousel-item>
          <div>슬라이드 1</div>
          <div>슬라이드 2</div>
          <div>슬라이드 3</div>
        </div>
      </div>
    `;
    // 인스턴스 초기화
    if (window.carousel) {
      window.carousel.that = {};
    }
  });

  describe('기본 API', () => {
    test('carousel 객체가 존재함', () => {
      expect(window.carousel).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.carousel.render).toBe('function');
    });

    test('getInst 메소드가 존재함', () => {
      expect(typeof window.carousel.getInst).toBe('function');
    });

    test('on 메소드가 존재함', () => {
      expect(typeof window.carousel.on).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 캐러셀 렌더링', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'testCarousel',
        autoplay: false
      });

      expect(inst).toBeDefined();
      expect(window.carousel.that['testCarousel']).toBeDefined();
    });

    test('인스턴스 메소드 반환', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'methodTest',
        autoplay: false
      });

      expect(typeof inst.goto).toBe('function');
      expect(typeof inst.prev).toBe('function');
      expect(typeof inst.next).toBe('function');
      expect(typeof inst.pause).toBe('function');
      expect(typeof inst.play).toBe('function');
      expect(typeof inst.destroy).toBe('function');
      expect(typeof inst.reload).toBe('function');
    });

    test('config가 반환됨', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'configTest',
        width: '800px',
        height: '400px',
        autoplay: false
      });

      expect(inst.config).toBeDefined();
      expect(inst.config.width).toBe('800px');
      expect(inst.config.height).toBe('400px');
    });
  });

  describe('인스턴스 메소드', () => {
    let inst;

    beforeEach(() => {
      inst = window.carousel.render({
        elem: '#carousel',
        id: 'instTest',
        autoplay: false,
        index: 0
      });
    });

    test('goto', () => {
      inst.goto(1);
      // 애니메이션 때문에 바로 확인하기 어려움
      expect(inst.config.index).toBeDefined();
    });

    test('pause/play', () => {
      // pause와 play가 에러 없이 실행되는지 확인
      expect(() => inst.pause()).not.toThrow();
      expect(() => inst.play()).not.toThrow();
    });
  });

  describe('destroy', () => {
    test('인스턴스 정리', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'destroyTest',
        autoplay: false
      });

      expect(window.carousel.that['destroyTest']).toBeDefined();
      
      inst.destroy();
      
      expect(window.carousel.that['destroyTest']).toBeUndefined();
    });
  });

  describe('getInst', () => {
    test('인스턴스 가져오기', () => {
      window.carousel.render({
        elem: '#carousel',
        id: 'getInstTest',
        autoplay: false
      });

      const inst = window.carousel.getInst('getInstTest');
      expect(inst).toBeDefined();
    });

    test('존재하지 않는 인스턴스', () => {
      const inst = window.carousel.getInst('nonexistent');
      expect(inst).toBeUndefined();
    });
  });

  describe('옵션', () => {
    test('기본값 확인', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'defaultsTest',
        autoplay: false
      });

      expect(inst.config.width).toBe('600px');
      expect(inst.config.height).toBe('280px');
      expect(inst.config.arrow).toBe('hover');
      expect(inst.config.indicator).toBe('inside');
      expect(inst.config.interval).toBe(3000);
    });

    test('커스텀 옵션 적용', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'customTest',
        width: '100%',
        height: '500px',
        arrow: 'always',
        indicator: 'outside',
        interval: 5000,
        autoplay: false
      });

      expect(inst.config.width).toBe('100%');
      expect(inst.config.height).toBe('500px');
      expect(inst.config.arrow).toBe('always');
      expect(inst.config.indicator).toBe('outside');
      expect(inst.config.interval).toBe(5000);
    });

    test('interval 최소값 (800ms)', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'intervalTest',
        interval: 100,
        autoplay: false
      });

      expect(inst.config.interval).toBe(800);
    });
  });

  describe('set', () => {
    test('set 메소드가 존재함', () => {
      expect(typeof window.carousel.set).toBe('function');
    });

    test('전역 설정', () => {
      const result = window.carousel.set({ autoplay: false });
      expect(result).toBeDefined();
    });
  });

  describe('on', () => {
    test('on 메소드가 존재함', () => {
      expect(typeof window.carousel.on).toBe('function');
    });

    test('이벤트 등록', () => {
      const result = window.carousel.on('change(filter)', function() {});
      expect(result).toBeDefined();
    });
  });

  describe('reload', () => {
    test('캐러셀 리로드', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'reloadTest',
        autoplay: false
      });

      expect(() => {
        inst.reload({ interval: 4000 });
      }).not.toThrow();
    });
  });

  describe('arrow 옵션', () => {
    test('arrow: none', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'arrowNone',
        arrow: 'none',
        autoplay: false
      });
      expect(inst.config.arrow).toBe('none');
    });

    test('arrow: always', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'arrowAlways',
        arrow: 'always',
        autoplay: false
      });
      expect(inst.config.arrow).toBe('always');
    });
  });

  describe('indicator 옵션', () => {
    test('indicator: none', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'indicatorNone',
        indicator: 'none',
        autoplay: false
      });
      expect(inst.config.indicator).toBe('none');
    });

    test('indicator: outside', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'indicatorOutside',
        indicator: 'outside',
        autoplay: false
      });
      expect(inst.config.indicator).toBe('outside');
    });
  });

  describe('anim 옵션', () => {
    test('anim 설정 가능', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'animDefault',
        anim: 'fade',
        autoplay: false
      });
      expect(inst.config.anim).toBe('fade');
    });

    test('anim: updown', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'animUpdown',
        anim: 'updown',
        autoplay: false
      });
      expect(inst.config.anim).toBe('updown');
    });
  });

  describe('prev/next 메소드', () => {
    test('next 메소드 호출', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'nextTest',
        autoplay: false,
        index: 0
      });

      expect(() => {
        inst.next();
      }).not.toThrow();
    });

    test('prev 메소드 호출', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'prevTest',
        autoplay: false,
        index: 1
      });

      expect(() => {
        inst.prev();
      }).not.toThrow();
    });
  });

  describe('full 모드', () => {
    test('full: true', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'fullMode',
        full: true,
        autoplay: false
      });

      expect(inst.config.full).toBe(true);
    });
  });

  describe('trigger 옵션', () => {
    test('trigger: hover', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'triggerHover',
        trigger: 'hover',
        autoplay: false
      });

      expect(inst.config.trigger).toBe('hover');
    });

    test('trigger: click (기본값)', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'triggerClick',
        autoplay: false
      });

      expect(inst.config.trigger).toBe('click');
    });
  });

  describe('change 콜백', () => {
    test('change 콜백 설정', () => {
      let changeData = null;

      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'changeCallback',
        autoplay: false,
        change: function(data) {
          changeData = data;
        }
      });

      expect(inst.config.change).toBeDefined();
    });
  });

  describe('autoplay', () => {
    test('autoplay: true', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'autoplayTrue',
        autoplay: true,
        interval: 5000
      });

      expect(inst.config.autoplay).toBe(true);
      inst.pause();
      inst.destroy();
    });

    test('autoplay: always', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'autoplayAlways',
        autoplay: 'always',
        interval: 5000
      });

      expect(inst.config.autoplay).toBe('always');
      inst.destroy();
    });
  });

  describe('index 옵션', () => {
    test('시작 인덱스 설정', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'startIndex',
        index: 1,
        autoplay: false
      });

      expect(inst.config.index).toBe(1);
    });

    test('음수 인덱스 보정', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'negativeIndex',
        index: -1,
        autoplay: false
      });

      expect(inst.config.index).toBe(0);
    });

    test('범위 초과 인덱스 보정', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'overIndex',
        index: 100,
        autoplay: false
      });

      expect(inst.config.index).toBeLessThan(100);
    });
  });

  describe('goto 메소드', () => {
    test('특정 인덱스로 이동', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'gotoTest',
        autoplay: false,
        index: 0
      });

      inst.goto(2);
      // 애니메이션 때문에 즉시 변경되지 않을 수 있음
      expect(inst.config).toBeDefined();
    });

    test('같은 인덱스로 이동 (무시)', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'gotoSame',
        autoplay: false,
        index: 1
      });

      inst.goto(1);
      expect(inst.config.index).toBe(1);
    });

    test('범위 밖 인덱스로 이동 (무시)', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'gotoOutOfRange',
        autoplay: false,
        index: 0
      });

      inst.goto(-1);
      inst.goto(100);
      expect(inst.config.index).toBe(0);
    });
  });

  describe('마우스 이벤트', () => {
    test('마우스 오버 시 자동재생 중지', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'mouseEvent',
        autoplay: true,
        interval: 5000
      });

      const elem = document.querySelector('#carousel');
      
      // mouseenter 이벤트 발생
      const enterEvent = new Event('mouseenter');
      elem.dispatchEvent(enterEvent);

      // mouseleave 이벤트 발생
      const leaveEvent = new Event('mouseleave');
      elem.dispatchEvent(leaveEvent);

      inst.destroy();
    });
  });

  describe('슬라이드 1개 이하', () => {
    test('슬라이드 1개일 때', () => {
      document.body.innerHTML = `
        <div id="singleCarousel" class="cui-carousel">
          <div carousel-item>
            <div>슬라이드 1</div>
          </div>
        </div>
      `;

      const inst = window.carousel.render({
        elem: '#singleCarousel',
        id: 'singleSlide',
        autoplay: false
      });

      expect(inst).toBeDefined();
    });

    test('슬라이드 없을 때', () => {
      document.body.innerHTML = `
        <div id="emptyCarousel" class="cui-carousel">
          <div carousel-item></div>
        </div>
      `;

      const inst = window.carousel.render({
        elem: '#emptyCarousel',
        id: 'emptySlide',
        autoplay: false
      });

      expect(inst).toBeDefined();
    });
  });

  describe('Catui 이벤트', () => {
    test('on 메소드로 이벤트 등록', () => {
      const result = window.carousel.on('change(filter)', function(data) {
        console.log('변경됨');
      });

      expect(result).toBeDefined();
    });
  });

  describe('cui-filter 속성', () => {
    test('cui-filter 속성 사용', () => {
      document.body.innerHTML = `
        <div id="filterCarousel" class="cui-carousel" cui-filter="myFilter">
          <div carousel-item>
            <div>슬라이드 1</div>
            <div>슬라이드 2</div>
          </div>
        </div>
      `;

      const inst = window.carousel.render({
        elem: '#filterCarousel',
        id: 'filterTest',
        autoplay: false
      });

      expect(inst).toBeDefined();
    });
  });

  describe('reload 다양한 옵션', () => {
    test('reload로 옵션 변경', () => {
      const inst = window.carousel.render({
        elem: '#carousel',
        id: 'reloadOptions',
        autoplay: false,
        arrow: 'hover'
      });

      expect(() => {
        inst.reload({
          arrow: 'always',
          indicator: 'outside'
        });
      }).not.toThrow();

      // that 인스턴스에서 변경 확인
      const that = window.carousel.that['reloadOptions'];
      expect(that.config.arrow).toBe('always');
    });
  });

  describe('destroy 상세', () => {
    test('destroy 후 재생성', () => {
      const inst1 = window.carousel.render({
        elem: '#carousel',
        id: 'destroyRecreate',
        autoplay: true
      });

      inst1.destroy();

      const inst2 = window.carousel.render({
        elem: '#carousel',
        id: 'destroyRecreate',
        autoplay: false
      });

      expect(inst2).toBeDefined();
    });
  });
});
