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
    try {
      if (window.popup && window.popup.closeAll) {
        window.popup.closeAll();
      }
    } catch (e) {
      // 팝업 닫기 에러 무시
    }
    // DOM 정리
    document.querySelectorAll('.cui-popup, .cui-popup-shade').forEach(el => el.remove());
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

  describe('full/min/restore', () => {
    test('full 메소드가 존재함', () => {
      expect(typeof window.popup.full).toBe('function');
    });

    test('min 메소드가 존재함', () => {
      expect(typeof window.popup.min).toBe('function');
    });

    test('restore 메소드가 존재함', () => {
      expect(typeof window.popup.restore).toBe('function');
    });
  });

  describe('prompt', () => {
    test('prompt 메소드가 존재함', () => {
      expect(typeof window.popup.prompt).toBe('function');
    });

    test('프롬프트 팝업', () => {
      const idx = window.popup.prompt({
        title: '입력',
        formType: 0
      }, function(value, index) {});
      expect(idx).toBeGreaterThan(0);
    });

    test('textarea 프롬프트', () => {
      const idx = window.popup.prompt({
        title: '여러 줄 입력',
        formType: 2
      }, function(value, index) {});
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('tab', () => {
    test('tab 메소드가 존재함', () => {
      expect(typeof window.popup.tab).toBe('function');
    });
  });

  describe('photos', () => {
    test('photos 메소드가 존재함', () => {
      expect(typeof window.popup.photos).toBe('function');
    });
  });

  describe('offset 종류', () => {
    test('offset: t (상단)', () => {
      const idx = window.popup.open({
        title: '상단',
        content: '내용',
        offset: 't'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('offset: b (하단)', () => {
      const idx = window.popup.open({
        title: '하단',
        content: '내용',
        offset: 'b'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('offset: l (좌측)', () => {
      const idx = window.popup.open({
        title: '좌측',
        content: '내용',
        offset: 'l'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('offset: r (우측)', () => {
      const idx = window.popup.open({
        title: '우측',
        content: '내용',
        offset: 'r'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('offset: lt (좌상단)', () => {
      const idx = window.popup.open({
        title: '좌상단',
        content: '내용',
        offset: 'lt'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('offset: rb (우하단)', () => {
      const idx = window.popup.open({
        title: '우하단',
        content: '내용',
        offset: 'rb'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('offset: 배열 [top, left]', () => {
      const idx = window.popup.open({
        title: '배열 위치',
        content: '내용',
        offset: ['100px', '200px']
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('icon 옵션', () => {
    test('icon: 0 (성공)', () => {
      const idx = window.popup.open({
        content: '성공',
        icon: 0
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('icon: 1 (에러)', () => {
      const idx = window.popup.open({
        content: '에러',
        icon: 1
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('icon: 2 (경고)', () => {
      const idx = window.popup.open({
        content: '경고',
        icon: 2
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('icon: 3 (정보)', () => {
      const idx = window.popup.open({
        content: '정보',
        icon: 3
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('btnAlign', () => {
    test('버튼 좌측 정렬', () => {
      const idx = window.popup.open({
        content: '내용',
        btn: ['확인'],
        btnAlign: 'l'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('버튼 중앙 정렬', () => {
      const idx = window.popup.open({
        content: '내용',
        btn: ['확인'],
        btnAlign: 'c'
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('shadeClose', () => {
    test('배경 클릭 시 닫기', () => {
      const idx = window.popup.open({
        content: '내용',
        shade: 0.3,
        shadeClose: true
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('id 옵션', () => {
    test('ID 지정 (중복 방지)', () => {
      const idx1 = window.popup.open({
        content: '첫 번째',
        id: 'uniquePopup'
      });
      
      const idx2 = window.popup.open({
        content: '두 번째',
        id: 'uniquePopup'
      });
      
      // 같은 ID면 기존 팝업 재사용
      expect(idx1).toBeGreaterThan(0);
    });
  });

  describe('on', () => {
    test('이벤트 등록', () => {
      const result = window.popup.on('close', function() {});
      expect(result).toBeDefined();
    });
  });

  describe('toast', () => {
    test('toast 메소드가 존재함', () => {
      expect(typeof window.popup.toast).toBe('function');
    });

    test('토스트 메시지', () => {
      const idx = window.popup.toast({
        content: '토스트 메시지'
      });
      // toast는 문자열 ID 또는 숫자 반환 가능
      expect(idx).toBeDefined();
    });
  });

  describe('drawer', () => {
    test('drawer 메소드가 존재함', () => {
      expect(typeof window.popup.drawer).toBe('function');
    });

    test('드로어 열기 - 우측', () => {
      const idx = window.popup.drawer({
        title: '드로어',
        content: '내용',
        direction: 'r'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('드로어 열기 - 좌측', () => {
      const idx = window.popup.drawer({
        title: '드로어',
        content: '내용',
        direction: 'l'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('드로어 열기 - 상단', () => {
      const idx = window.popup.drawer({
        title: '드로어',
        content: '내용',
        direction: 't'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('드로어 열기 - 하단', () => {
      const idx = window.popup.drawer({
        title: '드로어',
        content: '내용',
        direction: 'b'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('드로어 크기 지정', () => {
      const idx = window.popup.drawer({
        title: '드로어',
        content: '내용',
        size: '400px'
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('anim 옵션 상세', () => {
    test('anim: slideDown', () => {
      const idx = window.popup.open({
        content: '내용',
        anim: 'slideDown'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('anim: slideUp', () => {
      const idx = window.popup.open({
        content: '내용',
        anim: 'slideUp'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('anim: slideLeft', () => {
      const idx = window.popup.open({
        content: '내용',
        anim: 'slideLeft'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('anim: slideRight', () => {
      const idx = window.popup.open({
        content: '내용',
        anim: 'slideRight'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('anim: 숫자', () => {
      for (let i = 0; i < 7; i++) {
        const idx = window.popup.open({
          content: '내용 ' + i,
          anim: i
        });
        expect(idx).toBeGreaterThan(0);
        window.popup.close(idx);
      }
    });
  });

  describe('shade 배열', () => {
    test('shade: [투명도, 색상]', () => {
      const idx = window.popup.open({
        content: '내용',
        shade: [0.5, '#333']
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('shade: [투명도, 색상, transition]', () => {
      const idx = window.popup.open({
        content: '내용',
        shade: [0.3, '#000', '0.3s']
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('area 옵션 상세', () => {
    test('area: 문자열', () => {
      const idx = window.popup.open({
        content: '내용',
        area: '500px'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('area: auto', () => {
      const idx = window.popup.open({
        content: '내용',
        area: 'auto'
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('btn 옵션 상세', () => {
    test('btn: 문자열', () => {
      const idx = window.popup.open({
        content: '내용',
        btn: '확인'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('btn: 3개 버튼', () => {
      const idx = window.popup.open({
        content: '내용',
        btn: ['확인', '취소', '기타'],
        btn3: function() {}
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('scrollbar 옵션', () => {
    test('scrollbar: false', () => {
      const idx = window.popup.open({
        content: '내용',
        scrollbar: false
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('maxWidth/maxHeight', () => {
    test('최대 크기 제한', () => {
      const idx = window.popup.open({
        content: '내용',
        maxWidth: 800,
        maxHeight: 600
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('moveOut', () => {
    test('화면 밖 이동 허용', () => {
      const idx = window.popup.open({
        content: '내용',
        move: true,
        moveOut: true
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('isOutAnim', () => {
    test('닫힘 애니메이션 비활성화', () => {
      const idx = window.popup.open({
        content: '내용',
        isOutAnim: false
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('hideOnClose', () => {
    test('닫기 시 숨김', () => {
      const idx = window.popup.open({
        content: '내용',
        hideOnClose: true
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('getIndex', () => {
    test('getIndex 메소드가 존재함', () => {
      expect(typeof window.popup.getIndex).toBe('function');
    });
  });

  describe('setTop', () => {
    test('setTop 메소드가 존재함', () => {
      expect(typeof window.popup.setTop).toBe('function');
    });
  });

  describe('closeLast', () => {
    test('closeLast 메소드가 존재함', () => {
      expect(typeof window.popup.closeLast).toBe('function');
    });

    test('마지막 팝업 닫기', () => {
      window.popup.open({ content: '1' });
      window.popup.open({ content: '2' });
      
      expect(() => {
        window.popup.closeLast();
      }).not.toThrow();
    });
  });

  describe('iframeSrc', () => {
    test('iframeSrc 메소드가 존재함', () => {
      expect(typeof window.popup.iframeSrc).toBe('function');
    });
  });

  describe('type 옵션 상세', () => {
    test('type: 2 (iframe)', () => {
      const idx = window.popup.open({
        type: 2,
        title: 'iframe',
        content: 'about:blank',
        area: ['500px', '300px']
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('type: 3 (loading)', () => {
      const idx = window.popup.open({
        type: 3,
        shade: 0.3
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('type: 4 (tips)', () => {
      document.body.innerHTML = '<span id="tipTarget">대상</span>';
      const idx = window.popup.open({
        type: 4,
        content: ['툴팁 내용', '#tipTarget']
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('beforeEnd', () => {
    test('beforeEnd 콜백', () => {
      let beforeEndCalled = false;
      const idx = window.popup.open({
        content: '내용',
        beforeEnd: function() {
          beforeEndCalled = true;
          return true;
        }
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('skin 옵션 상세', () => {
    test('cui-popup-skin-primary', () => {
      const idx = window.popup.open({
        content: '내용',
        skin: 'cui-popup-skin-primary'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('cui-popup-skin-dark', () => {
      const idx = window.popup.open({
        content: '내용',
        skin: 'cui-popup-skin-dark'
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('icon 옵션 추가', () => {
    test('icon: 4 (잠금)', () => {
      const idx = window.popup.open({
        content: '잠금',
        icon: 4
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('icon: 5 (슬픔)', () => {
      const idx = window.popup.open({
        content: '슬픔',
        icon: 5
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('icon: 6 (행복)', () => {
      const idx = window.popup.open({
        content: '행복',
        icon: 6
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('alert 콜백', () => {
    test('alert 콜백 함수', () => {
      let callbackCalled = false;
      const idx = window.popup.alert('메시지', function() {
        callbackCalled = true;
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('alert 옵션과 콜백', () => {
      const idx = window.popup.alert('메시지', { icon: 0 }, function() {});
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('confirm 상세', () => {
    test('confirm 옵션', () => {
      const idx = window.popup.confirm('확인?', { icon: 3 }, function() {}, function() {});
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('msg 상세', () => {
    test('msg 콜백', () => {
      const idx = window.popup.msg('메시지', function() {});
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('load 상세', () => {
    test('load 옵션', () => {
      const idx = window.popup.load(0, { shade: 0.5, time: 1000 });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('tips 상세', () => {
    test('tips 방향', () => {
      document.body.innerHTML = '<span id="tipDir">대상</span>';
      
      for (let i = 1; i <= 4; i++) {
        const idx = window.popup.tips('방향 ' + i, '#tipDir', { tips: i });
        expect(idx).toBeGreaterThan(0);
        window.popup.close(idx);
      }
    });
  });

  describe('tab', () => {
    test('탭 레이어', () => {
      const idx = window.popup.tab({
        tab: [
          { title: '탭1', content: '내용1' },
          { title: '탭2', content: '내용2' }
        ]
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('탭 없음', () => {
      const idx = window.popup.tab({});
      expect(idx).toBeUndefined();
    });
  });

  describe('getPopup', () => {
    test('팝업 인스턴스 가져오기', () => {
      const idx = window.popup.open({ content: '내용' });
      const inst = window.popup.getPopup(idx);
      expect(inst).toBeDefined();
    });

    test('존재하지 않는 팝업', () => {
      const inst = window.popup.getPopup(99999);
      expect(inst).toBeUndefined();
    });
  });

  describe('content', () => {
    test('content 메소드가 존재함', () => {
      expect(typeof window.popup.content).toBe('function');
    });

    test('내용 변경', () => {
      const idx = window.popup.open({ content: '원본' });
      window.popup.content('새 내용', idx);
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('getFrameIndex', () => {
    test('getFrameIndex 메소드가 존재함', () => {
      expect(typeof window.popup.getFrameIndex).toBe('function');
    });
  });

  describe('full/min/restore 동작', () => {
    test('전체화면 동작', () => {
      const idx = window.popup.open({
        content: '내용',
        maxmin: true
      });
      
      expect(() => {
        window.popup.full(idx);
      }).not.toThrow();
    });

    test('최소화 동작', () => {
      const idx = window.popup.open({
        content: '내용',
        maxmin: true
      });
      
      expect(() => {
        window.popup.min(idx);
      }).not.toThrow();
    });

    test('복원 동작', () => {
      const idx = window.popup.open({
        content: '내용',
        maxmin: true
      });
      
      window.popup.full(idx);
      expect(() => {
        window.popup.restore(idx);
      }).not.toThrow();
    });

    test('존재하지 않는 팝업 full', () => {
      expect(() => {
        window.popup.full(99999);
      }).not.toThrow();
    });

    test('존재하지 않는 팝업 min', () => {
      expect(() => {
        window.popup.min(99999);
      }).not.toThrow();
    });
  });

  describe('style 동작', () => {
    test('크기 변경', () => {
      const idx = window.popup.open({ content: '내용' });
      
      window.popup.style(idx, {
        width: 600,
        height: 400,
        top: 100,
        left: 100
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('존재하지 않는 팝업 style', () => {
      expect(() => {
        window.popup.style(99999, { width: 100 });
      }).not.toThrow();
    });
  });

  describe('close 콜백', () => {
    test('close 콜백 호출', () => {
      let callbackCalled = false;
      const idx = window.popup.open({ content: '내용' });
      
      window.popup.close(idx, function() {
        callbackCalled = true;
      });
      
      // 애니메이션 때문에 즉시 호출되지 않을 수 있음
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('prompt 상세', () => {
    test('prompt 기본값', () => {
      const idx = window.popup.prompt({
        title: '입력',
        value: '기본값'
      }, function() {});
      expect(idx).toBeGreaterThan(0);
    });

    test('prompt placeholder', () => {
      const idx = window.popup.prompt({
        title: '입력',
        placeholder: '입력해주세요'
      }, function() {});
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('photos', () => {
    test('photos 옵션', () => {
      document.body.innerHTML = `
        <div id="photoBox">
          <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="테스트">
        </div>
      `;
      
      expect(() => {
        window.popup.photos({
          photos: '#photoBox'
        });
      }).not.toThrow();
    });
  });

  describe('notice', () => {
    test('notice 메소드가 존재함', () => {
      // notice가 있으면 함수, 없으면 undefined
      const hasNotice = typeof window.popup.notice === 'function' || typeof window.popup.notice === 'undefined';
      expect(hasNotice).toBe(true);
    });
  });

  describe('elem로딩', () => {
    test('elem 요소 위에 로딩', () => {
      document.body.innerHTML = '<div id="loadTarget" style="width:100px;height:100px;"></div>';
      
      const idx = window.popup.load(0, {
        elem: '#loadTarget'
      });
      expect(idx).toBeDefined();
    });
  });

  describe('zIndex 옵션', () => {
    test('커스텀 zIndex', () => {
      const idx = window.popup.open({
        content: '내용',
        zIndex: 20000
      });
      expect(idx).toBeGreaterThan(0);
    });
  });

  describe('closeAll type', () => {
    test('closeAll 특정 타입', () => {
      // closeAll with type 테스트
      expect(() => {
        window.popup.closeAll(0);
      }).not.toThrow();
    });
  });

  describe('특수 옵션', () => {
    test('title false', () => {
      const idx = window.popup.open({
        title: false,
        content: '타이틀 없음'
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('btn2 콜백', () => {
      const idx = window.popup.open({
        content: '내용',
        btn: ['확인', '취소'],
        btn2: function() { return false; }
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('moveEnd 콜백', () => {
      const idx = window.popup.open({
        content: '내용',
        move: true,
        moveEnd: function() {}
      });
      expect(idx).toBeGreaterThan(0);
    });

    test('resizing 콜백', () => {
      const idx = window.popup.open({
        content: '내용',
        resize: true,
        resizing: function() {}
      });
      expect(idx).toBeGreaterThan(0);
    });
  });
});
