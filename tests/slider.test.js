/**
 * Slider 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/slider.js');

describe('Slider Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="slider"></div>
      <div id="slider2"></div>
      <div id="verticalSlider"></div>
    `;
  });

  describe('기본 API', () => {
    test('slider 객체가 존재함', () => {
      expect(window.slider).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.slider.render).toBe('function');
    });

    test('getInst 메소드가 존재함', () => {
      expect(typeof window.slider.getInst).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 슬라이더', () => {
      const inst = window.slider.render({
        elem: '#slider'
      });

      expect(inst).toBeDefined();
      expect(typeof inst.setValue).toBe('function');
      expect(typeof inst.getValue).toBe('function');
    });

    test('초기값 설정', () => {
      const inst = window.slider.render({
        elem: '#slider',
        value: 50
      });

      expect(inst.getValue()).toBe(50);
    });

    test('범위 설정', () => {
      const inst = window.slider.render({
        elem: '#slider',
        min: 10,
        max: 200,
        value: 100
      });

      expect(inst.getValue()).toBe(100);
    });

    test('단계 설정', () => {
      const inst = window.slider.render({
        elem: '#slider',
        step: 10,
        value: 50
      });

      expect(inst.config.step).toBe(10);
    });

    test('범위 슬라이더', () => {
      const inst = window.slider.render({
        elem: '#slider',
        range: true,
        value: [20, 80]
      });

      const value = inst.getValue();
      expect(Array.isArray(value)).toBe(true);
      expect(value[0]).toBe(20);
      expect(value[1]).toBe(80);
    });

    test('수직 슬라이더', () => {
      const inst = window.slider.render({
        elem: '#verticalSlider',
        type: 'vertical',
        height: 200
      });

      expect(inst.config.type).toBe('vertical');
    });

    test('비활성화', () => {
      const inst = window.slider.render({
        elem: '#slider',
        disabled: true
      });

      expect(inst.config.disabled).toBe(true);
    });

    test('단계 표시', () => {
      const inst = window.slider.render({
        elem: '#slider',
        showstep: true,
        step: 20
      });

      expect(inst.config.showstep).toBe(true);
    });

    test('입력 필드', () => {
      const inst = window.slider.render({
        elem: '#slider',
        input: true
      });

      expect(inst.config.input).toBe(true);
    });
  });

  describe('인스턴스 메소드', () => {
    test('setValue', () => {
      const inst = window.slider.render({
        elem: '#slider',
        value: 0
      });

      inst.setValue(75);
      expect(inst.getValue()).toBe(75);
    });

    test('getValue', () => {
      const inst = window.slider.render({
        elem: '#slider',
        value: 30
      });

      expect(inst.getValue()).toBe(30);
    });

    test('범위 슬라이더 setValue', () => {
      const inst = window.slider.render({
        elem: '#slider',
        range: true,
        value: [0, 100]
      });

      inst.setValue(25, 0);
      inst.setValue(75, 1);

      const value = inst.getValue();
      expect(value[0]).toBe(25);
      expect(value[1]).toBe(75);
    });

    test('destroy', () => {
      const inst = window.slider.render({
        elem: '#slider',
        id: 'destroyTest'
      });

      inst.destroy();
      expect(window.slider.getInst('destroyTest')).toBeUndefined();
    });
  });

  describe('콜백', () => {
    test('change 콜백 설정', () => {
      const inst = window.slider.render({
        elem: '#slider',
        value: 0,
        change: function(value) {
          console.log('변경:', value);
        }
      });

      expect(inst.config.change).toBeDefined();
    });
  });

  describe('값 범위 제한', () => {
    test('최소값 이하', () => {
      const inst = window.slider.render({
        elem: '#slider',
        min: 0,
        max: 100
      });

      inst.setValue(-10);
      expect(inst.getValue()).toBe(0);
    });

    test('최대값 이상', () => {
      const inst = window.slider.render({
        elem: '#slider',
        min: 0,
        max: 100
      });

      inst.setValue(150);
      expect(inst.getValue()).toBe(100);
    });
  });
});
