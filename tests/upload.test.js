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

    test('config 속성', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload'
      });

      expect(inst.config).toBeDefined();
      expect(inst.config.url).toBe('/upload');
    });
  });

  describe('set', () => {
    test('set 메소드가 존재함', () => {
      expect(typeof window.upload.set).toBe('function');
    });

    test('전역 설정', () => {
      expect(() => {
        window.upload.set({
          size: 2048
        });
      }).not.toThrow();
    });
  });

  describe('accept 옵션', () => {
    test('video 허용', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        accept: 'video'
      });
      expect(inst.config.accept).toBe('video');
    });

    test('audio 허용', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        accept: 'audio'
      });
      expect(inst.config.accept).toBe('audio');
    });

    test('file (모든 파일)', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        accept: 'file'
      });
      expect(inst.config.accept).toBe('file');
    });
  });

  describe('필드명', () => {
    test('기본 필드명', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload'
      });
      expect(inst.config.field).toBe('file');
    });

    test('커스텀 필드명', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        field: 'myFile'
      });
      expect(inst.config.field).toBe('myFile');
    });
  });

  describe('bindAction', () => {
    test('bindAction 옵션', () => {
      document.body.innerHTML = `
        <button id="uploadBtn">선택</button>
        <button id="submitBtn">업로드</button>
      `;

      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        auto: false,
        bindAction: '#submitBtn'
      });

      expect(inst.config.bindAction).toBe('#submitBtn');
    });
  });

  describe('ID', () => {
    test('ID 설정', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        id: 'myUpload'
      });

      expect(inst.config.id).toBe('myUpload');
    });
  });

  describe('allDone', () => {
    test('allDone 콜백 존재', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        multiple: true,
        allDone: function(obj) {
          console.log('전체 완료');
        }
      });

      expect(inst.config.allDone).toBeDefined();
    });
  });

  describe('progress', () => {
    test('progress 콜백 존재', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        progress: function(n, elem, res, index) {
          console.log('진행률:', n);
        }
      });

      expect(inst.config.progress).toBeDefined();
    });
  });

  describe('on', () => {
    test('이벤트 등록', () => {
      const result = window.upload.on('choose', function() {});
      expect(result).toBe(window.upload);
    });
  });

  describe('getInst', () => {
    test('인스턴스 가져오기', () => {
      window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        id: 'testUpload'
      });

      const inst = window.upload.getInst('testUpload');
      expect(inst).toBeDefined();
    });

    test('존재하지 않는 인스턴스', () => {
      const inst = window.upload.getInst('notExist');
      expect(inst).toBeUndefined();
    });
  });

  describe('size 옵션', () => {
    test('숫자로 크기 제한 (KB)', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        size: 1024
      });
      expect(inst.config.size).toBe(1024);
    });

    test('문자열로 크기 제한 (MB)', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        size: '10MB'
      });
      expect(inst.config.size).toBe('10MB');
    });

    test('minSize 옵션', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        minSize: '1KB'
      });
      expect(inst.config.minSize).toBe('1KB');
    });
  });

  describe('acceptMime', () => {
    test('직접 MIME 타입 지정', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        acceptMime: 'image/png,image/jpeg'
      });
      expect(inst.config.acceptMime).toBe('image/png,image/jpeg');
    });
  });

  describe('method', () => {
    test('기본 메소드 POST', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload'
      });
      expect(inst.config.method).toBe('POST');
    });

    test('커스텀 메소드', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        method: 'PUT'
      });
      expect(inst.config.method).toBe('PUT');
    });
  });

  describe('validateError', () => {
    test('validateError 콜백', () => {
      const inst = window.upload.render({
        elem: '#uploadBtn',
        url: '/upload',
        validateError: function(obj) {
          console.log('검증 실패:', obj.msg);
        }
      });
      expect(inst.config.validateError).toBeDefined();
    });
  });
});
