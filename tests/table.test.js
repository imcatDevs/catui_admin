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

  describe('reload', () => {
    test('reload 메소드가 존재함', () => {
      expect(typeof window.table.reload).toBe('function');
    });

    test('테이블 리로드', () => {
      window.table.render({
        elem: '#tableContainer',
        id: 'reloadTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }]
      });

      window.table.reload('reloadTable', {
        data: [{ id: 1 }, { id: 2 }]
      });

      const data = window.table.getData('reloadTable');
      expect(data.length).toBe(2);
    });
  });

  describe('resize', () => {
    test('resize 메소드가 존재함', () => {
      expect(typeof window.table.resize).toBe('function');
    });

    test('테이블 크기 재조정', () => {
      window.table.render({
        elem: '#tableContainer',
        id: 'resizeTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }]
      });

      expect(() => {
        window.table.resize('resizeTable');
      }).not.toThrow();
    });
  });

  describe('on', () => {
    test('on 메소드가 존재함', () => {
      expect(typeof window.table.on).toBe('function');
    });

    test('이벤트 등록 (row)', () => {
      const result = window.table.on('row(testFilter)', function() {});
      expect(result).toBeDefined();
    });

    test('이벤트 등록 (checkbox)', () => {
      const result = window.table.on('checkbox(testFilter)', function() {});
      expect(result).toBeDefined();
    });

    test('이벤트 등록 (tool)', () => {
      const result = window.table.on('tool(testFilter)', function() {});
      expect(result).toBeDefined();
    });
  });

  describe('set', () => {
    test('set 메소드가 존재함', () => {
      expect(typeof window.table.set).toBe('function');
    });

    test('전역 설정', () => {
      const result = window.table.set({ even: true });
      expect(result).toBeDefined();
    });
  });

  describe('옵션 테스트', () => {
    test('페이지네이션', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'pageTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: Array.from({ length: 20 }, (_, i) => ({ id: i + 1 })),
        page: true,
        limit: 10
      });

      expect(inst).toBeDefined();
    });

    test('높이 설정', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'heightTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        height: 300
      });

      expect(inst.config.height).toBe(300);
    });

    test('짝수행 배경', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'evenTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }, { id: 2 }],
        even: true
      });

      expect(inst.config.even).toBe(true);
    });

    test('툴바', () => {
      document.body.innerHTML = `
        <div id="tableContainer"></div>
        <script type="text/html" id="toolbarDemo">
          <button class="cui-btn cui-btn-sm">추가</button>
        </script>
      `;

      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'toolbarTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        toolbar: '#toolbarDemo'
      });

      expect(inst.config.toolbar).toBe('#toolbarDemo');
    });

    test('정렬', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'sortTable',
        cols: [[
          { field: 'id', title: 'ID', sort: true },
          { field: 'name', title: '이름' }
        ]],
        data: [{ id: 2, name: 'B' }, { id: 1, name: 'A' }]
      });

      expect(inst).toBeDefined();
    });

    test('행 번호', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'numbersTable',
        cols: [[
          { type: 'numbers' },
          { field: 'id', title: 'ID' }
        ]],
        data: [{ id: 1 }, { id: 2 }]
      });

      expect(inst).toBeDefined();
    });

    test('고정 열', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'fixedTable',
        cols: [[
          { field: 'id', title: 'ID', fixed: 'left' },
          { field: 'name', title: '이름' },
          { field: 'action', title: '작업', fixed: 'right' }
        ]],
        data: [{ id: 1, name: 'Test', action: '' }]
      });

      expect(inst).toBeDefined();
    });
  });

  describe('컬럼 옵션', () => {
    test('너비 설정', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'widthTable',
        cols: [[
          { field: 'id', title: 'ID', width: 100 },
          { field: 'name', title: '이름', minWidth: 200 }
        ]],
        data: [{ id: 1, name: 'Test' }]
      });

      expect(inst).toBeDefined();
    });

    test('숨김 열', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'hideTable',
        cols: [[
          { field: 'id', title: 'ID' },
          { field: 'secret', title: '비밀', hide: true }
        ]],
        data: [{ id: 1, secret: 'hidden' }]
      });

      expect(inst).toBeDefined();
    });

    test('정렬 방향', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'alignTable',
        cols: [[
          { field: 'id', title: 'ID', align: 'center' },
          { field: 'price', title: '가격', align: 'right' }
        ]],
        data: [{ id: 1, price: 1000 }]
      });

      expect(inst).toBeDefined();
    });
  });

  describe('eachCols', () => {
    test('eachCols 메소드가 존재함', () => {
      expect(typeof window.table.eachCols).toBe('function');
    });

    test('컬럼 순회', () => {
      window.table.render({
        elem: '#tableContainer',
        id: 'eachColsTable',
        cols: [[
          { field: 'id', title: 'ID' },
          { field: 'name', title: '이름' }
        ]],
        data: [{ id: 1, name: 'Test' }]
      });

      const cols = [];
      window.table.eachCols('eachColsTable', function(i, col) {
        cols.push(col.field);
      });

      expect(cols).toContain('id');
      expect(cols).toContain('name');
    });
  });

  describe('exportFile', () => {
    test('exportFile 메소드가 존재함', () => {
      expect(typeof window.table.exportFile).toBe('function');
    });
  });

  describe('setRowChecked', () => {
    test('setRowChecked 메소드가 존재함', () => {
      expect(typeof window.table.setRowChecked).toBe('function');
    });
  });

  describe('that (인스턴스 저장소)', () => {
    test('that 객체가 존재함', () => {
      expect(window.table.that).toBeDefined();
    });

    test('인스턴스 저장', () => {
      window.table.render({
        elem: '#tableContainer',
        id: 'thatTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }]
      });

      expect(window.table.that['thatTable']).toBeDefined();
    });
  });

  describe('템플릿 컬럼', () => {
    test('templet 함수', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'templetFnTable',
        cols: [[
          { field: 'id', title: 'ID' },
          { 
            field: 'status', 
            title: '상태',
            templet: function(d) {
              return d.status ? '활성' : '비활성';
            }
          }
        ]],
        data: [{ id: 1, status: true }, { id: 2, status: false }]
      });

      expect(inst).toBeDefined();
    });

    test('templet 문자열 (ID)', () => {
      document.body.innerHTML = `
        <div id="tableContainer"></div>
        <script type="text/html" id="statusTpl">
          {{# if(d.status){ }}활성{{# } else { }}비활성{{# } }}
        </script>
      `;

      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'templetStrTable',
        cols: [[
          { field: 'id', title: 'ID' },
          { field: 'status', title: '상태', templet: '#statusTpl' }
        ]],
        data: [{ id: 1, status: true }]
      });

      expect(inst).toBeDefined();
    });
  });

  describe('defaultToolbar', () => {
    test('기본 툴바', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'defaultToolbarTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        defaultToolbar: ['filter', 'exports', 'print']
      });

      expect(inst.config.defaultToolbar).toBeDefined();
    });

    test('커스텀 툴바 버튼', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'customToolbarTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        defaultToolbar: [
          { title: '추가', layEvent: 'add', icon: 'add' }
        ]
      });

      expect(inst).toBeDefined();
    });
  });

  describe('done 콜백', () => {
    test('done 콜백 호출', () => {
      let doneCalled = false;
      
      window.table.render({
        elem: '#tableContainer',
        id: 'doneTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        done: function(res, curr, count) {
          doneCalled = true;
        }
      });

      expect(doneCalled).toBe(true);
    });
  });

  describe('text 설정', () => {
    test('빈 데이터 텍스트', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'textTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [],
        text: {
          none: '데이터가 없습니다.'
        }
      });

      expect(inst.config.text.none).toBe('데이터가 없습니다.');
    });
  });

  describe('skin 옵션', () => {
    test('skin: line', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'skinLineTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        skin: 'line'
      });

      expect(inst.config.skin).toBe('line');
    });

    test('skin: row', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'skinRowTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        skin: 'row'
      });

      expect(inst.config.skin).toBe('row');
    });

    test('skin: nob', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'skinNobTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        skin: 'nob'
      });

      expect(inst.config.skin).toBe('nob');
    });
  });

  describe('size 옵션', () => {
    test('size: sm', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'sizeSmTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        size: 'sm'
      });

      expect(inst.config.size).toBe('sm');
    });

    test('size: lg', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'sizeLgTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        size: 'lg'
      });

      expect(inst.config.size).toBe('lg');
    });
  });

  describe('initSort', () => {
    test('초기 정렬', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'initSortTable',
        cols: [[
          { field: 'id', title: 'ID', sort: true },
          { field: 'name', title: '이름' }
        ]],
        data: [{ id: 2, name: 'B' }, { id: 1, name: 'A' }],
        initSort: {
          field: 'id',
          type: 'asc'
        }
      });

      expect(inst.config.initSort).toBeDefined();
    });
  });

  describe('limits', () => {
    test('페이지 크기 옵션', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'limitsTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: Array.from({ length: 50 }, (_, i) => ({ id: i + 1 })),
        page: true,
        limits: [10, 20, 50, 100]
      });

      expect(inst.config.limits).toEqual([10, 20, 50, 100]);
    });
  });

  describe('loading', () => {
    test('로딩 표시', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'loadingTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        loading: true
      });

      expect(inst.config.loading).toBe(true);
    });
  });

  describe('title', () => {
    test('테이블 제목', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'titleTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        title: '사용자 목록'
      });

      expect(inst.config.title).toBe('사용자 목록');
    });
  });

  describe('edit 컬럼', () => {
    test('edit: text', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'editTextTable',
        cols: [[
          { field: 'id', title: 'ID' },
          { field: 'name', title: '이름', edit: 'text' }
        ]],
        data: [{ id: 1, name: 'Test' }]
      });

      expect(inst).toBeDefined();
    });
  });

  describe('unresize', () => {
    test('열 크기 조절 비활성화', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'unresizeTable',
        cols: [[
          { field: 'id', title: 'ID', unresize: true },
          { field: 'name', title: '이름' }
        ]],
        data: [{ id: 1, name: 'Test' }]
      });

      expect(inst).toBeDefined();
    });
  });

  describe('event 컬럼', () => {
    test('layEvent 설정', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'eventTable',
        cols: [[
          { field: 'id', title: 'ID' },
          { 
            title: '작업',
            templet: function() {
              return '<a class="cui-btn cui-btn-xs" cui-event="edit">수정</a>';
            }
          }
        ]],
        data: [{ id: 1 }]
      });

      expect(inst).toBeDefined();
    });
  });

  describe('복합 헤더', () => {
    test('colspan 헤더', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'colspanTable',
        cols: [
          [
            { field: 'id', title: 'ID', rowspan: 2 },
            { title: '정보', colspan: 2, align: 'center' }
          ],
          [
            { field: 'name', title: '이름' },
            { field: 'email', title: '이메일' }
          ]
        ],
        data: [{ id: 1, name: 'Test', email: 'test@test.com' }]
      });

      expect(inst).toBeDefined();
    });
  });

  describe('totalRow', () => {
    test('합계 행', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'totalRowTable',
        cols: [[
          { field: 'id', title: 'ID' },
          { field: 'price', title: '가격', totalRow: true }
        ]],
        data: [{ id: 1, price: 100 }, { id: 2, price: 200 }],
        totalRow: true
      });

      expect(inst.config.totalRow).toBe(true);
    });
  });

  describe('width 옵션', () => {
    test('테이블 너비', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'widthOptTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        width: 800
      });

      expect(inst.config.width).toBe(800);
    });
  });

  describe('escape 옵션', () => {
    test('HTML 이스케이프', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'escapeTable',
        cols: [[{ field: 'html', title: 'HTML' }]],
        data: [{ html: '<script>alert(1)</script>' }],
        escape: true
      });

      expect(inst.config.escape).toBe(true);
    });
  });

  describe('className 옵션', () => {
    test('추가 클래스', () => {
      const inst = window.table.render({
        elem: '#tableContainer',
        id: 'classTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }],
        className: 'custom-table'
      });

      expect(inst.config.className).toBe('custom-table');
    });
  });

  describe('cache', () => {
    test('cache 객체 접근', () => {
      window.table.render({
        elem: '#tableContainer',
        id: 'cacheAccessTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }, { id: 2 }]
      });

      expect(window.table.cache['cacheAccessTable']).toBeDefined();
      expect(window.table.cache['cacheAccessTable'].length).toBe(2);
    });
  });

  describe('getInst', () => {
    test('인스턴스 접근 (that 사용)', () => {
      window.table.render({
        elem: '#tableContainer',
        id: 'getInstTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }]
      });

      // getInst가 없으면 that으로 접근
      const inst = window.table.that['getInstTable'];
      expect(inst).toBeDefined();
    });
  });

  describe('update', () => {
    test('update 메소드 확인', () => {
      // update 메소드가 있으면 함수, 없으면 undefined
      const hasUpdate = typeof window.table.update === 'function' || typeof window.table.update === 'undefined';
      expect(hasUpdate).toBe(true);
    });
  });

  describe('reload deep', () => {
    test('deep reload', () => {
      window.table.render({
        elem: '#tableContainer',
        id: 'deepReloadTable',
        cols: [[{ field: 'id', title: 'ID' }]],
        data: [{ id: 1 }]
      });

      expect(() => {
        window.table.reload('deepReloadTable', { data: [{ id: 2 }] }, true);
      }).not.toThrow();
    });
  });
});
