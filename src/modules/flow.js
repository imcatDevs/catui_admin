/*!
 * Catui flow - 무한 스크롤 모듈
 * MIT Licensed
 */

;!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'flow'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 인덱스
  ,index = 0

  // 인스턴스 저장
  ,instances = {};

  // 외부 인터페이스
  var flow = {
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
      return inst.thisFlow();
    }

    // 로드 (간단 버전)
    ,load: function(options){
      return this.render(options);
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
    that.config = $c.extend({}, that.defaults, flow.config, options);
    that.config.id = that.config.id || ('flow_' + that.index);
    that.key = that.config.id;
    
    instances[that.key] = that;
    that.page = 1;
    that.loading = false;
    that.ended = false;
    
    that.init();
  };

  // 인스턴스 반환
  Class.prototype.thisFlow = function(){
    var that = this;
    return {
      reload: function(){ that.reload(); }
      ,more: function(){ that.loadMore(); }
      ,config: that.config
    };
  };

  // 기본 설정
  Class.prototype.defaults = {
    elem: null              // 컨테이너
    ,scrollElem: null       // 스크롤 대상 (기본: window)
    ,isAuto: true           // 자동 로드
    ,isLazyimg: false       // 이미지 레이지 로드
    ,end: '더 이상 데이터가 없습니다.'  // 종료 메시지
    ,distance: 100          // 하단 거리 (px)
    ,done: null             // 로드 완료 콜백
    ,mb: 20                 // 아이템 마진
  };

  // 초기화
  Class.prototype.init = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    that.elem = $c(config.elem);
    if(!that.elem[0]) return;

    // 스크롤 대상 결정
    if(config.scrollElem){
      var scrollTarget = $c(config.scrollElem)[0];
      that.scrollElem = scrollTarget || window;
    } else {
      that.scrollElem = window;
    }

    // 로딩/종료 요소를 추가할 컨테이너 결정
    // scrollElem이 지정되면 scrollElem에, 아니면 elem에 추가
    var appendTarget = config.scrollElem ? that.scrollElem : that.elem[0];
    if(appendTarget === window) appendTarget = that.elem[0];

    // 로딩 요소 추가
    that.loadingElem = document.createElement('div');
    that.loadingElem.className = 'cui-flow-loading';
    that.loadingElem.innerHTML = '<i class="cui-icon cui-anim cui-anim-rotate">sync</i> 로딩 중...';
    that.loadingElem.style.display = 'none';
    appendTarget.appendChild(that.loadingElem);

    // 종료 요소 추가
    that.endElem = document.createElement('div');
    that.endElem.className = 'cui-flow-end';
    that.endElem.textContent = config.end;
    that.endElem.style.display = 'none';
    appendTarget.appendChild(that.endElem);

    that.appendTarget = appendTarget;

    // 스크롤 이벤트
    if(config.isAuto){
      that.bindScroll();
    }

    // 첫 로드
    that.loadMore();
  };

  // 스크롤 이벤트 바인딩
  Class.prototype.bindScroll = function(){
    var that = this
    ,config = that.config;

    var onScroll = function(){
      if(that.loading || that.ended) return;

      var scrollTop, scrollHeight, clientHeight;
      
      if(that.scrollElem === window){
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
      } else {
        scrollTop = that.scrollElem.scrollTop;
        scrollHeight = that.scrollElem.scrollHeight;
        clientHeight = that.scrollElem.clientHeight;
      }

      // 하단 도달 체크 (여유 거리 포함)
      var remaining = scrollHeight - scrollTop - clientHeight;
      if(remaining <= config.distance){
        that.loadMore();
      }
    };

    // 스크롤 이벤트 바인딩
    that.scrollElem.addEventListener('scroll', onScroll);
    that.scrollHandler = onScroll;

    // 초기 컨텐츠가 컨테이너보다 작으면 추가 로드
    setTimeout(function(){
      if(!that.ended && that.scrollElem !== window){
        var scrollHeight = that.scrollElem.scrollHeight;
        var clientHeight = that.scrollElem.clientHeight;
        if(scrollHeight <= clientHeight){
          that.loadMore();
        }
      }
    }, 100);
  };

  // 더 로드
  Class.prototype.loadMore = function(){
    var that = this
    ,config = that.config;

    if(that.loading || that.ended) return;

    that.loading = true;
    that.loadingElem.style.display = 'block';

    // done 콜백 호출
    if(typeof config.done === 'function'){
      config.done(that.page, function(html, isEnd){
        that.loading = false;
        that.loadingElem.style.display = 'none';

        if(html){
          // HTML 삽입
          var temp = document.createElement('div');
          temp.innerHTML = html;
          while(temp.firstChild){
            that.elem[0].insertBefore(temp.firstChild, that.loadingElem);
          }
          that.page++;

          // 레이지 로드
          if(config.isLazyimg){
            that.lazyLoad();
          }
        }

        if(isEnd){
          that.ended = true;
          that.endElem.style.display = 'block';
        } else {
          // 컨테이너가 아직 스크롤 불가능하면 추가 로드
          setTimeout(function(){
            if(that.scrollElem !== window && !that.ended){
              var scrollHeight = that.scrollElem.scrollHeight;
              var clientHeight = that.scrollElem.clientHeight;
              if(scrollHeight <= clientHeight + config.distance){
                that.loadMore();
              }
            }
          }, 50);
        }
      });
    }
  };

  // 레이지 로드
  Class.prototype.lazyLoad = function(){
    var that = this
    ,$c = get$c();

    that.elem.find('img[cui-src]').each(function(i, img){
      var src = img.getAttribute('cui-src');
      if(src){
        img.src = src;
        img.removeAttribute('cui-src');
      }
    });
  };

  // 리로드
  Class.prototype.reload = function(){
    var that = this;
    
    // 기존 아이템 제거
    var items = that.elem[0].querySelectorAll(':scope > *:not(.cui-flow-loading):not(.cui-flow-end)');
    items.forEach(function(item){ item.remove(); });

    that.page = 1;
    that.loading = false;
    that.ended = false;
    that.endElem.style.display = 'none';

    that.loadMore();
  };

  // 전역 노출
  window.flow = flow;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = flow;
  }

}(window);
