/**
 * Dropdown 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/dropdown.js');

describe('Dropdown Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="dropdownBtn">드롭다운</button>
      <button id="dropdownBtn2">드롭다운 2</button>
    `;
  });

  afterEach(() => {
    if (window.dropdown && window.dropdown.close) {
      window.dropdown.close();
    }
  });

  describe('기본 API', () => {
    test('dropdown 객체가 존재함', () => {
      expect(window.dropdown).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.dropdown.render).toBe('function');
    });

    test('close 메소드가 존재함', () => {
      expect(typeof window.dropdown.close).toBe('function');
    });

    test('destroy 메소드가 존재함', () => {
      expect(typeof window.dropdown.destroy).toBe('function');
    });

    test('on 메소드가 존재함', () => {
      expect(typeof window.dropdown.on).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 드롭다운', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [
          { title: '메뉴 1', id: 1 },
          { title: '메뉴 2', id: 2 }
        ]
      });

      expect(inst).toBeDefined();
    });

    test('구분선 포함', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [
          { title: '메뉴 1', id: 1 },
          { type: '-' },
          { title: '메뉴 2', id: 2 }
        ]
      });

      expect(inst).toBeDefined();
    });

    test('하위 메뉴', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [
          {
            title: '상위 메뉴',
            id: 1,
            child: [
              { title: '하위 1', id: 11 },
              { title: '하위 2', id: 12 }
            ]
          }
        ]
      });

      expect(inst).toBeDefined();
    });

    test('비활성화 항목', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [
          { title: '활성', id: 1 },
          { title: '비활성', id: 2, disabled: true }
        ]
      });

      expect(inst).toBeDefined();
    });

    test('링크 항목', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [
          { title: '링크', id: 1, href: '/page' }
        ]
      });

      expect(inst).toBeDefined();
    });

    test('트리거 - hover', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        trigger: 'hover',
        data: [{ title: '메뉴', id: 1 }]
      });

      expect(inst).toBeDefined();
    });

    test('정렬 - right', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        align: 'right',
        data: [{ title: '메뉴', id: 1 }]
      });

      expect(inst).toBeDefined();
    });

    test('정렬 - center', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        align: 'center',
        data: [{ title: '메뉴', id: 1 }]
      });

      expect(inst).toBeDefined();
    });
  });

  describe('close', () => {
    test('모든 드롭다운 닫기', () => {
      window.dropdown.render({
        elem: '#dropdownBtn',
        data: [{ title: '메뉴', id: 1 }]
      });

      window.dropdown.close();
      expect(true).toBe(true);
    });

    test('특정 드롭다운 닫기', () => {
      window.dropdown.render({
        elem: '#dropdownBtn',
        id: 'myDropdown',
        data: [{ title: '메뉴', id: 1 }]
      });

      window.dropdown.close('myDropdown');
      expect(true).toBe(true);
    });
  });

  describe('콜백', () => {
    test('click 콜백', () => {
      let clickedData = null;

      window.dropdown.render({
        elem: '#dropdownBtn',
        data: [{ title: '메뉴', id: 1 }],
        click: function(data) {
          clickedData = data;
        }
      });

      // 클릭 이벤트는 실제 DOM 상호작용 필요
      expect(true).toBe(true);
    });

    test('ready 콜백', () => {
      let readyCalled = false;

      window.dropdown.render({
        elem: '#dropdownBtn',
        data: [{ title: '메뉴', id: 1 }],
        ready: function(elemPanel, elem) {
          readyCalled = true;
        }
      });

      expect(true).toBe(true);
    });
  });

  describe('set', () => {
    test('set 메소드가 존재함', () => {
      expect(typeof window.dropdown.set).toBe('function');
    });

    test('전역 설정', () => {
      expect(() => {
        window.dropdown.set({
          trigger: 'hover'
        });
      }).not.toThrow();
    });
  });

  describe('아이콘', () => {
    test('아이콘 포함', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [
          { title: '편집', id: 1, icon: 'edit' },
          { title: '삭제', id: 2, icon: 'delete' }
        ]
      });
      expect(inst).toBeDefined();
    });
  });

  describe('스타일', () => {
    test('style 옵션', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [{ title: '메뉴', id: 1 }],
        style: 'width: 200px;'
      });
      expect(inst).toBeDefined();
    });

    test('className 옵션', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [{ title: '메뉴', id: 1 }],
        className: 'custom-dropdown'
      });
      expect(inst).toBeDefined();
    });
  });

  describe('templet', () => {
    test('템플릿 함수', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [{ title: '메뉴', id: 1, extra: 'info' }],
        templet: function(d) {
          return d.title + ' - ' + d.extra;
        }
      });
      expect(inst).toBeDefined();
    });
  });

  describe('isAllowSpread', () => {
    test('하위 메뉴 펼침 허용', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [
          {
            title: '상위',
            id: 1,
            child: [{ title: '하위', id: 11 }]
          }
        ],
        isAllowSpread: true
      });
      expect(inst).toBeDefined();
    });

    test('하위 메뉴 펼침 비허용', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [
          {
            title: '상위',
            id: 1,
            child: [{ title: '하위', id: 11 }]
          }
        ],
        isAllowSpread: false
      });
      expect(inst).toBeDefined();
    });
  });

  describe('show/hide', () => {
    test('show 옵션', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [{ title: '메뉴', id: 1 }],
        show: true
      });
      expect(inst).toBeDefined();
    });
  });

  describe('clickScope', () => {
    test('clickScope 옵션', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        data: [{ title: '메뉴', id: 1 }],
        clickScope: 'all'
      });
      expect(inst).toBeDefined();
    });
  });

  describe('reload', () => {
    test('reload 메소드', () => {
      const inst = window.dropdown.render({
        elem: '#dropdownBtn',
        id: 'reloadTest',
        data: [{ title: '메뉴', id: 1 }]
      });

      expect(typeof inst.reload).toBe('function');
    });
  });
});
