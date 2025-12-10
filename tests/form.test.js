/**
 * Form 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/form.js');

describe('Form Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <form class="cui-form" cui-filter="testForm">
        <input type="text" name="username" value="홍길동">
        <input type="email" name="email" value="test@test.com">
        <input type="checkbox" name="agree" checked>
        <input type="radio" name="gender" value="male" checked>
        <input type="radio" name="gender" value="female">
        <select name="city">
          <option value="seoul" selected>서울</option>
          <option value="busan">부산</option>
        </select>
        <textarea name="memo">메모 내용</textarea>
      </form>
    `;
  });

  describe('기본 API', () => {
    test('form 객체가 존재함', () => {
      expect(window.form).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.form.render).toBe('function');
    });

    test('val 메소드가 존재함', () => {
      expect(typeof window.form.val).toBe('function');
    });

    test('verify 메소드가 존재함', () => {
      expect(typeof window.form.verify).toBe('function');
    });

    test('on 메소드가 존재함', () => {
      expect(typeof window.form.on).toBe('function');
    });
  });

  describe('val', () => {
    test('폼 값 가져오기', () => {
      const values = window.form.val('testForm');
      
      expect(values.username).toBe('홍길동');
      expect(values.email).toBe('test@test.com');
      expect(values.city).toBe('seoul');
    });

    test('폼 값 설정하기', () => {
      window.form.val('testForm', {
        username: '김철수',
        email: 'new@test.com'
      });

      const values = window.form.val('testForm');
      expect(values.username).toBe('김철수');
      expect(values.email).toBe('new@test.com');
    });

    test('존재하지 않는 폼', () => {
      const values = window.form.val('nonexistent');
      expect(values).toEqual({});
    });
  });

  describe('verify', () => {
    test('커스텀 검증 규칙 추가', () => {
      window.form.verify({
        customRule: [
          /^[a-z]+$/,
          '소문자만 입력하세요.'
        ]
      });

      expect(window.form.config.verify.customRule).toBeDefined();
    });

    test('함수형 검증 규칙', () => {
      window.form.verify({
        positiveNumber: function(value) {
          if (value <= 0) return '양수를 입력하세요.';
        }
      });

      expect(typeof window.form.config.verify.positiveNumber).toBe('function');
    });
  });

  describe('기본 검증 규칙', () => {
    test('required 규칙 존재', () => {
      expect(window.form.config.verify.required).toBeDefined();
    });

    test('email 규칙 존재', () => {
      expect(window.form.config.verify.email).toBeDefined();
    });

    test('phone 규칙 존재', () => {
      expect(window.form.config.verify.phone).toBeDefined();
    });

    test('url 규칙 존재', () => {
      expect(window.form.config.verify.url).toBeDefined();
    });

    test('number 규칙 존재', () => {
      expect(window.form.config.verify.number).toBeDefined();
    });
  });

  describe('render', () => {
    test('폼 렌더링', () => {
      window.form.render();
      // 렌더링이 에러 없이 완료되는지 확인
      expect(true).toBe(true);
    });

    test('특정 필터만 렌더링', () => {
      window.form.render(null, 'testForm');
      expect(true).toBe(true);
    });

    test('타입 지정 렌더링', () => {
      window.form.render('select');
      expect(true).toBe(true);
    });
  });

  describe('set', () => {
    test('전역 설정', () => {
      const result = window.form.set({ submitBtn: false });
      expect(result).toBeDefined();
    });
  });

  describe('getValue', () => {
    test('필터로 값 가져오기', () => {
      const values = window.form.getValue('testForm');
      expect(values.username).toBe('홍길동');
    });
  });

  describe('폼 요소', () => {
    test('체크박스 렌더링', () => {
      document.body.innerHTML = `
        <form class="cui-form">
          <input type="checkbox" name="check1" checked>
          <input type="checkbox" name="check2">
        </form>
      `;
      window.form.render();
      expect(true).toBe(true);
    });

    test('라디오 렌더링', () => {
      document.body.innerHTML = `
        <form class="cui-form">
          <input type="radio" name="radio1" value="a" checked>
          <input type="radio" name="radio1" value="b">
        </form>
      `;
      window.form.render();
      expect(true).toBe(true);
    });

    test('셀렉트 렌더링', () => {
      document.body.innerHTML = `
        <form class="cui-form">
          <select name="sel">
            <option value="1">옵션1</option>
            <option value="2" selected>옵션2</option>
          </select>
        </form>
      `;
      window.form.render('select');
      expect(true).toBe(true);
    });

    test('스위치 렌더링', () => {
      document.body.innerHTML = `
        <form class="cui-form">
          <input type="checkbox" cui-skin="switch" name="switch1">
        </form>
      `;
      window.form.render();
      expect(true).toBe(true);
    });
  });

  describe('val 확장', () => {
    test('체크박스 값 설정', () => {
      document.body.innerHTML = `
        <form class="cui-form" cui-filter="testForm">
          <input type="checkbox" name="agree">
        </form>
      `;
      
      window.form.val('testForm', { agree: true });
      const values = window.form.val('testForm');
      expect(values.agree).toBe('on');
    });

    test('라디오 값 설정', () => {
      document.body.innerHTML = `
        <form class="cui-form" cui-filter="testForm">
          <input type="radio" name="gender" value="male">
          <input type="radio" name="gender" value="female">
        </form>
      `;
      
      window.form.val('testForm', { gender: 'female' });
      const values = window.form.val('testForm');
      expect(values.gender).toBe('female');
    });

    test('textarea 값 설정', () => {
      document.body.innerHTML = `
        <form class="cui-form" cui-filter="testForm">
          <textarea name="content"></textarea>
        </form>
      `;
      
      window.form.val('testForm', { content: '새로운 내용' });
      const values = window.form.val('testForm');
      expect(values.content).toBe('새로운 내용');
    });
  });

  describe('on', () => {
    test('이벤트 등록', () => {
      const result = window.form.on('submit(testForm)', function() {});
      expect(result).toBeDefined();
    });

    test('select 이벤트', () => {
      const result = window.form.on('select(filter)', function() {});
      expect(result).toBeDefined();
    });

    test('checkbox 이벤트', () => {
      const result = window.form.on('checkbox(filter)', function() {});
      expect(result).toBeDefined();
    });

    test('radio 이벤트', () => {
      const result = window.form.on('radio(filter)', function() {});
      expect(result).toBeDefined();
    });
  });
});
