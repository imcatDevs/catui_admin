/**
 * Tree 모듈 테스트
 */

// 모듈 로드
require('../src/modules/cui.js');
require('../src/modules/tree.js');

describe('Tree Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="treeContainer"></div>
    `;
    // 인스턴스 초기화
    if (window.tree) {
      window.tree.that = {};
    }
  });

  describe('기본 API', () => {
    test('tree 객체가 존재함', () => {
      expect(window.tree).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.tree.render).toBe('function');
    });

    test('getChecked 메소드가 존재함', () => {
      expect(typeof window.tree.getChecked).toBe('function');
    });

    test('setChecked 메소드가 존재함', () => {
      expect(typeof window.tree.setChecked).toBe('function');
    });

    test('destroy 메소드가 존재함', () => {
      expect(typeof window.tree.destroy).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 트리 렌더링', () => {
      const inst = window.tree.render({
        elem: '#treeContainer',
        id: 'testTree',
        data: [
          { id: 1, title: '노드 1' },
          { id: 2, title: '노드 2' }
        ]
      });

      expect(inst).toBeDefined();
      expect(window.tree.that['testTree']).toBeDefined();
    });

    test('계층 구조 트리 렌더링', () => {
      const inst = window.tree.render({
        elem: '#treeContainer',
        id: 'hierarchyTree',
        data: [
          {
            id: 1,
            title: '부모 노드',
            children: [
              { id: 2, title: '자식 노드 1' },
              { id: 3, title: '자식 노드 2' }
            ]
          }
        ]
      });

      expect(inst).toBeDefined();
    });

    test('체크박스 트리', () => {
      window.tree.render({
        elem: '#treeContainer',
        id: 'checkboxTree',
        showCheckbox: true,
        data: [
          { id: 1, title: '노드 1' },
          { id: 2, title: '노드 2' }
        ]
      });

      const container = document.getElementById('treeContainer');
      expect(container.innerHTML).not.toBe('');
    });
  });

  describe('getChecked', () => {
    test('체크된 노드 없음', () => {
      window.tree.render({
        elem: '#treeContainer',
        id: 'getCheckedTree',
        showCheckbox: true,
        data: [
          { id: 1, title: '노드 1' },
          { id: 2, title: '노드 2' }
        ]
      });

      const checked = window.tree.getChecked('getCheckedTree');
      expect(Array.isArray(checked)).toBe(true);
    });

    test('존재하지 않는 트리', () => {
      const checked = window.tree.getChecked('nonexistent');
      expect(checked).toEqual([]);
    });
  });

  describe('destroy', () => {
    test('인스턴스 정리', () => {
      window.tree.render({
        elem: '#treeContainer',
        id: 'destroyTree',
        data: [{ id: 1, title: '노드' }]
      });

      expect(window.tree.that['destroyTree']).toBeDefined();
      
      window.tree.destroy('destroyTree');
      
      expect(window.tree.that['destroyTree']).toBeUndefined();
    });
  });

  describe('reload', () => {
    test('reload 메소드가 존재함', () => {
      expect(typeof window.tree.reload).toBe('function');
    });

    test('트리 리로드', () => {
      window.tree.render({
        elem: '#treeContainer',
        id: 'reloadTree',
        data: [{ id: 1, title: '노드 1' }]
      });

      // 새 데이터로 리로드
      window.tree.reload('reloadTree', {
        data: [
          { id: 1, title: '새 노드 1' },
          { id: 2, title: '새 노드 2' }
        ]
      });

      expect(window.tree.that['reloadTree']).toBeDefined();
    });
  });

  describe('set', () => {
    test('set 메소드가 존재함', () => {
      expect(typeof window.tree.set).toBe('function');
    });

    test('전역 설정', () => {
      const result = window.tree.set({ showLine: true });
      expect(result).toBeDefined();
    });
  });

  describe('on', () => {
    test('on 메소드가 존재함', () => {
      expect(typeof window.tree.on).toBe('function');
    });

    test('click 이벤트 등록', () => {
      const result = window.tree.on('click(filter)', function() {});
      expect(result).toBeDefined();
    });

    test('checkbox 이벤트 등록', () => {
      const result = window.tree.on('checkbox(filter)', function() {});
      expect(result).toBeDefined();
    });

    test('operate 이벤트 등록', () => {
      const result = window.tree.on('operate(filter)', function() {});
      expect(result).toBeDefined();
    });
  });

  describe('옵션', () => {
    test('showLine 옵션', () => {
      const inst = window.tree.render({
        elem: '#treeContainer',
        id: 'lineTree',
        showLine: true,
        data: [{ id: 1, title: '노드' }]
      });

      expect(inst.config.showLine).toBe(true);
    });

    test('accordion 옵션', () => {
      const inst = window.tree.render({
        elem: '#treeContainer',
        id: 'accordionTree',
        accordion: true,
        data: [{ id: 1, title: '노드' }]
      });

      expect(inst.config.accordion).toBe(true);
    });

    test('onlyIconControl 옵션', () => {
      const inst = window.tree.render({
        elem: '#treeContainer',
        id: 'iconControlTree',
        onlyIconControl: true,
        data: [{ id: 1, title: '노드' }]
      });

      expect(inst.config.onlyIconControl).toBe(true);
    });

    test('edit 옵션 (편집 버튼)', () => {
      const inst = window.tree.render({
        elem: '#treeContainer',
        id: 'editTree',
        edit: ['add', 'update', 'del'],
        data: [{ id: 1, title: '노드' }]
      });

      expect(inst.config.edit.length).toBe(3);
    });

    test('spread 옵션 (펼침 상태)', () => {
      const inst = window.tree.render({
        elem: '#treeContainer',
        id: 'spreadTree',
        data: [
          {
            id: 1,
            title: '노드',
            spread: true,
            children: [{ id: 2, title: '자식' }]
          }
        ]
      });

      expect(inst).toBeDefined();
    });
  });

  describe('setChecked', () => {
    test('노드 체크 설정', () => {
      window.tree.render({
        elem: '#treeContainer',
        id: 'setCheckedTree',
        showCheckbox: true,
        data: [
          { id: 1, title: '노드 1' },
          { id: 2, title: '노드 2' }
        ]
      });

      expect(() => {
        window.tree.setChecked('setCheckedTree', 1);
      }).not.toThrow();
    });
  });
});
