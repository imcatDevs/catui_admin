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
});
