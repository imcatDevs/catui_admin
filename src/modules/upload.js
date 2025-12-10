/*!
 * Catui upload - 파일 업로드 컴포넌트
 * Based on upload.js, jQuery-free
 * MIT Licensed
 */

;!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'upload'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 인덱스
  ,index = 0
  
  // 인스턴스 저장
  ,instances = {}

  // 상수
  ,ELEM = 'cui-upload'
  ,ELEM_FILE = 'cui-upload-file'
  ,ELEM_DRAG = 'cui-upload-drag'
  ,ELEM_DRAG_OVER = 'cui-upload-drag-over'

  // MIME 타입 매핑
  ,acceptMimes = {
    images: 'image/*'
    ,file: '*/*'
    ,video: 'video/*'
    ,audio: 'audio/*'
  }

  // 용량 단위 변환 (bytes → 읽기 쉬운 형식)
  ,formatSize = function(bytes){
    if(bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 용량 문자열 파싱 (예: '10MB' → bytes)
  ,parseSize = function(sizeStr){
    if(typeof sizeStr === 'number') return sizeStr * 1024; // 숫자는 KB로 간주 (하위 호환)
    if(typeof sizeStr !== 'string') return 0;
    
    var match = sizeStr.match(/^([\d.]+)\s*(bytes?|kb?|mb?|gb?)?$/i);
    if(!match) return 0;
    
    var num = parseFloat(match[1]);
    var unit = (match[2] || 'kb').toLowerCase();
    
    var multipliers = {
      'b': 1, 'byte': 1, 'bytes': 1,
      'k': 1024, 'kb': 1024,
      'm': 1024 * 1024, 'mb': 1024 * 1024,
      'g': 1024 * 1024 * 1024, 'gb': 1024 * 1024 * 1024
    };
    
    return num * (multipliers[unit] || 1024);
  }

  // 외부 인터페이스
  ,upload = {
    config: {}
    ,index: 0

    // 전역 설정
    ,set: function(options){
      var $c = get$c();
      this.config = $c.extend({}, this.config, options);
      return this;
    }

    // 렌더링
    ,render: function(options){
      var inst = new Class(options);
      return {
        upload: function(files){
          inst.upload(files);
        }
        ,reload: function(opts){
          inst.reload(opts);
        }
        ,config: inst.config
      };
    }

    // 인스턴스 가져오기
    ,getInst: function(id){
      return instances[id];
    }

    // 이벤트 등록
    ,on: function(events, callback){
      if(window.Catui && Catui.onevent){
        return Catui.onevent.call(this, MOD_NAME, events, callback);
      }
      return this;
    }
  };

  // 생성자
  var Class = function(options){
    var that = this;
    var $c = get$c();
    
    if(!$c){
      setTimeout(function(){ new Class(options); }, 50);
      return;
    }
    
    that.index = ++index;
    that.config = $c.extend({}, that.defaults, upload.config, options);
    that.config.id = that.config.id || that.index;
    
    instances[that.config.id] = that;
    that.init();
  };

  // 기본 설정
  Class.prototype.defaults = {
    elem: null              // 트리거 요소
    ,url: ''                // 업로드 URL
    ,field: 'file'          // 파일 필드명
    ,accept: 'images'       // 파일 타입: images, file, video, audio
    ,acceptMime: ''         // MIME 타입 (직접 지정: 'image/png,image/jpeg')
    ,exts: ''               // 허용 확장자 (|로 구분, 예: 'jpg|png|gif')
    ,auto: true             // 자동 업로드
    ,bindAction: ''         // 수동 업로드 트리거
    ,multiple: false        // 다중 선택
    ,number: 0              // 최대 파일 수 (0: 무제한)
    ,size: 0                // 최대 파일 크기 (숫자: KB, 문자열: '10MB', '500KB')
    ,minSize: 0             // 최소 파일 크기 (숫자: KB, 문자열: '1KB')
    ,drag: true             // 드래그 업로드
    ,data: {}               // 추가 데이터
    ,headers: {}            // 추가 헤더
    ,method: 'POST'         // HTTP 메소드
    ,before: null           // 업로드 전 콜백
    ,done: null             // 완료 콜백
    ,error: null            // 오류 콜백
    ,progress: null         // 진행률 콜백
    ,allDone: null          // 전체 완료 콜백
    ,choose: null           // 파일 선택 콜백
    ,validateError: null    // 검증 실패 콜백 ({type, msg, detail, file})
  };

  // 초기화
  Class.prototype.init = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    that.elem = $c(config.elem);
    if(!that.elem[0]) return;

    // 파일 입력 생성
    that.createFileInput();
    
    // 이벤트 바인딩
    that.bindEvents();
  };

  // 리로드
  Class.prototype.reload = function(options){
    var that = this
    ,$c = get$c();
    
    that.config = $c.extend({}, that.config, options);
    that.init();
  };

  // 파일 입력 생성
  Class.prototype.createFileInput = function(){
    var that = this
    ,config = that.config;

    // 기존 파일 입력 제거
    if(that.fileInput){
      that.fileInput.remove();
    }

    // accept 결정
    var acceptMime = config.acceptMime || acceptMimes[config.accept] || '*/*';

    // 파일 입력 요소
    var input = document.createElement('input');
    input.type = 'file';
    input.className = ELEM_FILE;
    input.accept = acceptMime;
    input.name = config.field;
    if(config.multiple){
      input.multiple = true;
    }
    input.style.display = 'none';

    document.body.appendChild(input);
    that.fileInput = get$c()(input);
  };

  // 파일 선택 처리 (공통)
  Class.prototype.handleFiles = function(files){
    var that = this
    ,config = that.config;

    if(!files || files.length === 0) return;

    that.chooseFiles = {};
    that.fileLength = 0;

    for(var i = 0; i < files.length; i++){
      that.chooseFiles[i] = files[i];
      that.fileLength++;
    }

    // 선택 콜백
    if(typeof config.choose === 'function'){
      config.choose({
        files: that.chooseFiles
        ,getFiles: function(){
          return that.chooseFiles;
        }
        ,preview: function(callback){
          that.preview(callback);
        }
        ,upload: function(idx, file){
          that.upload(idx, file);
        }
        ,reset: function(){
          that.fileInput[0].value = '';
        }
      });
    }

    // 자동 업로드
    if(config.auto){
      that.upload();
    }
  };

  // 이벤트 바인딩
  Class.prototype.bindEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,elem = that.elem[0]
    ,fileInput = that.fileInput[0];

    // 트리거 클릭 (중복 방지)
    if(!elem._uploadClickBound){
      elem._uploadClickBound = true;
      elem.addEventListener('click', function(e){
        e.stopPropagation();
        that.fileInput[0].click();
      });
    }

    // 파일 선택 (중복 방지)
    if(!fileInput._changeBound){
      fileInput._changeBound = true;
      fileInput.addEventListener('change', function(){
        that.handleFiles(this.files);
        // 입력값 리셋 (같은 파일 재선택 가능)
        this.value = '';
      });
    }

    // 수동 업로드 버튼
    if(config.bindAction){
      var actionElem = document.querySelector(config.bindAction);
      if(actionElem && !actionElem._uploadClickBound){
        actionElem._uploadClickBound = true;
        actionElem.addEventListener('click', function(){
          that.upload();
        });
      }
    }

    // 드래그 업로드 (중복 방지)
    if(config.drag && elem && !elem._dragBound){
      elem._dragBound = true;
      
      elem.addEventListener('dragover', function(e){
        e.preventDefault();
        e.stopPropagation();
        that.elem.addClass(ELEM_DRAG_OVER);
      });

      elem.addEventListener('dragleave', function(e){
        e.preventDefault();
        e.stopPropagation();
        that.elem.removeClass(ELEM_DRAG_OVER);
      });

      elem.addEventListener('drop', function(e){
        e.preventDefault();
        e.stopPropagation();
        that.elem.removeClass(ELEM_DRAG_OVER);
        that.handleFiles(e.dataTransfer.files);
      });
    }
  };

  // 미리보기
  Class.prototype.preview = function(callback){
    var that = this;
    
    if(!window.FileReader) return;

    for(var idx in that.chooseFiles){
      (function(index, file){
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(){
          if(typeof callback === 'function'){
            callback(index, file, this.result);
          }
        };
      })(idx, that.chooseFiles[idx]);
    }
  };

  // 검증
  Class.prototype.validate = function(file){
    var that = this
    ,config = that.config;

    // 1. 확장자 검증
    if(config.exts){
      var ext = file.name.split('.').pop().toLowerCase();
      var exts = config.exts.toLowerCase().split('|');
      if(exts.indexOf(ext) === -1){
        that.error({
          type: 'exts',
          msg: '허용되지 않는 파일 형식입니다.',
          detail: '허용 확장자: ' + config.exts.split('|').join(', '),
          file: file
        });
        return false;
      }
    }

    // 2. MIME 타입 검증
    if(config.acceptMime && config.acceptMime !== '*/*'){
      var mimes = config.acceptMime.split(',').map(function(m){ return m.trim(); });
      var fileType = file.type || '';
      var mimeMatch = false;
      
      for(var i = 0; i < mimes.length; i++){
        var mime = mimes[i];
        if(mime.endsWith('/*')){
          // 와일드카드 매칭 (예: image/*)
          var prefix = mime.slice(0, -2);
          if(fileType.startsWith(prefix)){
            mimeMatch = true;
            break;
          }
        } else if(fileType === mime){
          mimeMatch = true;
          break;
        }
      }
      
      if(!mimeMatch){
        that.error({
          type: 'mime',
          msg: '허용되지 않는 파일 유형입니다.',
          detail: '허용 유형: ' + config.acceptMime,
          file: file
        });
        return false;
      }
    }

    // 3. 최소 파일 크기 검증
    if(config.minSize){
      var minBytes = parseSize(config.minSize);
      if(file.size < minBytes){
        that.error({
          type: 'minSize',
          msg: '파일 크기가 너무 작습니다.',
          detail: '최소 크기: ' + formatSize(minBytes) + ', 현재: ' + formatSize(file.size),
          file: file
        });
        return false;
      }
    }

    // 4. 최대 파일 크기 검증
    if(config.size){
      var maxBytes = parseSize(config.size);
      if(file.size > maxBytes){
        that.error({
          type: 'size',
          msg: '파일 크기가 제한을 초과했습니다.',
          detail: '최대 크기: ' + formatSize(maxBytes) + ', 현재: ' + formatSize(file.size),
          file: file
        });
        return false;
      }
    }

    return true;
  };

  // 오류 처리
  Class.prototype.error = function(errInfo){
    var that = this
    ,config = that.config;

    // 객체 형태면 상세 에러 정보
    if(typeof errInfo === 'object'){
      // validateError 콜백이 있으면 호출
      if(typeof config.validateError === 'function'){
        config.validateError(errInfo);
        return;
      }
      
      // 기본 에러 메시지 표시
      var msg = errInfo.msg;
      if(errInfo.detail){
        msg += '\n' + errInfo.detail;
      }
      if(errInfo.file){
        msg = '「' + errInfo.file.name + '」\n' + msg;
      }
      
      if(window.popup){
        popup.msg(msg, { icon: 2 });
      } else {
        alert(msg);
      }
    } else {
      // 단순 문자열 메시지
      if(window.popup){
        popup.msg(errInfo, { icon: 2 });
      } else {
        alert(errInfo);
      }
    }
  };

  // 업로드 실행
  Class.prototype.upload = function(idx, file){
    var that = this
    ,config = that.config
    ,files = that.chooseFiles || {};

    if(!config.url){
      that.error('업로드 URL이 지정되지 않았습니다.');
      return;
    }

    // 특정 파일만 업로드
    if(idx !== undefined && file){
      files = {};
      files[idx] = file;
    }

    var successful = 0
    ,aborted = 0
    ,totalFiles = Object.keys(files).length;

    // 파일 수 검증
    if(config.number > 0 && totalFiles > config.number){
      that.error('최대 ' + config.number + '개의 파일만 업로드할 수 있습니다.');
      return;
    }

    // 각 파일 업로드
    for(var key in files){
      (function(index, fileItem){
        // 검증
        if(!that.validate(fileItem)){
          aborted++;
          checkAllDone();
          return;
        }

        // 업로드 전 콜백
        if(typeof config.before === 'function'){
          if(config.before(fileItem) === false){
            aborted++;
            checkAllDone();
            return;
          }
        }

        // FormData 생성
        var formData = new FormData();
        formData.append(config.field, fileItem);

        // 추가 데이터
        for(var dataKey in config.data){
          var value = config.data[dataKey];
          if(typeof value === 'function'){
            value = value();
          }
          formData.append(dataKey, value);
        }

        // XMLHttpRequest
        var xhr = new XMLHttpRequest();
        
        // 진행률
        xhr.upload.addEventListener('progress', function(e){
          if(e.lengthComputable && typeof config.progress === 'function'){
            var percent = Math.round((e.loaded / e.total) * 100);
            config.progress(percent, index, fileItem);
          }
        });

        xhr.onreadystatechange = function(){
          if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
              successful++;
              var response = xhr.responseText;
              try{ response = JSON.parse(response); }catch(e){}

              // 완료 콜백
              if(typeof config.done === 'function'){
                config.done(response, index, function(fileIdx){
                  // 파일 삭제 콜백
                  delete that.chooseFiles[fileIdx || index];
                });
              }
            } else {
              aborted++;
              // 오류 콜백
              if(typeof config.error === 'function'){
                config.error(index, function(fileIdx){
                  delete that.chooseFiles[fileIdx || index];
                });
              }
            }
            checkAllDone();
          }
        };

        xhr.open(config.method, config.url, true);

        // 헤더 설정
        for(var headerKey in config.headers){
          xhr.setRequestHeader(headerKey, config.headers[headerKey]);
        }

        xhr.send(formData);

      })(key, files[key]);
    }

    // 전체 완료 확인
    function checkAllDone(){
      if(successful + aborted === totalFiles){
        if(typeof config.allDone === 'function'){
          config.allDone({
            total: totalFiles
            ,successful: successful
            ,aborted: aborted
          });
        }
      }
    }
  };

  // 전역 노출
  window.upload = upload;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = upload;
  }

}(window);
