/*!
 * Catui editor - 리치 에디터 모듈
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'editor'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 인덱스
  ,index = 0

  // 인스턴스 저장
  ,_instances = {};

  // 외부 인터페이스
  var editor = {
    config: {}
    ,index: 0
    ,that: {}

    // 전역 설정
    ,set: function(options){
      var $c = get$c();
      this.config = $c.extend({}, this.config, options);
      return this;
    }

    // 렌더링
    ,render: function(options){
      var inst = new Class(options);
      return inst.thisEditor();
    }

    // 인스턴스 가져오기
    ,getInst: function(id){
      return editor.that[id];
    }

    // 이벤트 등록
    ,on: function(events, callback){
      if(window.Catui && Catui.onevent){
        return Catui.onevent.call(this, MOD_NAME, events, callback);
      }
      return this;
    }
  };

  // 도구 정의
  var TOOLS = {
    bold: { icon: 'format_bold', title: '굵게', cmd: 'bold' },
    italic: { icon: 'format_italic', title: '기울임', cmd: 'italic' },
    underline: { icon: 'format_underlined', title: '밑줄', cmd: 'underline' },
    strikethrough: { icon: 'strikethrough_s', title: '취소선', cmd: 'strikethrough' },
    '|': { type: 'separator' },
    left: { icon: 'format_align_left', title: '왼쪽 정렬', cmd: 'justifyLeft' },
    center: { icon: 'format_align_center', title: '가운데 정렬', cmd: 'justifyCenter' },
    right: { icon: 'format_align_right', title: '오른쪽 정렬', cmd: 'justifyRight' },
    ul: { icon: 'format_list_bulleted', title: '글머리 기호', cmd: 'insertUnorderedList' },
    ol: { icon: 'format_list_numbered', title: '번호 매기기', cmd: 'insertOrderedList' },
    link: { icon: 'link', title: '링크', cmd: 'createLink' },
    unlink: { icon: 'link_off', title: '링크 제거', cmd: 'unlink' },
    image: { icon: 'image', title: '이미지 URL', cmd: 'insertImage' },
    upload: { icon: 'upload', title: '이미지 업로드', cmd: 'uploadImage' },
    hr: { icon: 'horizontal_rule', title: '구분선', cmd: 'insertHorizontalRule' },
    undo: { icon: 'undo', title: '실행 취소', cmd: 'undo' },
    redo: { icon: 'redo', title: '다시 실행', cmd: 'redo' },
    code: { icon: 'code', title: 'HTML 보기', cmd: 'html' },
    fullscreen: { icon: 'fullscreen', title: '전체화면', cmd: 'fullscreen' }
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
    that.config = $c.extend({}, that.defaults, editor.config, options);
    that.config.id = that.config.id || ('editor_' + that.index);
    that.key = that.config.id;
    
    editor.that[that.key] = that;
    that.render();
  };

  // 인스턴스 반환
  Class.prototype.thisEditor = function(){
    var that = this;
    return {
      getContent: function(){ return that.getContent(); }
      ,setContent: function(html){ that.setContent(html); }
      ,getText: function(){ return that.getText(); }
      ,focus: function(){ that.body.focus(); }
      ,reload: function(options){ that.reload(options); }
      ,config: that.config
    };
  };

  // 기본 설정
  Class.prototype.defaults = {
    elem: null              // 대상 요소 (textarea)
    ,id: ''                 // 고유 ID
    ,height: 300            // 높이
    ,tool: ['bold', 'italic', 'underline', '|', 'left', 'center', 'right', '|', 'ul', 'ol', '|', 'link', 'image', 'upload', '|', 'undo', 'redo', '|', 'code', 'fullscreen']
    ,placeholder: '내용을 입력하세요...'
    // 업로드 설정
    ,uploadUrl: ''          // 이미지 업로드 URL
    ,uploadField: 'file'    // 파일 필드명
    ,uploadAccept: 'images' // 허용 파일 타입
    ,uploadExts: 'jpg|jpeg|png|gif|bmp|webp' // 허용 확장자
    ,uploadSize: '10MB'     // 최대 파일 크기
    ,uploadData: {}         // 추가 전송 데이터
    ,uploadHeaders: {}      // 추가 헤더
    ,uploadDone: null       // 업로드 완료 콜백 (res) => url 반환
  };

  // 렌더링
  Class.prototype.render = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    that.elem = $c(config.elem);
    if(!that.elem[0]) return;

    // 원본 숨기기
    that.elem.hide();

    // 에디터 컨테이너
    var container = document.createElement('div');
    container.className = 'cui-editor';
    container.id = 'cui-editor-' + that.key;

    // 툴바
    var toolbar = document.createElement('div');
    toolbar.className = 'cui-editor-toolbar';
    config.tool.forEach(function(name){
      var tool = TOOLS[name];
      if(!tool) return;

      if(tool.type === 'separator'){
        var sep = document.createElement('span');
        sep.className = 'cui-editor-separator';
        toolbar.appendChild(sep);
      } else {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cui-editor-btn';
        btn.title = tool.title;
        btn.setAttribute('data-cmd', tool.cmd);
        btn.innerHTML = '<i class="cui-icon">' + tool.icon + '</i>';
        toolbar.appendChild(btn);
      }
    });
    container.appendChild(toolbar);

    // 편집 영역
    var body = document.createElement('div');
    body.className = 'cui-editor-body';
    body.contentEditable = 'true';
    body.style.height = config.height + 'px';
    body.setAttribute('data-placeholder', config.placeholder);
    
    // 초기 내용
    var initContent = that.elem.val() || that.elem.html();
    if(initContent){
      body.innerHTML = initContent;
    }
    
    container.appendChild(body);
    that.body = body;
    that.toolbar = toolbar;
    that.container = container;

    // 원본 요소 뒤에 삽입
    that.elem[0].parentNode.insertBefore(container, that.elem[0].nextSibling);

    // 이벤트 바인딩
    that.bindEvents();
  };

  // 이벤트 바인딩
  Class.prototype.bindEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    // 툴바 버튼 클릭
    $c(that.toolbar).find('.cui-editor-btn').each(function(i, btn){
      $c(btn).on('click', function(e){
        e.preventDefault();
        var cmd = this.getAttribute('data-cmd');
        that.execCommand(cmd);
      });
    });

    // 내용 변경 시 원본에 동기화
    $c(that.body).on('input', function(){
      that.syncToOriginal();
    });

    // 포커스/블러
    $c(that.body).on('focus', function(){
      $c(that.container).addClass('cui-editor-focus');
    }).on('blur', function(){
      $c(that.container).removeClass('cui-editor-focus');
      that.syncToOriginal();
    });
  };

  // 명령 실행
  Class.prototype.execCommand = function(cmd){
    var that = this
    ,$c = get$c();

    that.body.focus();

    switch(cmd){
      case 'createLink':
        var url = prompt('링크 URL을 입력하세요:', 'https://');
        if(url) document.execCommand(cmd, false, url);
        break;

      case 'insertImage':
        var imgUrl = prompt('이미지 URL을 입력하세요:', 'https://');
        if(imgUrl) document.execCommand(cmd, false, imgUrl);
        break;

      case 'uploadImage':
        that.openUploadPopup();
        break;

      case 'html':
        that.toggleHtml();
        break;

      case 'fullscreen':
        that.toggleFullscreen();
        break;

      default:
        document.execCommand(cmd, false, null);
    }

    that.syncToOriginal();
  };

  // HTML 모드 토글
  Class.prototype.toggleHtml = function(){
    var that = this
    ,$c = get$c();

    if(that.isHtmlMode){
      // HTML → WYSIWYG
      that.body.innerHTML = that.body.textContent;
      that.isHtmlMode = false;
      $c(that.container).removeClass('cui-editor-html');
    } else {
      // WYSIWYG → HTML
      that.body.textContent = that.body.innerHTML;
      that.isHtmlMode = true;
      $c(that.container).addClass('cui-editor-html');
    }
  };

  // 전체화면 토글
  Class.prototype.toggleFullscreen = function(){
    var that = this
    ,$c = get$c();

    if(that.isFullscreen){
      $c(that.container).removeClass('cui-editor-fullscreen');
      that.isFullscreen = false;
      document.body.style.overflow = '';
    } else {
      $c(that.container).addClass('cui-editor-fullscreen');
      that.isFullscreen = true;
      document.body.style.overflow = 'hidden';
    }
  };

  // 원본에 동기화
  Class.prototype.syncToOriginal = function(){
    var that = this;
    var content = that.isHtmlMode ? that.body.textContent : that.body.innerHTML;
    
    if(that.elem[0].tagName === 'TEXTAREA'){
      that.elem[0].value = content;
    } else {
      that.elem[0].innerHTML = content;
    }
  };

  // 내용 가져오기
  Class.prototype.getContent = function(){
    var that = this;
    return that.isHtmlMode ? that.body.textContent : that.body.innerHTML;
  };

  // 내용 설정
  Class.prototype.setContent = function(html){
    var that = this;
    that.body.innerHTML = html;
    that.syncToOriginal();
  };

  // 텍스트 가져오기
  Class.prototype.getText = function(){
    var that = this;
    return that.body.textContent || that.body.innerText;
  };

  // 리로드
  Class.prototype.reload = function(options){
    var that = this
    ,$c = get$c();
    
    that.container.remove();
    that.elem.show();
    that.config = $c.extend({}, that.config, options);
    that.render();
  };

  // 이미지 업로드 팝업 열기
  Class.prototype.openUploadPopup = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    // 선택 영역 저장 (팝업 열면 포커스 잃음)
    that.saveSelection();

    var hasUploadUrl = !!config.uploadUrl;

    // 팝업 내용 HTML
    var uploadHtml = '<div class="cui-editor-upload">';
    
    if(hasUploadUrl){
      // 업로드 URL이 있으면 업로드 영역 표시
      uploadHtml += '<div class="cui-editor-upload-area" id="editorUploadArea_' + that.key + '">' +
          '<i class="cui-icon">cloud_upload</i>' +
          '<p>클릭하거나 이미지를 드래그하세요</p>' +
          '<p class="cui-editor-upload-hint">허용: ' + config.uploadExts.split('|').join(', ') + ' (최대 ' + config.uploadSize + ')</p>' +
        '</div>' +
        '<div class="cui-editor-upload-preview" id="editorUploadPreview_' + that.key + '" style="display:none;">' +
          '<img id="editorUploadImg_' + that.key + '" />' +
          '<div class="cui-editor-upload-progress" id="editorUploadProgress_' + that.key + '"></div>' +
        '</div>';
    } else {
      // 업로드 URL이 없으면 안내 메시지
      uploadHtml += '<div class="cui-editor-upload-nourl">' +
          '<i class="cui-icon">info</i>' +
          '<p>업로드 서버가 설정되지 않았습니다.</p>' +
          '<p class="cui-editor-upload-hint">아래에 이미지 URL을 직접 입력하세요.</p>' +
        '</div>';
    }
    
    uploadHtml += '<div class="cui-editor-upload-url">' +
        '<input type="text" id="editorUploadUrl_' + that.key + '" class="cui-input" placeholder="이미지 URL을 입력하세요" />' +
      '</div>' +
    '</div>';

    // popup 모듈 사용
    if(!window.popup){
      console.error('popup 모듈이 필요합니다.');
      return;
    }

    var popupIdx = popup.open({
      type: 1
      ,title: '이미지 업로드'
      ,area: ['500px', 'auto']
      ,content: uploadHtml
      ,btn: ['삽입', '취소']
      ,yes: function(idx){
        var urlInput = document.getElementById('editorUploadUrl_' + that.key);
        var imgUrl = urlInput ? urlInput.value.trim() : '';
        
        if(imgUrl){
          that.restoreSelection();
          that.insertImage(imgUrl);
        }
        popup.close(idx);
      }
      ,success: function(layero){
        if(hasUploadUrl){
          that.initUploadArea();
        }
      }
    });

    that.uploadPopupIdx = popupIdx;
  };

  // 업로드 영역 초기화
  Class.prototype.initUploadArea = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    var areaId = 'editorUploadArea_' + that.key;
    var previewId = 'editorUploadPreview_' + that.key;
    var imgId = 'editorUploadImg_' + that.key;
    var progressId = 'editorUploadProgress_' + that.key;
    var urlInputId = 'editorUploadUrl_' + that.key;

    // upload 모듈 사용
    if(!window.upload){
      console.error('upload 모듈이 필요합니다.');
      return;
    }

    upload.render({
      elem: '#' + areaId
      ,url: config.uploadUrl
      ,field: config.uploadField
      ,accept: config.uploadAccept
      ,exts: config.uploadExts
      ,size: config.uploadSize
      ,data: config.uploadData
      ,headers: config.uploadHeaders
      ,drag: true
      ,choose: function(obj){
        // 미리보기
        obj.preview(function(index, file, result){
          var previewEl = document.getElementById(previewId);
          var areaEl = document.getElementById(areaId);
          var imgEl = document.getElementById(imgId);
          
          if(previewEl && areaEl && imgEl){
            areaEl.style.display = 'none';
            previewEl.style.display = 'block';
            imgEl.src = result;
          }
        });
      }
      ,progress: function(percent){
        var progressEl = document.getElementById(progressId);
        if(progressEl){
          progressEl.innerHTML = '<div class="cui-editor-upload-bar" style="width:' + percent + '%"></div>';
        }
      }
      ,done: function(res){
        var imgUrl = '';
        
        // uploadDone 콜백으로 URL 추출
        if(typeof config.uploadDone === 'function'){
          imgUrl = config.uploadDone(res);
        } else {
          // 기본: res.url 또는 res.data.url 또는 res.data.src
          imgUrl = res.url || (res.data && (res.data.url || res.data.src)) || '';
        }
        
        if(imgUrl){
          // URL 입력창에 표시
          var urlInput = document.getElementById(urlInputId);
          if(urlInput) urlInput.value = imgUrl;
          
          // 진행바 완료 표시
          var progressEl = document.getElementById(progressId);
          if(progressEl){
            progressEl.innerHTML = '<span class="cui-editor-upload-done">업로드 완료!</span>';
          }
        }
      }
      ,error: function(){
        var progressEl = document.getElementById(progressId);
        if(progressEl){
          progressEl.innerHTML = '<span class="cui-editor-upload-error">업로드 실패</span>';
        }
        // 다시 업로드할 수 있도록 영역 복구
        setTimeout(function(){
          var previewEl = document.getElementById(previewId);
          var areaEl = document.getElementById(areaId);
          if(previewEl) previewEl.style.display = 'none';
          if(areaEl) areaEl.style.display = 'block';
        }, 2000);
      }
    });
  };

  // 이미지 삽입
  Class.prototype.insertImage = function(url){
    var that = this;
    
    if(!url) return;
    
    that.body.focus();
    
    // 이미지 HTML 생성
    var img = '<img src="' + url + '" alt="" style="max-width:100%;" />';
    
    // 선택 영역에 삽입
    if(document.queryCommandSupported('insertHTML')){
      document.execCommand('insertHTML', false, img);
    } else {
      document.execCommand('insertImage', false, url);
    }
    
    that.syncToOriginal();
  };

  // 선택 영역 저장
  Class.prototype.saveSelection = function(){
    var that = this;
    
    if(window.getSelection){
      var sel = window.getSelection();
      if(sel.getRangeAt && sel.rangeCount){
        that.savedRange = sel.getRangeAt(0);
      }
    }
  };

  // 선택 영역 복원
  Class.prototype.restoreSelection = function(){
    var that = this;
    
    if(that.savedRange){
      if(window.getSelection){
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(that.savedRange);
      }
    }
    that.body.focus();
  };

  // 전역 노출
  window.editor = editor;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = editor;
  }

}(window);
