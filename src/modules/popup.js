/*!
 * Catui popup - 팝업/모달 컴포넌트
 * Based on layer.js, jQuery-free
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'popup'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 기본 설정
  ,ready = {
    btn: ['확인', '취소']
    ,type: ['dialog', 'page', 'iframe', 'loading', 'tips']
  }

  // 팝업 인덱스
  ,index = 0

  // 팝업 저장소
  ,popups = {};

  // 팝업 생성자
  var Class = function(config){
    var that = this;
    var $c = get$c();
    
    // $c가 없으면 대기 후 재시도
    if(!$c){
      setTimeout(function(){ new Class(config); }, 50);
      return;
    }
    
    that.index = ++index;
    that.config = $c.extend({}, that.defaults, config);
    that.create();
  };

  Class.prototype.defaults = {
    type: 0           // 0: dialog, 1: page, 2: iframe, 3: loading, 4: tips
    ,title: '알림'
    ,content: ''
    ,shade: 0.3       // 배경 투명도 (false: 배경 없음)
    ,shadeClose: false // 배경 클릭 시 닫기
    ,fixed: true      // 고정 위치
    ,move: true       // 드래그 이동 허용
    ,moveOut: false   // 화면 밖으로 이동 허용
    ,offset: 'auto'   // 위치: auto, t, r, b, l, lt, lb, rt, rb 또는 [top, left]
    ,area: 'auto'     // 크기: auto 또는 [width, height]
    ,maxmin: false    // 최대화/최소화 버튼
    ,closeBtn: true   // 닫기 버튼
    ,time: 0          // 자동 닫기 (ms, 0: 비활성)
    ,zIndex: 10000
    ,btn: false       // 버튼: false 또는 ['확인', '취소', ...]
    ,btnAlign: 'r'    // 버튼 정렬: l, c, r
    ,btnAsync: false  // 비동기 버튼 (Promise 지원)
    ,yes: null        // 첫 번째 버튼 콜백
    ,btn2: null       // 두 번째 버튼 콜백
    ,btn3: null       // 세 번째 버튼 콜백
    ,cancel: null     // 취소 콜백 (닫기/ESC/배경클릭)
    ,beforeEnd: null  // 닫기 전 콜백 (false 반환 시 취소)
    ,end: null        // 닫힌 후 콜백
    ,success: null    // 팝업 열린 후 콜백
    ,icon: -1         // 아이콘: -1(없음), 0(성공), 1(에러), 2(경고), 3(정보), 4(잠금), 5(슬픔), 6(웃음)
    ,skin: ''         // 추가 스킨 클래스
    ,anim: 0          // 애니메이션: 0~6, 또는 'slideDown', 'slideUp', 'slideLeft', 'slideRight'
    ,isOutAnim: true  // 닫힘 애니메이션
    ,scrollbar: true  // body 스크롤바 허용
    ,resize: false    // 크기 조절 허용
    ,minStack: true   // 최소화 스택
    ,maxWidth: 0      // 최대 너비 (0: 제한 없음)
    ,maxHeight: 0     // 최대 높이 (0: 제한 없음)
    ,moveEnd: null    // 드래그 종료 콜백
    ,resizing: null   // 리사이즈 중 콜백
    ,hideOnClose: false // 닫기 시 숨김 (재사용)
    ,id: ''           // 팝업 ID (중복 방지)
  };

  // 팝업 생성
  Class.prototype.create = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,times = that.index
    ,zIndex = config.zIndex + times;

    // 크기 처리
    var area = typeof config.area === 'string' 
      ? (config.area === 'auto' ? ['', ''] : [config.area, ''])
      : config.area;

    // 아이콘 HTML
    var iconHtml = '';
    if(config.icon !== -1){
      // Material Icons 기본 아이콘 이름
      var icons = ['check', 'close', 'priority_high', 'info', 'lock', 'mood_bad', 'mood'];
      var iconClasses = ['success', 'error', 'warning', 'info', 'lock', 'sad', 'happy'];
      iconHtml = '<span class="cui-popup-icon cui-popup-icon-' + (iconClasses[config.icon] || 'info') + '">'
        + '<i class="cui-icon">' + (icons[config.icon] || 'info') + '</i></span>';
    }

    // 버튼 HTML
    var btnHtml = '';
    if(config.btn){
      var btns = typeof config.btn === 'string' ? [config.btn] : config.btn;
      var alignMap = { l: 'flex-start', c: 'center', r: 'flex-end' };
      btnHtml = '<div class="cui-popup-btn" style="justify-content:' + (alignMap[config.btnAlign] || 'flex-end') + '">';
      for(var i = 0; i < btns.length; i++){
        btnHtml += '<a class="cui-popup-btn' + i + '">' + btns[i] + '</a>';
      }
      btnHtml += '</div>';
    }

    // 애니메이션 클래스
    var animClasses = ['cui-anim-scale', 'cui-anim-slide-top', 'cui-anim-slide-bottom', 
                     'cui-anim-slide-left', 'cui-anim-slide-right', 'cui-anim-fade', 'cui-anim-rotate'];
    
    // 문자열 애니메이션 매핑
    var animMap = {
      'slideDown': 'cui-anim-slide-top',
      'slideUp': 'cui-anim-slide-bottom',
      'slideLeft': 'cui-anim-slide-right',
      'slideRight': 'cui-anim-slide-left'
    };
    
    var animClass = '';
    if(typeof config.anim === 'string'){
      animClass = animMap[config.anim] || '';
    } else if(typeof config.anim === 'number'){
      animClass = animClasses[config.anim] || '';
    }

    // 팝업 HTML
    var html = '';
    
    // 배경 (shade: 숫자 또는 [투명도, 색상, transition])
    if(config.shade !== false){
      var shadeOpacity = 0.3;
      var shadeColor = '#000';
      var shadeTransition = '';
      
      if(Array.isArray(config.shade)){
        shadeOpacity = config.shade[0] || 0.3;
        shadeColor = config.shade[1] || '#000';
        shadeTransition = config.shade[2] ? 'transition:' + config.shade[2] + ';' : '';
      } else if(typeof config.shade === 'number'){
        shadeOpacity = config.shade;
      }
      
      html += '<div class="cui-popup-shade" id="cui-popup-shade' + times + '" '
        + 'style="z-index:' + (zIndex - 1) + ';background-color:' + shadeColor + ';opacity:' + shadeOpacity + ';' + shadeTransition + '"></div>';
    }

    // 타입별 처리
    var typeClass = ready.type[config.type] || 'dialog';
    var contentHtml = '';
    
    if(config.type === 2 && config.content){ // iframe
      contentHtml = '<iframe src="' + config.content + '" frameborder="0" class="cui-popup-iframe"></iframe>';
    } else if(config.type === 1 && typeof config.content === 'string' && config.content.charAt(0) === '#'){ // page (selector)
      var pageElem = document.querySelector(config.content);
      contentHtml = pageElem ? pageElem.innerHTML : config.content;
    } else {
      contentHtml = iconHtml + config.content;
    }

    // 메인 팝업
    html += '<div class="cui-popup cui-popup-' + typeClass + ' ' + (config.skin || '') + ' ' + animClass + '" '
      + 'id="cui-popup' + times + '" style="z-index:' + zIndex + ';'
      + (area[0] ? 'width:' + area[0] + ';' : '')
      + (area[1] ? 'height:' + area[1] + ';' : '')
      + (config.fixed ? 'position:fixed;' : 'position:absolute;')
      + '">';
    
    // 제목
    if(config.title !== false){
      html += '<div class="cui-popup-title"' + (config.move ? ' data-move="true"' : '') + '>'
        + '<span class="cui-popup-title-text">' + config.title + '</span>';
      
      // 최대화/최소화 버튼
      if(config.maxmin){
        html += '<span class="cui-popup-maxmin">'
          + '<i class="cui-icon cui-popup-min" title="최소화">remove</i>'
          + '<i class="cui-icon cui-popup-max" title="최대화">crop_square</i>'
          + '</span>';
      }
      
      // 닫기 버튼
      if(config.closeBtn){
        html += '<i class="cui-icon cui-popup-close" data-close="true">close</i>';
      }
      
      html += '</div>';
    } else {
      // 제목 없을 때 닫기 버튼
      if(config.closeBtn){
        html += '<i class="cui-icon cui-popup-close" data-close="true" style="position:absolute;top:10px;right:10px;">close</i>';
      }
    }
    
    // 내용
    html += '<div class="cui-popup-content">' + contentHtml + '</div>';
    
    // 버튼
    html += btnHtml;
    
    // 리사이즈 핸들러
    if(config.resize){
      html += '<span class="cui-popup-resize"></span>';
    }
    
    html += '</div>';

    // DOM에 추가
    var container = document.createElement('div');
    container.className = 'cui-popup-container';
    container.id = 'cui-popup-container' + times;
    container.innerHTML = html;
    document.body.appendChild(container);

    // 요소 참조
    that.container = container;
    that.layero = $c('#cui-popup' + times);
    that.shadeo = $c('#cui-popup-shade' + times);
    that.titleo = that.layero.find('.cui-popup-title');
    that.contento = that.layero.find('.cui-popup-content');

    // body 스크롤바 제어
    if(!config.scrollbar && config.shade !== false){
      document.body.style.overflow = 'hidden';
    }

    // 위치 설정 (tips 타입이 아닐 때만 - tips는 success에서 설정)
    if(!config._tips){
      that.offset();
    }

    // 이벤트 바인딩
    that.bindEvents();

    // 자동 닫기
    if(config.time > 0){
      that.timer = setTimeout(function(){
        popup.close(that.index);
      }, config.time);
    }

    // 저장
    popups[times] = that;

    // iframe 로드 완료 시 높이 자동 조정
    if(config.type === 2){
      var iframe = that.contento.find('iframe')[0];
      if(iframe){
        iframe.onload = function(){
          that.adjustIframeHeight();
        };
      }
    }

    // success 콜백 (DOM 요소 전달)
    if(typeof config.success === 'function'){
      config.success(that.layero[0], that.index);
    }
  };

  // iframe 높이 자동 조정
  Class.prototype.adjustIframeHeight = function(){
    var that = this
    ,config = that.config
    ,layero = that.layero[0];

    if(!layero) return;

    var iframe = that.contento.find('iframe')[0];
    if(!iframe) return;

    try {
      var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      var contentHeight = iframeDoc.body.scrollHeight || iframeDoc.documentElement.scrollHeight;
      
      // 팝업이 전체화면인지 확인
      var isFullscreen = layero.style.width === '100%' && layero.style.height === '100%';
      
      // 팝업 높이 기준 계산
      var popupHeight = isFullscreen ? window.innerHeight : (layero.offsetHeight || window.innerHeight * 0.7);
      var titleHeight = that.titleo[0] ? that.titleo[0].offsetHeight : 0;
      var btnElem = that.layero.find('.cui-popup-btn')[0];
      var btnHeight = btnElem ? btnElem.offsetHeight : 0;
      
      // 사용 가능한 높이 = 팝업 높이 - 제목 높이 - 버튼 높이
      var availableHeight = popupHeight - titleHeight - btnHeight;
      
      // 전체화면일 때는 사용 가능 높이로, 아닐 때는 최대 높이 제한
      var finalHeight;
      if(isFullscreen){
        finalHeight = availableHeight;
      } else {
        var maxHeight = window.innerHeight - 100;
        finalHeight = Math.min(contentHeight, availableHeight, maxHeight);
      }
      
      iframe.style.height = Math.max(200, finalHeight) + 'px';

      // 위치 재조정 (전체화면 아닐 때만)
      if(!isFullscreen){
        that.offset();
      }
    } catch(e){
      // cross-origin 오류 무시 - 기본 높이 적용
      var isFullscreen = layero.style.width === '100%' && layero.style.height === '100%';
      var titleHeight = that.titleo[0] ? that.titleo[0].offsetHeight : 0;
      var btnElem = that.layero.find('.cui-popup-btn')[0];
      var btnHeight = btnElem ? btnElem.offsetHeight : 0;
      
      if(isFullscreen){
        iframe.style.height = (window.innerHeight - titleHeight - btnHeight) + 'px';
      } else {
        iframe.style.height = '400px';
      }
    }
  };

  // 위치 계산
  Class.prototype.offset = function(){
    var that = this
    ,config = that.config
    ,layero = that.layero[0];

    if(!layero) return;

    var winW = window.innerWidth
    ,winH = window.innerHeight
    ,popW = layero.offsetWidth
    ,popH = layero.offsetHeight
    ,top = (winH - popH) / 2
    ,left = (winW - popW) / 2;

    // offset 설정에 따른 위치
    if(Array.isArray(config.offset)){
      top = parseFloat(config.offset[0]) || 0;
      left = config.offset[1] !== undefined ? parseFloat(config.offset[1]) : left;
    } else if(config.offset !== 'auto'){
      switch(config.offset){
        case 't': top = 0; break;
        case 'r': left = winW - popW; break;
        case 'b': top = winH - popH; break;
        case 'l': left = 0; break;
        case 'lt': top = 0; left = 0; break;
        case 'lb': top = winH - popH; left = 0; break;
        case 'rt': top = 0; left = winW - popW; break;
        case 'rb': top = winH - popH; left = winW - popW; break;
        default: top = parseFloat(config.offset);
      }
    }

    that.layero.css({
      top: Math.max(0, top) + 'px'
      ,left: Math.max(0, left) + 'px'
    });
  };

  // 이벤트 바인딩
  Class.prototype.bindEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    // 닫기 버튼
    that.layero.find('.cui-popup-close').on('click', function(){
      if(typeof config.cancel === 'function'){
        if(config.cancel(that.index, that.layero[0]) === false) return;
      }
      popup.close(that.index);
    });

    // 배경 클릭
    if(config.shadeClose && that.shadeo && that.shadeo[0]){
      that.shadeo.on('click', function(){
        if(typeof config.cancel === 'function'){
          if(config.cancel(that.index, that.layero[0]) === false) return;
        }
        popup.close(that.index);
      });
    }

    // 버튼 이벤트 (다중 버튼 지원)
    that.layero.find('.cui-popup-btn a').each(function(i, btn){
      $c(btn).on('click', function(){
        var callback = config['btn' + (i + 1)] || (i === 0 ? config.yes : null);
        if(typeof callback === 'function'){
          if(callback(that.index, that.layero[0]) === false) return;
        }
        popup.close(that.index);
      });
    });

    // 드래그 이동
    if(config.move && that.titleo[0]){
      that.initMove();
    }

    // 최대화/최소화
    if(config.maxmin){
      that.initMaxMin();
    }

    // 리사이즈
    if(config.resize){
      that.initResize();
    }

    // ESC 키로 닫기 (최상위 팝업만)
    that.escEvent = function(e){
      if(e.keyCode === 27){
        // 최상위 팝업인지 확인
        var maxIdx = 0;
        for(var key in popups){
          if(popups[key].layero && parseInt(key) > maxIdx){
            maxIdx = parseInt(key);
          }
        }
        if(that.index !== maxIdx) return;
        
        if(typeof config.cancel === 'function'){
          if(config.cancel(that.index, that.layero[0]) === false) return;
        }
        popup.close(that.index);
      }
    };
    document.addEventListener('keydown', that.escEvent);

    // 창 크기 변경 시 위치 재조정
    that.resizeEvent = function(){
      that.offset();
    };
    window.addEventListener('resize', that.resizeEvent);
  };

  // 드래그 이동 초기화
  Class.prototype.initMove = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,layero = that.layero[0]
    ,titleo = that.titleo[0];

    if(!titleo) return;

    var isDragging = false
    ,startX, startY, startTop, startLeft;

    titleo.style.cursor = 'move';

    var onMouseDown = function(e){
      if(e.target.closest('.cui-popup-maxmin') || e.target.closest('.cui-popup-close')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startTop = layero.offsetTop;
      startLeft = layero.offsetLeft;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    };

    var onMouseMove = function(e){
      if(!isDragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      var newTop = startTop + dy;
      var newLeft = startLeft + dx;

      // 화면 밖으로 이동 제한
      if(!config.moveOut){
        var maxTop = window.innerHeight - layero.offsetHeight;
        var maxLeft = window.innerWidth - layero.offsetWidth;
        newTop = Math.max(0, Math.min(newTop, maxTop));
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      }

      layero.style.top = newTop + 'px';
      layero.style.left = newLeft + 'px';
    };

    var onMouseUp = function(){
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      // moveEnd 콜백
      if(typeof config.moveEnd === 'function'){
        config.moveEnd(that.layero[0], that.index);
      }
    };

    titleo.addEventListener('mousedown', onMouseDown);
    that.moveCleanup = function(){
      titleo.removeEventListener('mousedown', onMouseDown);
    };
  };

  // 최대화/최소화 초기화
  Class.prototype.initMaxMin = function(){
    var that = this
    ,$c = get$c()
    ,layero = that.layero[0];

    var originalStyle = {
      width: layero.style.width
      ,height: layero.style.height
      ,top: layero.style.top
      ,left: layero.style.left
    };
    var isMaximized = false;

    // 최대화 버튼
    that.layero.find('.cui-popup-max').on('click', function(){
      if(isMaximized){
        // 복원
        layero.style.width = originalStyle.width;
        layero.style.height = originalStyle.height;
        layero.style.top = originalStyle.top;
        layero.style.left = originalStyle.left;
        layero.style.borderRadius = originalStyle.borderRadius || '';
        isMaximized = false;
      } else {
        // 최대화
        originalStyle = {
          width: layero.style.width
          ,height: layero.style.height
          ,top: layero.style.top
          ,left: layero.style.left
          ,borderRadius: layero.style.borderRadius
        };
        layero.style.width = '100%';
        layero.style.height = '100%';
        layero.style.top = '0';
        layero.style.left = '0';
        layero.style.borderRadius = '0';
        isMaximized = true;
      }
      
      // iframe 높이 재계산
      if(that.config.type === 2){
        setTimeout(function(){
          that.adjustIframeHeight();
        }, 50);
      }
    });

    // 최소화 버튼
    that.layero.find('.cui-popup-min').on('click', function(){
      popup.min(that.index);
    });
  };

  // 리사이즈 초기화
  Class.prototype.initResize = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,layero = that.layero[0]
    ,resizeElem = that.layero.find('.cui-popup-resize')[0];

    if(!resizeElem) return;

    var isDragging = false
    ,startX, startY, startWidth, startHeight;

    var onMouseDown = function(e){
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = layero.offsetWidth;
      startHeight = layero.offsetHeight;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    };

    var onMouseMove = function(e){
      if(!isDragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      var newWidth = Math.max(260, startWidth + dx);
      var newHeight = Math.max(100, startHeight + dy);

      layero.style.width = newWidth + 'px';
      layero.style.height = newHeight + 'px';

      // resizing 콜백
      if(typeof config.resizing === 'function'){
        config.resizing(that.layero[0], that.index);
      }
    };

    var onMouseUp = function(){
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    resizeElem.addEventListener('mousedown', onMouseDown);
    that.resizeCleanup = function(){
      resizeElem.removeEventListener('mousedown', onMouseDown);
    };
  };

  // 최소화 스택 관리
  var minStack = {
    index: 0
    ,arr: []
  };

  // 팝업 인터페이스
  var popup = {
    v: '2.0.0'
    ,zIndex: 10000
    ,getIndex: function(){ return index; }

    // 이벤트 등록
    ,on: function(events, callback){
      if(window.Catui && Catui.onevent){
        return Catui.onevent.call(this, MOD_NAME, events, callback);
      }
      return this;
    }

    // 팝업 열기
    ,open: function(config){
      var $c = get$c();
      config = config || {};
      
      // ID 중복 체크
      if(config.id){
        for(var key in popups){
          var inst = popups[key];
          if(inst.config && inst.config.id === config.id){
            // 기존 팝업이 있으면 표시
            if(config.hideOnClose || inst.config.hideOnClose){
              inst.layero.css('display', '');
              if(inst.shadeo) inst.shadeo.css('display', '');
              return parseInt(key);
            }
          }
        }
      }
      
      var popupInst = new Class(config);
      return popupInst.index;
    }

    // 팝업 닫기
    ,close: function(idx, callback){
      var inst = popups[idx];
      if(!inst) return;

      // 요소 로딩인 경우
      if(inst.overlay){
        inst.overlay.remove();
        delete popups[idx];
        if(typeof callback === 'function') callback();
        return;
      }

      var config = inst.config;
      var layero = inst.layero[0];

      // beforeEnd 콜백 처리
      if(typeof config.beforeEnd === 'function'){
        var result = config.beforeEnd(idx, inst.layero[0]);
        // Promise 지원
        if(result && typeof result.then === 'function'){
          result.then(function(res){
            if(res !== false) doClose();
          });
          return;
        }
        if(result === false) return;
      }

      doClose();

      function doClose(){
        // hideOnClose: 숨기기만 하고 제거하지 않음
        if(config.hideOnClose){
          inst.layero.css('display', 'none');
          if(inst.shadeo) inst.shadeo.css('display', 'none');
          if(typeof callback === 'function') callback();
          return;
        }

        // 타이머 클리어
        if(inst.timer) clearTimeout(inst.timer);

        // 이벤트 리스너 제거
        if(inst.escEvent) document.removeEventListener('keydown', inst.escEvent);
        if(inst.resizeEvent) window.removeEventListener('resize', inst.resizeEvent);
        if(inst.moveCleanup) inst.moveCleanup();
        if(inst.resizeCleanup) inst.resizeCleanup();

        // body 스크롤바 복원
        if(!config.scrollbar){
          document.body.style.overflow = '';
        }

        // 최소화 스택에서 제거
        if(inst.minLeft !== undefined){
          minStack.index--;
          minStack.arr.push(inst.minLeft);
        }

        // 닫힘 애니메이션
        var removeDOM = function(){
          if(typeof config.end === 'function'){
            config.end();
          }
          if(typeof callback === 'function'){
            callback();
          }
          if(inst.container && inst.container.parentNode){
            inst.container.parentNode.removeChild(inst.container);
          }
          delete popups[idx];
        };

        if(config.isOutAnim && layero){
          layero.classList.add('cui-anim-out');
          if(inst.shadeo && inst.shadeo[0]){
            inst.shadeo[0].style.opacity = '0';
          }
          setTimeout(removeDOM, 200);
        } else {
          removeDOM();
        }
      }
    }

    // 스타일 변경
    ,style: function(idx, options){
      var inst = popups[idx];
      if(!inst || !inst.layero) return;
      
      var layero = inst.layero[0];
      if(options.width !== undefined){
        layero.style.width = typeof options.width === 'number' ? options.width + 'px' : options.width;
      }
      if(options.height !== undefined){
        layero.style.height = typeof options.height === 'number' ? options.height + 'px' : options.height;
      }
      if(options.top !== undefined){
        layero.style.top = typeof options.top === 'number' ? options.top + 'px' : options.top;
      }
      if(options.left !== undefined){
        layero.style.left = typeof options.left === 'number' ? options.left + 'px' : options.left;
      }
    }

    // 전체화면 (최대화)
    ,full: function(idx){
      var inst = popups[idx];
      if(!inst || !inst.layero) return;
      if(inst.maxminStatus === 'max') return;
      if(inst.maxminStatus === 'min') popup.restore(idx);

      var layero = inst.layero[0];
      
      // 현재 상태 저장
      inst.originalStyle = {
        width: layero.style.width
        ,height: layero.style.height
        ,top: layero.style.top
        ,left: layero.style.left
        ,borderRadius: layero.style.borderRadius
      };
      
      inst.maxminStatus = 'max';
      
      layero.style.width = '100%';
      layero.style.height = '100%';
      layero.style.top = '0';
      layero.style.left = '0';
      layero.style.borderRadius = '0';
      
      inst.layero.find('.cui-popup-max').addClass('cui-popup-maxed');
      inst.layero.find('.cui-popup-min').css('display', 'none');
    }

    // 최소화
    ,min: function(idx){
      var inst = popups[idx];
      if(!inst || !inst.layero) return;
      if(inst.maxminStatus === 'min') return;
      if(inst.maxminStatus === 'max') popup.restore(idx);

      var layero = inst.layero[0];
      var config = inst.config;
      var titHeight = inst.titleo[0] ? inst.titleo[0].offsetHeight : 40;
      
      // 현재 상태 저장
      inst.originalStyle = {
        width: layero.style.width
        ,height: layero.style.height
        ,top: layero.style.top
        ,left: layero.style.left
        ,position: layero.style.position
      };
      
      inst.maxminStatus = 'min';
      
      // 최소화 위치 계산
      var minWidth = 180;
      var left;
      if(minStack.arr.length > 0){
        left = minStack.arr.shift();
      } else {
        left = minStack.index * (minWidth + 1);
        minStack.index++;
      }
      inst.minLeft = left;
      
      layero.style.width = minWidth + 'px';
      layero.style.height = titHeight + 'px';
      layero.style.left = left + 'px';
      layero.style.top = (window.innerHeight - titHeight) + 'px';
      layero.style.position = 'fixed';
      layero.style.overflow = 'hidden';
      
      inst.layero.find('.cui-popup-min').css('display', 'none');
      if(inst.shadeo) inst.shadeo.css('display', 'none');
    }

    // 복원
    ,restore: function(idx){
      var inst = popups[idx];
      if(!inst || !inst.layero || !inst.originalStyle) return;

      var layero = inst.layero[0];
      var orig = inst.originalStyle;
      
      layero.style.width = orig.width;
      layero.style.height = orig.height;
      layero.style.top = orig.top;
      layero.style.left = orig.left;
      layero.style.borderRadius = orig.borderRadius || '';
      layero.style.position = orig.position || '';
      layero.style.overflow = '';
      
      // 최소화 스택에서 제거
      if(inst.minLeft !== undefined){
        minStack.index--;
        minStack.arr.push(inst.minLeft);
        delete inst.minLeft;
      }
      
      inst.maxminStatus = null;
      inst.layero.find('.cui-popup-max').removeClass('cui-popup-maxed');
      inst.layero.find('.cui-popup-min').css('display', '');
      if(inst.shadeo) inst.shadeo.css('display', '');
    }

    // 최상위로 올리기
    ,setTop: function(idx){
      var inst = popups[idx];
      if(!inst || !inst.layero) return;
      
      popup.zIndex++;
      inst.layero.css('z-index', popup.zIndex);
      if(inst.shadeo) inst.shadeo.css('z-index', popup.zIndex - 1);
    }

    // iframe URL 변경
    ,iframeSrc: function(idx, url){
      var inst = popups[idx];
      if(!inst || !inst.layero) return;
      
      var iframe = inst.layero.find('iframe')[0];
      if(iframe) iframe.src = url;
    }

    // 모든 팝업 닫기
    ,closeAll: function(type, callback){
      var count = 0;
      var total = Object.keys(popups).length;
      
      for(var idx in popups){
        var inst = popups[idx];
        // toast, elem 로딩은 config가 없음
        if(inst.toast || inst.overlay){
          if(type === undefined){
            popup.close(idx, onClose);
          } else {
            onClose();
          }
        } else if(type === undefined || (inst.config && inst.config.type === type)){
          popup.close(idx, onClose);
        } else {
          onClose();
        }
      }
      
      function onClose(){
        count++;
        if(count >= total && typeof callback === 'function'){
          callback();
        }
      }
      
      if(total === 0 && typeof callback === 'function'){
        callback();
      }
    }

    // 마지막 팝업 닫기
    ,closeLast: function(type, callback){
      var lastIdx = 0;
      var lastInst = null;
      
      for(var idx in popups){
        var inst = popups[idx];
        if(inst.toast || inst.overlay) continue;
        if(type !== undefined && inst.config && inst.config.type !== type) continue;
        
        var numIdx = parseInt(idx);
        if(numIdx > lastIdx){
          lastIdx = numIdx;
          lastInst = inst;
        }
      }
      
      if(lastInst){
        popup.close(lastIdx, callback);
      }
    }

    // 탭 레이어
    ,tab: function(options){
      var $c = get$c();
      options = options || {};
      
      var tabs = options.tab || [];
      if(!tabs.length) return;
      
      var THIS = 'cui-this';
      var success = options.success;
      delete options.success;
      
      // 탭 내용 HTML
      var contentHtml = '<div class="cui-popup-tab-header">' 
        + tabs.map(function(item, i){
          return '<span class="cui-popup-tab-title' + (i === 0 ? ' ' + THIS : '') + '">' + item.title + '</span>';
        }).join('')
        + '</div>'
        + '<div class="cui-popup-tab-main">' + tabs.map(function(item, i){
          return '<div class="cui-popup-tab-item' + (i === 0 ? ' ' + THIS : '') + '">' + (item.content || '') + '</div>';
        }).join('') + '</div>';
      
      return popup.open($c.extend({
        type: 1
        ,title: false
        ,content: contentHtml
        ,skin: 'cui-popup-tab'
        ,resize: false
        ,success: function(layero, idx){
          var $layero = $c(layero);
          var titles = $layero.find('.cui-popup-tab-title');
          var items = $layero.find('.cui-popup-tab-item');
          
          titles.each(function(i, elem){
            $c(elem).on('click', function(e){
              e.stopPropagation();
              titles.removeClass(THIS);
              $c(this).addClass(THIS);
              items.removeClass(THIS);
              items.eq(i).addClass(THIS);
              
              if(typeof options.change === 'function'){
                options.change(i);
              }
            });
          });
          
          if(typeof success === 'function'){
            success(layero, idx);
          }
        }
      }, options));
    }

    // 특정 팝업 가져오기
    ,getPopup: function(idx){
      return popups[idx];
    }

    // 팝업 제목 변경
    ,title: function(title, idx){
      var inst = popups[idx];
      if(inst && inst.titleo[0]){
        inst.titleo.find('.cui-popup-title-text').html(title);
      }
    }

    // 팝업 내용 변경  
    ,content: function(content, idx){
      var inst = popups[idx];
      if(inst && inst.contento[0]){
        inst.contento.html(content);
      }
    }

    // iframe 가져오기
    ,getChildFrame: function(selector, idx){
      var inst = popups[idx];
      if(!inst) return null;
      var iframe = inst.layero.find('iframe')[0];
      if(!iframe) return null;
      var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      return selector ? iframeDoc.querySelector(selector) : iframeDoc;
    }

    // iframe window 가져오기
    ,getFrameIndex: function(win){
      for(var idx in popups){
        var iframe = popups[idx].layero.find('iframe')[0];
        if(iframe && iframe.contentWindow === win){
          return parseInt(idx);
        }
      }
      return null;
    }

    // iframe 전체 높이로 조정
    ,iframeAuto: function(idx){
      var inst = popups[idx];
      if(!inst) return;
      var iframe = inst.layero.find('iframe')[0];
      if(!iframe) return;
      try {
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        var height = iframeDoc.body.scrollHeight;
        iframe.style.height = height + 'px';
      } catch(_e){}
    }

    // 알림 팝업
    ,alert: function(content, options, yes){
      var type = typeof options === 'function';
      if(type) yes = options;

      return popup.open(get$c().extend({
        content: content
        ,btn: [ready.btn[0]]
        ,yes: function(idx){
          if(typeof yes === 'function') yes(idx);
          popup.close(idx);
        }
      }, type ? {} : options));
    }

    // 확인 팝업
    ,confirm: function(content, options, yes, cancel){
      var type = typeof options === 'function';
      if(type){
        cancel = yes;
        yes = options;
      }

      return popup.open(get$c().extend({
        content: content
        ,btn: ready.btn
        ,yes: function(idx){
          if(typeof yes === 'function') yes(idx);
          popup.close(idx);
        }
        ,cancel: cancel
      }, type ? {} : options));
    }

    // 메시지 팝업 (Alert 스타일)
    // icon: 0=success, 1=error, 2=warning, 3=info
    ,msg: function(content, options, end){
      var type = typeof options === 'function';
      if(type) end = options;
      
      options = type ? {} : (options || {});
      
      // 아이콘 타입에 따른 스킨 클래스
      var iconTypes = ['success', 'error', 'warning', 'info'];
      var iconType = iconTypes[options.icon] || 'info';
      var skinClass = 'cui-popup-msg cui-popup-msg-' + iconType;

      var config = get$c().extend({
        content: content
        ,time: 3000
        ,shade: false
        ,title: false
        ,closeBtn: options.closeBtn || false
        ,btn: false
        ,skin: skinClass
        ,icon: options.icon !== undefined ? options.icon : 3
        ,end: end
      }, options);

      return popup.open(config);
    }

    // 로딩 팝업
    // icon: 0=CSS스피너, 1=refresh, 2=sync, 3=hourglass_empty
    // options.text: 로딩 텍스트
    // options.elem: 특정 요소에 로딩 표시
    ,load: function(icon, options){
      var $c = get$c();
      
      // 파라미터 정규화
      if(typeof icon === 'object'){
        options = icon;
        icon = 0;
      }
      icon = icon || 0;
      options = options || {};
      
      // 아이콘 종류
      var iconHtml = '';
      if(icon === 0){
        // CSS 스피너
        iconHtml = '<div class="cui-popup-loading-icon"></div>';
      } else {
        // Material Icons
        var icons = ['refresh', 'refresh', 'sync', 'hourglass_empty'];
        iconHtml = '<i class="cui-icon cui-popup-loading-anim">' + (icons[icon] || 'refresh') + '</i>';
      }
      
      // 텍스트 추가
      var text = options.text || '';
      if(text){
        iconHtml += '<div class="cui-popup-loading-text">' + text + '</div>';
      }

      // 특정 요소에 로딩 표시
      if(options.elem){
        var targetElem = typeof options.elem === 'string' ? document.querySelector(options.elem) : options.elem;
        if(targetElem){
          // 기존 로딩 제거
          var existingLoading = targetElem.querySelector('.cui-elem-loading');
          if(existingLoading) existingLoading.remove();
          
          // 요소의 position 확인
          var position = window.getComputedStyle(targetElem).position;
          if(position === 'static'){
            targetElem.style.position = 'relative';
          }
          
          // 로딩 오버레이 생성
          var loadingOverlay = document.createElement('div');
          loadingOverlay.className = 'cui-elem-loading';
          loadingOverlay.innerHTML = iconHtml;
          targetElem.appendChild(loadingOverlay);
          
          // 인덱스 반환 (제거용)
          var elemIdx = 'elem_' + (++index);
          popups[elemIdx] = { elem: targetElem, overlay: loadingOverlay };
          return elemIdx;
        }
      }

      return popup.open($c.extend({
        type: 3
        ,title: false
        ,closeBtn: false
        ,btn: false
        ,shade: options.shade !== undefined ? options.shade : 0.1
        ,shadeClose: false
        ,content: iconHtml
        ,skin: 'cui-popup-loading' + (options.nobg ? ' cui-popup-loading-nobg' : '')
      }, options));
    }

    // 입력 팝업 (prompt)
    ,prompt: function(options, yes){
      var $c = get$c();
      
      // 옵션 정규화
      if(typeof options === 'function'){
        yes = options;
        options = {};
      }
      options = options || {};

      var formType = options.formType || 0; // 0: text, 1: password, 2: textarea
      var value = options.value || '';
      var placeholder = options.placeholder || '';
      var maxlength = options.maxlength || '';
      
      var inputHtml = '';
      if(formType === 2){
        inputHtml = '<textarea class="cui-input cui-popup-prompt-input" placeholder="' + placeholder + '"'
          + (maxlength ? ' maxlength="' + maxlength + '"' : '') + '>' + value + '</textarea>';
      } else {
        inputHtml = '<input type="' + (formType === 1 ? 'password' : 'text') + '" class="cui-input cui-popup-prompt-input" '
          + 'value="' + value + '" placeholder="' + placeholder + '"'
          + (maxlength ? ' maxlength="' + maxlength + '"' : '') + '>';
      }

      return popup.open($c.extend({
        title: options.title || '입력'
        ,content: inputHtml
        ,btn: ready.btn
        ,area: options.area || '380px'
        ,success: function(layero, idx){
          var input = layero.querySelector('.cui-popup-prompt-input');
          if(input){
            input.focus();
            // Enter 키로 확인
            input.addEventListener('keydown', function(e){
              if(e.keyCode === 13 && formType !== 2){
                layero.querySelector('.cui-popup-btn0').click();
              }
            });
          }
        }
        ,yes: function(idx, layero){
          var input = layero.querySelector('.cui-popup-prompt-input');
          var val = input ? input.value : '';
          if(typeof yes === 'function'){
            yes(val, idx, layero);
          }
        }
      }, options));
    }

    // 툴팁 (특정 요소 근처에 표시)
    ,tips: function(content, follow, options){
      var $c = get$c();
      options = options || {};
      
      var followElem = typeof follow === 'string' ? document.querySelector(follow) : follow;
      if(!followElem) return popup.msg(content);

      var guide = options.tips || 3; // 1: 위, 2: 오른쪽, 3: 아래, 4: 왼쪽

      var idx = popup.open($c.extend({
        content: content
        ,time: options.time || 3000
        ,shade: false
        ,title: false
        ,closeBtn: false
        ,btn: false
        ,skin: 'cui-popup-tips cui-popup-tips-' + guide
        ,anim: 5
        ,isOutAnim: false
        ,_tips: true  // tips 플래그 (offset 건너뛰기용)
        ,success: function(layero, index){
          // 요소의 뷰포트 기준 좌표
          var rect = followElem.getBoundingClientRect();
          var popW = layero.offsetWidth;
          var popH = layero.offsetHeight;
          
          var tipTop, tipLeft;
          
          switch(guide){
            case 1: // 위
              tipTop = rect.top - popH - 10;
              tipLeft = rect.left;
              break;
            case 2: // 오른쪽
              tipTop = rect.top;
              tipLeft = rect.right + 10;
              break;
            case 3: // 아래
              tipTop = rect.bottom + 10;
              tipLeft = rect.left;
              break;
            case 4: // 왼쪽
              tipTop = rect.top;
              tipLeft = rect.left - popW - 10;
              break;
          }
          
          layero.style.position = 'fixed';
          layero.style.top = tipTop + 'px';
          layero.style.left = tipLeft + 'px';
        }
      }, options));
      
      return idx;
    }

    // 사진 보기 (강화된 버전)
    ,photos: function(options){
      var $c = get$c();
      options = $c.extend({
        toolbar: true    // 툴바 표시
        ,footer: true    // 푸터 표시
      }, options || {});
      
      var photos = options.photos || { data: [] };
      var data = photos.data || [];
      var start = photos.start || 0;

      if(!data.length) return popup.msg('표시할 이미지가 없습니다.');

      var current = start;
      var scale = 1;
      var rotate = 0;
      var scaleX = 1;

      var updateTransform = function(img){
        img.style.transform = 'scale(' + scale + ') rotate(' + rotate + 'deg) scaleX(' + scaleX + ')';
      };

      var showPhoto = function(layero, idx){
        var $layero = $c(layero);
        var img = $layero.find('.cui-popup-photos-img')[0];
        img.src = data[current].src;
        
        // 푸터 업데이트
        $layero.find('.cui-popup-photos-title').html(data[current].alt || '');
        $layero.find('.cui-popup-photos-page').html((current + 1) + ' / ' + data.length);
        
        // 변환 초기화
        scale = 1;
        rotate = 0;
        scaleX = 1;
        updateTransform(img);
      };

      // 툴바 HTML
      var toolbarHtml = options.toolbar ? '<div class="cui-popup-photos-toolbar">'
        + '<span class="cui-popup-photos-tool" data-action="zoomin" title="확대"><i class="cui-icon">add</i></span>'
        + '<span class="cui-popup-photos-tool" data-action="zoomout" title="축소"><i class="cui-icon">remove</i></span>'
        + '<span class="cui-popup-photos-tool" data-action="rotate" title="회전"><i class="cui-icon">refresh</i></span>'
        + '<span class="cui-popup-photos-tool" data-action="flip" title="좌우반전"><i class="cui-icon">flip</i></span>'
        + '<span class="cui-popup-photos-tool" data-action="reset" title="초기화"><i class="cui-icon">restart_alt</i></span>'
        + '<span class="cui-popup-photos-tool" data-action="close" title="닫기"><i class="cui-icon">close</i></span>'
        + '</div>' : '';

      // 푸터 HTML
      var footerHtml = options.footer ? '<div class="cui-popup-photos-footer">'
        + '<span class="cui-popup-photos-title">' + (data[current].alt || '') + '</span>'
        + '<span class="cui-popup-photos-page">' + (current + 1) + ' / ' + data.length + '</span>'
        + '</div>' : '';

      var html = '<div class="cui-popup-photos">'
        + toolbarHtml
        + '<div class="cui-popup-photos-main">'
        + '<img class="cui-popup-photos-img" src="' + data[current].src + '" alt="' + (data[current].alt || '') + '">'
        + '</div>'
        + (data.length > 1 ? '<div class="cui-popup-photos-nav">'
          + '<span class="cui-popup-photos-prev"><i class="cui-icon">chevron_left</i></span>'
          + '<span class="cui-popup-photos-next"><i class="cui-icon">chevron_right</i></span>'
          + '</div>' : '')
        + footerHtml
        + '</div>';

      var idx = popup.open($c.extend({
        type: 1
        ,title: false
        ,content: html
        ,skin: 'cui-popup-photos-view'
        ,shade: [0.9, '#000']
        ,shadeClose: true
        ,closeBtn: false
        ,move: '.cui-popup-photos-main'
        ,moveOut: true
        ,offset: 'auto'
        ,success: function(layero, index){
          var $layero = $c(layero);
          var img = $layero.find('.cui-popup-photos-img')[0];
          
          // 이미지 로드 후 위치 재계산
          img.onload = function(){
            var winW = window.innerWidth;
            var winH = window.innerHeight;
            var popW = layero.offsetWidth;
            var popH = layero.offsetHeight;
            layero.style.top = Math.max(0, (winH - popH) / 2) + 'px';
            layero.style.left = Math.max(0, (winW - popW) / 2) + 'px';
          };
          
          // 이전/다음
          if(data.length > 1){
            $layero.find('.cui-popup-photos-prev').on('click', function(){
              current = current > 0 ? current - 1 : data.length - 1;
              showPhoto(layero, index);
            });
            
            $layero.find('.cui-popup-photos-next').on('click', function(){
              current = current < data.length - 1 ? current + 1 : 0;
              showPhoto(layero, index);
            });
          }

          // 툴바 이벤트
          $layero.find('.cui-popup-photos-tool').each(function(i, elem){
            $c(elem).on('click', function(){
              var action = this.getAttribute('data-action');
              switch(action){
                case 'zoomin':
                  scale = Math.min(3, scale + 0.1);
                  break;
                case 'zoomout':
                  scale = Math.max(0.1, scale - 0.1);
                  break;
                case 'rotate':
                  rotate = (rotate + 90) % 360;
                  break;
                case 'flip':
                  scaleX = scaleX === 1 ? -1 : 1;
                  break;
                case 'reset':
                  scale = 1;
                  rotate = 0;
                  scaleX = 1;
                  break;
                case 'close':
                  popup.close(index);
                  return;
              }
              updateTransform(img);
            });
          });

          // 마우스 휠 줌
          $layero.find('.cui-popup-photos-main').on('wheel', function(e){
            e.preventDefault();
            var delta = e.originalEvent ? e.originalEvent.deltaY : e.deltaY;
            if(delta < 0){
              scale = Math.min(3, scale + 0.1);
            } else {
              scale = Math.max(0.1, scale - 0.1);
            }
            updateTransform(img);
          });

          // 키보드 네비게이션
          var keyHandler = function(e){
            switch(e.keyCode){
              case 37: // 왼쪽
                if(data.length > 1){
                  current = current > 0 ? current - 1 : data.length - 1;
                  showPhoto(layero, index);
                }
                break;
              case 39: // 오른쪽
                if(data.length > 1){
                  current = current < data.length - 1 ? current + 1 : 0;
                  showPhoto(layero, index);
                }
                break;
              case 27: // ESC
                popup.close(index);
                break;
            }
          };
          document.addEventListener('keydown', keyHandler);
          
          // 정리
          var inst = popups[index];
          if(inst){
            var origEnd = inst.config.end;
            inst.config.end = function(){
              document.removeEventListener('keydown', keyHandler);
              if(typeof origEnd === 'function') origEnd();
            };
          }
        }
      }, options));
      
      return idx;
    }

    // Toast 알림 (여러 개 쌓임)
    // position: 'rt'(우상단), 'rb'(우하단), 'lt'(좌상단), 'lb'(좌하단)
    // 사용법: popup.toast('메시지', { icon: 1 }) 또는 popup.toast({ content: '메시지', icon: 1 })
    ,toast: function(content, options){
      var $c = get$c();
      
      // 첫 번째 인자가 객체인 경우 처리
      if(typeof content === 'object' && content !== null){
        options = content;
        content = options.content || '';
      }
      options = options || {};
      
      var position = options.position || 'rt'; // 기본 우상단
      var icon = options.icon !== undefined ? options.icon : 3; // 기본 info
      
      // 아이콘 타입
      var icons = ['check_circle', 'error', 'warning', 'info'];
      var iconTypes = ['success', 'error', 'warning', 'info'];
      var iconType = iconTypes[icon] || 'info';
      
      // 아이콘 HTML
      var iconHtml = '<span class="cui-toast-icon">'
        + '<i class="cui-icon">' + (icons[icon] || 'info') + '</i></span>';
      
      // 제목과 내용 분리
      var title = options.title || '';
      var titleHtml = title ? '<div class="cui-toast-title">' + title + '</div>' : '';
      var textHtml = '<div class="cui-toast-text">' + content + '</div>';
      
      // Toast 컨테이너 확인/생성
      var containerId = 'cui-toast-container-' + position;
      var container = document.getElementById(containerId);
      if(!container){
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'cui-toast-container cui-toast-' + position;
        document.body.appendChild(container);
      }
      
      // Toast 요소 생성
      var toastElem = document.createElement('div');
      toastElem.className = 'cui-toast cui-toast-' + iconType;
      toastElem.innerHTML = iconHtml 
        + '<div class="cui-toast-content">' + titleHtml + textHtml + '</div>'
        + (options.closeBtn !== false ? '<span class="cui-toast-close"><i class="cui-icon">close</i></span>' : '');
      
      container.appendChild(toastElem);
      
      // 인덱스
      var toastIdx = 'toast_' + (++index);
      
      // 닫기 함수
      var closeToast = function(){
        toastElem.classList.add('cui-anim-out');
        setTimeout(function(){
          if(toastElem.parentNode){
            toastElem.parentNode.removeChild(toastElem);
          }
          // 컨테이너가 비었으면 제거
          if(container.children.length === 0 && container.parentNode){
            container.parentNode.removeChild(container);
          }
          delete popups[toastIdx];
          if(typeof options.end === 'function') options.end();
        }, 200);
      };
      
      // 닫기 버튼 이벤트
      var closeBtn = toastElem.querySelector('.cui-toast-close');
      if(closeBtn){
        closeBtn.addEventListener('click', function(){
          if(timer) clearTimeout(timer);
          closeToast();
        });
      }
      
      // 자동 닫기
      var time = options.time !== undefined ? options.time : 3000;
      var timer = null;
      if(time > 0){
        timer = setTimeout(closeToast, time);
      }
      
      popups[toastIdx] = { toast: toastElem, close: closeToast, timer: timer };
      return toastIdx;
    }

    // 공지 (하루 동안 안보기)
    // options.id: 공지 식별자 (필수)
    // options.hideToday: true면 "오늘 하루 안보기" 체크박스 표시
    ,notice: function(content, options){
      var $c = get$c();
      options = options || {};
      
      var noticeId = options.id || 'default';
      var storageKey = 'cui_notice_hide_' + noticeId;
      
      // 오늘 안보기 체크
      if(options.hideToday !== false){
        var hideUntil = localStorage.getItem(storageKey);
        if(hideUntil){
          var hideDate = new Date(parseInt(hideUntil));
          if(new Date() < hideDate){
            return null; // 숨김 기간 중
          }
        }
      }
      
      var idx = popup.open($c.extend({
        title: options.title || '공지'
        ,content: content
        ,area: options.area || '400px'
        ,btn: options.btn || ['닫기']
        ,shadeClose: true
        ,skin: 'cui-popup-notice'
        ,success: function(layero, index){
          // 체크박스를 버튼 영역에 추가
          if(options.hideToday !== false){
            var btnArea = layero.querySelector('.cui-popup-btn');
            if(btnArea){
              var checkDiv = document.createElement('div');
              checkDiv.className = 'cui-notice-hide';
              checkDiv.innerHTML = '<label><input type="checkbox" class="cui-notice-hide-check"> 오늘 하루 안보기</label>';
              btnArea.insertBefore(checkDiv, btnArea.firstChild);
            }
          }
        }
        ,yes: function(index, layero){
          // 체크박스 확인
          var checkbox = layero.querySelector('.cui-notice-hide-check');
          if(checkbox && checkbox.checked){
            // 오늘 자정까지 숨김
            var tomorrow = new Date();
            tomorrow.setHours(24, 0, 0, 0);
            localStorage.setItem(storageKey, tomorrow.getTime());
          }
          popup.close(index);
          if(typeof options.yes === 'function') options.yes(index);
        }
      }, options));
      
      return idx;
    }

    // 공지 숨김 초기화
    ,noticeReset: function(id){
      var storageKey = 'cui_notice_hide_' + (id || 'default');
      localStorage.removeItem(storageKey);
    }

    // Drawer (슬라이드 오버레이 패널)
    // direction: 't'(위), 'r'(오른쪽), 'b'(아래), 'l'(왼쪽)
    ,drawer: function(options){
      var $c = get$c();
      options = options || {};
      
      var direction = options.direction || 'r'; // 기본 오른쪽
      var size = options.size || '300px';
      var success = options.success;
      delete options.success;
      
      // 방향별 설정
      var dirConfig = {
        't': { 
          area: ['100%', size],
          offset: 't',
          anim: 'slideDown',
          outAnim: 'cui-drawer-out-top'
        },
        'r': { 
          area: [size, '100%'],
          offset: 'r',
          anim: 'slideLeft',
          outAnim: 'cui-drawer-out-right'
        },
        'b': { 
          area: ['100%', size],
          offset: 'b',
          anim: 'slideUp',
          outAnim: 'cui-drawer-out-bottom'
        },
        'l': { 
          area: [size, '100%'],
          offset: 'l',
          anim: 'slideRight',
          outAnim: 'cui-drawer-out-left'
        }
      };
      
      var config = dirConfig[direction] || dirConfig['r'];
      
      return popup.open($c.extend({
        type: 1
        ,title: options.title !== undefined ? options.title : '패널'
        ,content: options.content || ''
        ,area: config.area
        ,offset: config.offset
        ,anim: config.anim
        ,skin: 'cui-popup-drawer cui-popup-drawer-' + direction
        ,shade: options.shade !== undefined ? options.shade : 0.3
        ,shadeClose: options.shadeClose !== undefined ? options.shadeClose : true
        ,move: false
        ,resize: false
        ,scrollbar: false
        ,success: function(layero, idx){
          // 닫힘 애니메이션 클래스 저장
          var inst = popups[idx];
          if(inst) inst.drawerOutAnim = config.outAnim;
          
          if(typeof success === 'function'){
            success(layero, idx);
          }
        }
      }, options));
    }
  };

  // 전역 노출
  window.popup = popup;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = popup;
  }

}(window);
