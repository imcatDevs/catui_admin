/**
 * Transfer 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/transfer.js');

describe('Transfer Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="transfer"></div>
    `;
  });

  describe('기본 API', () => {
    test('transfer 객체가 존재함', () => {
      expect(window.transfer).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.transfer.render).toBe('function');
    });

    test('set 메소드가 존재함', () => {
      expect(typeof window.transfer.set).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 트랜스퍼', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        data: [
          { value: 1, title: '항목 1' },
          { value: 2, title: '항목 2' },
          { value: 3, title: '항목 3' }
        ]
      });

      expect(inst).toBeDefined();
    });

    test('초기 선택값', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        data: [
          { value: 1, title: '항목 1' },
          { value: 2, title: '항목 2' },
          { value: 3, title: '항목 3' }
        ],
        value: [2, 3]
      });

      expect(inst.config.value).toContain(2);
      expect(inst.config.value).toContain(3);
    });

    test('타이틀 설정', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        data: [],
        title: ['소스', '대상']
      });

      expect(inst.config.title[0]).toBe('소스');
      expect(inst.config.title[1]).toBe('대상');
    });

    test('검색 활성화', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        data: [],
        showSearch: true
      });

      expect(inst.config.showSearch).toBe(true);
    });

    test('너비/높이 설정', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        data: [],
        width: 250,
        height: 400
      });

      expect(inst.config.width).toBe(250);
      expect(inst.config.height).toBe(400);
    });

    test('비활성화 항목', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        data: [
          { value: 1, title: '항목 1' },
          { value: 2, title: '항목 2', disabled: true }
        ]
      });

      expect(inst).toBeDefined();
    });

    test('ID 설정', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        id: 'myTransfer',
        data: []
      });

      expect(inst.config.id).toBe('myTransfer');
    });
  });

  describe('콜백', () => {
    test('onchange 콜백', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        data: [],
        onchange: function(data, index) {
          console.log('변경됨');
        }
      });

      expect(inst.config.onchange).toBeDefined();
    });
  });

  describe('on', () => {
    test('on 메소드가 존재함', () => {
      expect(typeof window.transfer.on).toBe('function');
    });

    test('이벤트 등록', () => {
      const result = window.transfer.on('change(filter)', function() {});
      expect(result).toBeDefined();
    });
  });

  describe('인스턴스 reload', () => {
    test('인스턴스에 reload 메소드가 존재함', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        id: 'reloadTest',
        data: []
      });
      expect(typeof inst.reload).toBe('function');
    });
  });

  describe('인스턴스 getData', () => {
    test('인스턴스에 getData 메소드가 존재함', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        id: 'getDataTest',
        data: []
      });
      expect(typeof inst.getData).toBe('function');
    });
  });

  describe('추가 옵션', () => {
    test('parseData 옵션', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        data: [
          { id: 1, name: '항목 1' }
        ],
        parseData: function(item) {
          return {
            value: item.id,
            title: item.name
          };
        }
      });

      expect(inst.config.parseData).toBeDefined();
    });

    test('text 옵션 (버튼 텍스트)', () => {
      const inst = window.transfer.render({
        elem: '#transfer',
        data: [],
        text: {
          none: '데이터 없음',
          searchNone: '검색 결과 없음'
        }
      });

      expect(inst.config.text).toBeDefined();
    });
  });
});
