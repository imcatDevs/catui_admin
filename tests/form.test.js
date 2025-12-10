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
      window.form.render('testForm');
      expect(true).toBe(true);
    });
  });
});
