/**
 * Upload 모듈 테스트
 */

require('../src/modules/cui.js');
require('../src/modules/upload.js');

describe('Upload Module', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="uploadBtn">업로드</button>
      <div id="uploadArea"></div>
    `;
  });

  describe('기본 API', () => {
    test('upload 객체가 존재함', () => {
      expect(window.upload).toBeDefined();
    });

    test('render 메소드가 존재함', () => {
      expect(typeof window.upload.render).toBe('function');
    });

    test('getInst 메소드가 존재함', () => {
      expect(typeof window.upload.getInst).toBe('function');
    });
  });

  describe('render', () => {
    test('기본 업로드', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload'
      });

      expect(inst).toBeDefined();
    });

    test('이미지만 허용', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        accept: 'images'
      });

      expect(inst.config.accept).toBe('images');
    });

    test('특정 확장자만', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        exts: 'jpg|png|gif'
      });

      expect(inst.config.exts).toBe('jpg|png|gif');
    });

    test('다중 파일', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        multiple: true
      });

      expect(inst.config.multiple).toBe(true);
    });

    test('파일 개수 제한', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        multiple: true,
        number: 5
      });

      expect(inst.config.number).toBe(5);
    });

    test('파일 크기 제한', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        size: 1024 // KB
      });

      expect(inst.config.size).toBe(1024);
    });

    test('드래그 업로드', () => {
      const inst = window.upload.render({
        elem: '#uploadArea',
        url: '/upload',
        drag: true
      });

      expect(inst.config.drag).toBe(true);
    });

    test('자동 업로드 비활성화', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        auto: false
      });

      expect(inst.config.auto).toBe(false);
    });

    test('추가 데이터', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        data: {
          userId: 123,
          category: 'docs'
        }
      });

      expect(inst.config.data.userId).toBe(123);
    });

    test('헤더 설정', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        headers: {
          'Authorization': 'Bearer token'
        }
      });

      expect(inst.config.headers.Authorization).toBe('Bearer token');
    });
  });

  describe('콜백', () => {
    test('choose 콜백 존재', () => {
      let chooseCalled = false;

      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        choose: function(obj) {
          chooseCalled = true;
        }
      });

      expect(inst.config.choose).toBeDefined();
    });

    test('before 콜백 존재', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        before: function(obj) {
          return true;
        }
      });

      expect(inst.config.before).toBeDefined();
    });

    test('done 콜백 존재', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        done: function(res, index, upload) {
          console.log('완료');
        }
      });

      expect(inst.config.done).toBeDefined();
    });

    test('error 콜백 존재', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        error: function(index, upload) {
          console.log('에러');
        }
      });

      expect(inst.config.error).toBeDefined();
    });
  });

  describe('인스턴스 메소드', () => {
    test('reload', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload'
      });

      expect(typeof inst.reload).toBe('function');
    });

    test('upload', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        auto: false
      });

      expect(typeof inst.upload).toBe('function');
    });
  });
});
