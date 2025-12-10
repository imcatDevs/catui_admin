/**
 * Rate 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/rate.js');

describe('Rate Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="rate"></div>
      <div id="rate2"></div>
    `;
  });

  describe('기본 API', () => {
    test('rate 객체가 존재함', () => {
      expect(window.rate).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.rate.render).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 별점', () => {
      const inst = window.rate.render({
        elem: '#rate'
      });

      expect(inst).toBeDefined();
    });

    test('초기값 설정', () => {
      const inst = window.rate.render({
        elem: '#rate',
        value: 3
      });

      expect(inst.config.value).toBe(3);
    });

    test('별 개수 설정', () => {
      const inst = window.rate.render({
        elem: '#rate',
        length: 10
      });

      expect(inst.config.length).toBe(10);
    });

    test('반 별 허용', () => {
      const inst = window.rate.render({
        elem: '#rate',
        half: true,
        value: 3.5
      });

      expect(inst.config.half).toBe(true);
    });

    test('읽기 전용', () => {
      const inst = window.rate.render({
        elem: '#rate',
        readonly: true,
        value: 4
      });

      expect(inst.config.readonly).toBe(true);
    });

    test('텍스트 표시', () => {
      const inst = window.rate.render({
        elem: '#rate',
        text: true
      });

      expect(inst.config.text).toBe(true);
    });

    test('테마 색상', () => {
      const inst = window.rate.render({
        elem: '#rate',
        theme: '#ff6600'
      });

      expect(inst.config.theme).toBe('#ff6600');
    });
  });

  describe('콜백', () => {
    test('choose 콜백', () => {
      let chosenValue = null;

      const inst = window.rate.render({
        elem: '#rate',
        choose: function(value) {
          chosenValue = value;
        }
      });

      expect(inst.config.choose).toBeDefined();
    });
  });

  describe('값 범위', () => {
    test('최소값 (0)', () => {
      const inst = window.rate.render({
        elem: '#rate',
        value: 0
      });

      expect(inst.config.value).toBe(0);
    });

    test('최대값', () => {
      const inst = window.rate.render({
        elem: '#rate',
        length: 5,
        value: 5
      });

      expect(inst.config.value).toBe(5);
    });
  });
});
