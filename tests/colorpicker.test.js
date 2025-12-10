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

    test('RGBA 형식 (alpha)', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        format: 'rgba',
        alpha: true
      });

      expect(inst.config.format).toBe('rgba');
      expect(inst.config.alpha).toBe(true);
    });
  });

  describe('set', () => {
    test('전역 설정', () => {
      const result = window.colorpicker.set({ format: 'rgb' });
      expect(result).toBe(window.colorpicker);
    });
  });

  describe('getInst', () => {
    test('인스턴스 가져오기', () => {
      window.colorpicker.render({
        elem: '#colorInput',
        id: 'myColorpicker'
      });

      const inst = window.colorpicker.getInst('myColorpicker');
      expect(inst).toBeDefined();
    });

    test('존재하지 않는 인스턴스', () => {
      const inst = window.colorpicker.getInst('notExist');
      expect(inst).toBeUndefined();
    });
  });

  describe('setValue / getValue', () => {
    test('setValue로 색상 설정', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        color: '#ff0000',
        format: 'hex'
      });

      inst.setValue('#00ff00');
      const value = inst.getValue();
      // HEX 또는 RGB 형식 모두 허용
      expect(value.includes('00ff00') || value.includes('0, 255, 0')).toBe(true);
    });

    test('getValue로 HEX 형식 가져오기', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        color: '#ff6600',
        format: 'hex'
      });

      const value = inst.getValue();
      expect(value).toContain('ff6600');
    });

    test('getValue로 RGB 형식 가져오기', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        color: '#ff0000',
        format: 'rgb'
      });

      const value = inst.getValue();
      expect(value).toContain('rgb');
    });

    test('getValue로 RGBA 형식 가져오기', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        color: '#ff0000',
        format: 'rgba',
        alpha: true
      });

      const value = inst.getValue();
      expect(value).toContain('rgba');
    });
  });

  describe('프리셋 색상', () => {
    test('기본 프리셋', () => {
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        predefine: true
      });

      expect(inst.config.predefine).toBe(true);
    });

    test('커스텀 프리셋', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const inst = window.colorpicker.render({
        elem: '#colorInput',
        predefine: colors
      });

      expect(inst.config.predefine).toEqual(colors);
    });
  });

  describe('on', () => {
    test('이벤트 등록', () => {
      const result = window.colorpicker.on('done', function() {});
      expect(result).toBe(window.colorpicker);
    });
  });
});
