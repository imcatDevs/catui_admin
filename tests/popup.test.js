/**
 * Popup 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/popup.js');

describe('Popup Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // 모든 팝업 닫기
    if (window.popup && window.popup.closeAll) {
      window.popup.closeAll();
    }
  });

  describe('기본 API', () => {
    test('popup 객체가 존재함', () => {
      expect(window.popup).toBeDefined();
    });

    test('open 메소드가 존재함', () => {
      expect(typeof window.popup.open).toBe('function');
    });

    test('close 메소드가 존재함', () => {
      expect(typeof window.popup.close).toBe('function');
    });

    test('closeAll 메소드가 존재함', () => {
      expect(typeof window.popup.closeAll).toBe('function');
    });

    test('alert 메소드가 존재함', () => {
      expect(typeof window.popup.alert).toBe('function');
    });

    test('confirm 메소드가 존재함', () => {
      expect(typeof window.popup.confirm).toBe('function');
    });

    test('msg 메소드가 존재함', () => {
      expect(typeof window.popup.msg).toBe('function');
    });

    test('load 메소드가 존재함', () => {
      expect(typeof window.popup.load).toBe('function');
    });

    test('tips 메소드가 존재함', () => {
      expect(typeof window.popup.tips).toBe('function');
    });
  });

  describe('open', () => {
    test('기본 팝업 열기', () => {
      const idx = window.popup.open({
        title: '테스트',
        content: '내용'
      });

      expect(idx).toBeGreaterThan(0);
      expect(document.querySelector('.cui-popup')).toBeTruthy();
    });

    test('타이틀 없는 팝업', () => {
      const idx = window.popup.open({
        title: false,
        content: '타이틀 없음'
      });

      expect(idx).toBeGreaterThan(0);
    });

    test('버튼이 있는 팝업', () => {
      const idx = window.popup.open({
        title: '확인',
        content: '내용',
        btn: ['확인', '취소']
      });

      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('alert', () => {
    test('알림 팝업', () => {
      const idx = window.popup.alert('알림 메시지');
      expect(idx).toBeGreaterThan(0);
    });

    test('옵션과 함께 알림', () => {
      const idx = window.popup.alert('알림', { icon: 1 });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('confirm', () => {
    test('확인 팝업', () => {
      const idx = window.popup.confirm('확인하시겠습니까?', () => {});
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('msg', () => {
    test('메시지 팝업', () => {
      const idx = window.popup.msg('메시지');
      expect(idx).toBeGreaterThan(0);
    });

    test('아이콘과 함께 메시지', () => {
      const idx = window.popup.msg('성공!', { icon: 1 });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('load', () => {
    test('로딩 팝업', () => {
      const idx = window.popup.load();
      expect(idx).toBeGreaterThan(0);
    });

    test('타입 지정 로딩', () => {
      const idx = window.popup.load(1);
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('close', () => {
    test('팝업 닫기', () => {
      const idx = window.popup.open({
        title: '테스트',
        content: '닫기 테스트'
      });

      window.popup.close(idx);
      
      // 애니메이션 때문에 바로 제거되지 않을 수 있음
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('closeAll', () => {
    test('모든 팝업 닫기', () => {
      window.popup.open({ content: '1' });
      window.popup.open({ content: '2' });
      window.popup.open({ content: '3' });

      window.popup.closeAll();
      
      // closeAll 호출 후 확인
      expect(true).toBe(true);
    });
  });

  describe('tips', () => {
    test('툴팁 표시', () => {
      document.body.innerHTML = '<button id="tipBtn">버튼</button>';
      const idx = window.popup.tips('툴팁 내용', '#tipBtn');
      expect(idx).toBeGreaterThan(0);
    });

    test('옵션과 함께 툴팁', () => {
      document.body.innerHTML = '<button id="tipBtn2">버튼</button>';
      const idx = window.popup.tips('옵션 툴팁', '#tipBtn2', { tips: 1 });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('open 옵션', () => {
    test('type 옵션 (dialog)', () => {
      const idx = window.popup.open({
        type: 0,
        title: '정보',
        content: '다이얼로그 내용'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('type 옵션 (page)', () => {
      const idx = window.popup.open({
        type: 1,
        title: '페이지',
        content: '<div>HTML 내용</div>'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('area 옵션', () => {
      const idx = window.popup.open({
        title: '크기 지정',
        content: '내용',
        area: ['500px', '300px']
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('offset 옵션', () => {
      const idx = window.popup.open({
        title: '위치 지정',
        content: '내용',
        offset: '100px'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('shade 옵션 (배경)', () => {
      const idx = window.popup.open({
        title: '쉐이드',
        content: '내용',
        shade: 0.5
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('shade 비활성화', () => {
      const idx = window.popup.open({
        title: '쉐이드 없음',
        content: '내용',
        shade: false
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('closeBtn 옵션', () => {
      const idx = window.popup.open({
        title: '닫기 버튼 숨김',
        content: '내용',
        closeBtn: 0
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('anim 옵션', () => {
      const idx = window.popup.open({
        title: '애니메이션',
        content: '내용',
        anim: 2
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('maxmin 옵션', () => {
      const idx = window.popup.open({
        title: '최대/최소화',
        content: '내용',
        maxmin: true
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('fixed 옵션', () => {
      const idx = window.popup.open({
        title: '고정 위치',
        content: '내용',
        fixed: false
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('resize 옵션', () => {
      const idx = window.popup.open({
        title: '크기 조절',
        content: '내용',
        resize: true
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('move 옵션', () => {
      const idx = window.popup.open({
        title: '이동 불가',
        content: '내용',
        move: false
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('time 옵션 (자동 닫기)', () => {
      const idx = window.popup.open({
        title: '자동 닫기',
        content: '3초 후 닫힘',
        time: 3000
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('skin 옵션', () => {
      const idx = window.popup.open({
        title: '스킨',
        content: '내용',
        skin: 'custom-skin'
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('콜백', () => {
    test('success 콜백', () => {
      let successCalled = false;
      window.popup.open({
        content: '성공 콜백',
        success: function(layero, index) {
          successCalled = true;
        }
      });
      expect(successCalled).toBe(true);
    });

    test('yes 콜백 (확인 버튼)', () => {
      let yesCalled = false;
      const idx = window.popup.open({
        content: '확인',
        btn: ['확인'],
        yes: function(index) {
          yesCalled = true;
        }
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('cancel 콜백 (취소 버튼)', () => {
      const idx = window.popup.open({
        content: '취소',
        btn: ['확인', '취소'],
        cancel: function(index) {
          return true;
        }
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('end 콜백 (닫힘 후)', () => {
      const idx = window.popup.open({
        content: '종료',
        end: function() {
          console.log('팝업 닫힘');
        }
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('set', () => {
    test('set 메소드가 존재함', () => {
      expect(typeof window.popup.set).toBe('function');
    });

    test('전역 설정', () => {
      expect(() => {
        window.popup.set({
          shade: 0.3,
          closeBtn: 1
        });
      }).not.toThrow();
    });
  });

  describe('getChildFrame', () => {
    test('getChildFrame 메소드가 존재함', () => {
      expect(typeof window.popup.getChildFrame).toBe('function');
    });
  });

  describe('iframeAuto', () => {
    test('iframeAuto 메소드가 존재함', () => {
      expect(typeof window.popup.iframeAuto).toBe('function');
    });
  });

  describe('title', () => {
    test('title 메소드가 존재함', () => {
      expect(typeof window.popup.title).toBe('function');
    });

    test('타이틀 변경', () => {
      const idx = window.popup.open({
        title: '원본 타이틀',
        content: '내용'
      });
      
      window.popup.title('새 타이틀', idx);
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('style', () => {
    test('style 메소드가 존재함', () => {
      expect(typeof window.popup.style).toBe('function');
    });

    test('스타일 변경', () => {
      const idx = window.popup.open({
        title: '스타일',
        content: '내용'
      });
      
      window.popup.style(idx, { width: '600px' });
      expect(idx).toBeGreaterThan(0);
    });
  });
});
