/**
 * Table 모듈 테스트
 */

// 모듈 로드
require('../src/modules/cui.js');
require('../src/modules/table.js');

describe('Table Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="tableContainer"></div>
    `;
    // 캐시 초기화
    if (window.table) {
      window.table.cache = {};
      window.table.that = {};
    }
  });

  describe('기본 API', () => {
    test('table 객체가 존재함', () => {
      expect(window.table).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.table.render).toBe('function');
    });

    test('checkStatus 메소드가 존재함', () => {
      expect(typeof window.table.checkStatus).toBe('function');
    });

    test('getData 메소드가 존재함', () => {
      expect(typeof window.table.getData).toBe('function');
    });

    test('destroy 메소드가 존재함', () => {
      expect(typeof window.table.destroy).toBe('function');
    });
  });

  describe('render', () => {
    test('정적 데이터로 테이블 렌더링', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'testTable',
        cols: [[
          { field: 'id', title: 'ID' },
          { field: 'name', title: '이름' }
        ]],
        data: [
          { id: 1, name: '홍길동' },
          { id: 2, name: '김철수' }
        ]
      });

      expect(inst).toBeDefined();
      expect(window.table.cache['testTable']).toBeDefined();
      expect(window.table.cache['testTable'].length).toBe(2);
    });

    test('빈 데이터로 테이블 렌더링', () => {
      window.table.render({
        elem: '#tableContainer',
        id: 'emptyTable',
        cols: [[
          { field: 'id', title: 'ID' }
        ]],
        data: []
      });

      expect(window.table.cache['emptyTable']).toBeDefined();
      expect(window.table.cache['emptyTable'].length).toBe(0);
    });
  });

  describe('checkStatus', () => {
    test('체크된 데이터 없음', () => {
      window.table.render({
        elem: '#tableContainer',
        id: 'checkTable',
        cols: [[
          { type: 'checkbox' },
          { field: 'id', title: 'ID' }
        ]],
        data: [
          { id: 1 },
          { id: 2 }
        ]
      });

      const status = window.table.checkStatus('checkTable');
      expect(status.data.length).toBe(0);
      expect(status.isAll).toBe(false);
    });
  });

  describe('getData', () => {
    test('전체 데이터 가져오기', () => {
      const testData = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'C' }
      ];

      window.table.render({
        elem: '#tableContainer',
        id: 'dataTable',
        cols: [[
          { field: 'id', title: 'ID' },
          { field: 'name', title: '이름' }
        ]],
        data: testData
      });

      const data = window.table.getData('dataTable');
      expect(data.length).toBe(3);
    });

    test('존재하지 않는 테이블', () => {
      const data = window.table.getData('nonexistent');
      expect(data).toEqual([]);
    });
  });

  describe('destroy', () => {
    test('인스턴스 정리', () => {
      window.table.render({
        elem: '#tableContainer',
        id: 'destroyTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }]
      });

      expect(window.table.cache['destroyTable']).toBeDefined();
      
      window.table.destroy('destroyTable');
      
      expect(window.table.cache['destroyTable']).toBeUndefined();
      expect(window.table.that['destroyTable']).toBeUndefined();
    });
  });

  describe('clearCacheKey', () => {
    test('캐시 키 제거', () => {
      const data = {
        id: 1,
        name: 'Test',
        CUI_CHECKED: true,
        CUI_TABLE_INDEX: 0
      };

      const cleaned = window.table.clearCacheKey(data);
      
      expect(cleaned.id).toBe(1);
      expect(cleaned.name).toBe('Test');
      expect(cleaned.CUI_CHECKED).toBeUndefined();
      expect(cleaned.CUI_TABLE_INDEX).toBeUndefined();
    });
  });
});
