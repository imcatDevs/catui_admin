/*!
 * Catui editor - 리치 에디터 모듈
 * MIT Licensed
 */

;!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'editor'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 인덱스
  ,index = 0

  // 인스턴스 저장
  ,instances = {};

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
    image: { icon: 'image', title: '이미지', cmd: 'insertImage' },
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
    ,tool: ['bold', 'italic', 'underline', '|', 'left', 'center', 'right', '|', 'ul', 'ol', '|', 'link', 'image', '|', 'undo', 'redo', '|', 'code', 'fullscreen']
    ,placeholder: '내용을 입력하세요...'
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

  // 전역 노출
  window.editor = editor;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = editor;
  }

}(window);
