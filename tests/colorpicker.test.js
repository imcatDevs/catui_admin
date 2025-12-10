/**
 * Colorpicker 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/colorpicker.js');

describe('Colorpicker Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="colorInput">
      <div id="colorDisplay"></div>
    `;
  });

  describe('기본 API', () => {
    test('colorpicker 객체가 존재함', () => {
      expect(window.colorpicker).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.colorpicker.render).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 컬러피커', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput'
      });

      expect(inst).toBeDefined();
    });

    test('초기 색상 설정', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        color: '#ff6600'
      });

      expect(inst.config.color).toBe('#ff6600');
    });

    test('RGBA 형식', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        format: 'rgb',
        alpha: true
      });

      expect(inst.config.format).toBe('rgb');
      expect(inst.config.alpha).toBe(true);
    });

    test('프리셋 색상', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        predefine: true,
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });

      expect(inst.config.predefine).toBe(true);
    });

    test('크기 설정', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        size: 'lg'
      });

      expect(inst.config.size).toBe('lg');
    });
  });

  describe('콜백', () => {
    test('done 콜백', () => {
      let selectedColor = null;

      const inst = window.colorpicker.render({
        elem: '#colorInput',
        done: function(color) {
          selectedColor = color;
        }
      });

      expect(inst.config.done).toBeDefined();
    });

    test('change 콜백', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        change: function(color) {
          console.log('색상 변경:', color);
        }
      });

      expect(inst.config.change).toBeDefined();
    });
  });

  describe('색상 형식', () => {
    test('HEX 형식', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        format: 'hex'
      });

      expect(inst.config.format).toBe('hex');
    });

    test('RGB 형식', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        format: 'rgb'
      });

      expect(inst.config.format).toBe('rgb');
    });
  });
});
