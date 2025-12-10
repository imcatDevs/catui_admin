/*!
 * Catui carousel - 캐러셀 컴포넌트
 * Based on Layui carousel.js, jQuery-free
 * MIT Licensed
 */

;!function(window, undefined){
  "use strict";

  var MOD_NAME = 'carousel'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 인덱스
  ,index = 0

  // 상수
  ,ELEM = 'cui-carousel'
  ,ELEM_ITEM = '[carousel-item]>*'
  ,ELEM_LEFT = 'cui-carousel-left'
  ,ELEM_RIGHT = 'cui-carousel-right'
  ,ELEM_PREV = 'cui-carousel-prev'
  ,ELEM_NEXT = 'cui-carousel-next'
  ,ELEM_ARROW = 'cui-carousel-arrow'
  ,ELEM_IND = 'cui-carousel-ind'
  ,THIS = 'cui-this'

  // 외부 인터페이스
  ,carousel = {
    config: {}
    ,index: 0
    ,that: {}   // 인스턴스 저장

    // 전역 설정
    ,set: function(options){
      var $c = get$c();
      this.config = $c.extend({}, this.config, options);
      return this;
    }

    // 렌더링
    ,render: function(options){
      var inst = new Class(options);
      return inst.thisCarousel();
    }

    // 이벤트 등록 (Layui 방식)
    ,on: function(events, callback){
      if(window.Catui && Catui.onevent){
        return Catui.onevent.call(this, MOD_NAME, events, callback);
      }
      return this;
    }

    // 인스턴스 가져오기
    ,getInst: function(id){
      return carousel.that[id];
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
    that.config = $c.extend({}, that.defaults, carousel.config, options);
    that.config.id = that.config.id || ('carousel_' + that.index);
    that.key = that.config.id;
    
    // 인스턴스 저장
    carousel.that[that.key] = that;
    that.render();
  };

  // 인스턴스 반환 객체
  Class.prototype.thisCarousel = function(){
    var that = this;
    return {
      goto: function(idx){
        that.goto(idx);
      }
      ,prev: function(){
        that.slide('sub');
      }
      ,next: function(){
        that.slide('add');
      }
      ,pause: function(){
        that.pause();
      }
      ,play: function(){
        that.autoplay();
      }
      ,reload: function(opts){
        that.reload(opts);
      }
      ,config: that.config
      ,elemItem: that.elemItem
      ,elemInd: that.elemInd
    };
  };

  // 기본 설정
  Class.prototype.defaults = {
    elem: null              // 컨테이너
    ,width: '600px'         // 너비
    ,height: '280px'        // 높이
    ,full: false            // 전체화면
    ,arrow: 'hover'         // 화살표: always, hover, none
    ,indicator: 'inside'    // 인디케이터: inside, outside, none
    ,autoplay: true         // 자동재생
    ,interval: 3000         // 자동재생 간격 (최소 800ms)
    ,anim: ''               // 애니메이션: default/updown/fade
    ,trigger: 'click'       // 인디케이터 트리거: click, hover
    ,index: 0               // 시작 인덱스
    ,change: null           // 변경 콜백
  };

  // 리로드
  Class.prototype.reload = function(options){
    var that = this
    ,$c = get$c();
    
    if(that.timer) clearInterval(that.timer);
    that.config = $c.extend({}, that.config, options);
    that.render();
  };

  // 렌더링
  Class.prototype.render = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    // elem이 문자열이면 $c로 변환, 아니면 그대로 사용
    config.elem = $c(config.elem);
    if(!config.elem[0]) return;

    // cui-carousel 클래스가 없으면 추가
    if(!config.elem.hasClass(ELEM)){
      config.elem.addClass(ELEM);
    }

    // 아이템 찾기 (carousel-item 속성 사용)
    that.elemItem = config.elem.find(ELEM_ITEM);

    // 인덱스 범위 검증
    if(config.index < 0) config.index = 0;
    if(that.elemItem.length > 0 && config.index >= that.elemItem.length) {
      config.index = that.elemItem.length - 1;
    }
    
    // interval 최소값
    if(config.interval < 800) config.interval = 800;

    // 전체화면 모드
    if(config.full){
      config.elem.css({
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 9999
      });
    } else {
      config.elem.css({
        width: config.width,
        height: config.height
      });
    }

    // 애니메이션 타입 속성
    config.elem.attr('cui-anim', config.anim);
    config.elem.attr('cui-arrow', config.arrow);
    config.elem.attr('cui-indicator', config.indicator);

    // 초기 상태 설정 (기존 클래스 제거 후 추가)
    that.elemItem.removeClass(THIS);
    that.elemItem.eq(config.index).addClass(THIS);

    // 슬라이드 잠금 플래그
    that.haveSlide = false;

    // 1개 이하면 화살표/인디케이터 불필요
    if(that.elemItem.length <= 1) return;

    // 화살표
    that.arrow();
    
    // 인디케이터
    that.indicator();
    
    // 자동재생
    that.autoplay();
    
    // 이벤트 바인딩
    that.events();
  };

  // 화살표
  Class.prototype.arrow = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    // updown 모드일 경우 아이콘 변경
    var prevIcon = config.anim === 'updown' ? 'expand_less' : 'chevron_left';
    var nextIcon = config.anim === 'updown' ? 'expand_more' : 'chevron_right';

    var tplArrow = $c([
      '<button type="button" class="' + ELEM_ARROW + '" data-type="sub"><i class="cui-icon">' + prevIcon + '</i></button>',
      '<button type="button" class="' + ELEM_ARROW + '" data-type="add"><i class="cui-icon">' + nextIcon + '</i></button>'
    ].join(''));

    // 중복 삽입 방지
    if(config.elem.find('.' + ELEM_ARROW)[0]){
      config.elem.find('.' + ELEM_ARROW).remove();
    }
    
    if(that.elemItem.length > 1){
      config.elem.append(tplArrow[0]);
      config.elem.append(tplArrow[1]);
    }

    // 이벤트
    tplArrow.on('click', function(){
      var type = this.getAttribute('data-type');
      that.slide(type);
    });
  };

  // 인디케이터
  Class.prototype.indicator = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    // 템플릿
    var liHtml = '';
    that.elemItem.each(function(idx){
      liHtml += '<li' + (config.index === idx ? ' class="' + THIS + '"' : '') + '></li>';
    });

    var tplInd = that.elemInd = $c('<div class="' + ELEM_IND + '"><ul>' + liHtml + '</ul></div>');

    // 중복 삽입 방지
    if(config.elem.find('.' + ELEM_IND)[0]){
      config.elem.find('.' + ELEM_IND).remove();
    }

    if(that.elemItem.length > 1){
      config.elem.append(tplInd[0]);
    }

    // updown일 경우 세로 중앙 정렬
    if(config.anim === 'updown'){
      tplInd.css('margin-top', -(tplInd[0].offsetHeight / 2));
    }

    // 이벤트
    var triggerEvent = config.trigger === 'hover' ? 'mouseover' : 'click';
    tplInd.find('li').on(triggerEvent, function(){
      var idx = Array.prototype.indexOf.call(this.parentNode.children, this);
      that.goto(idx);
    });
  };

  // 이벤트 바인딩
  Class.prototype.events = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    if(config.elem[0].hasAttribute('data-events')) return;

    // 마우스 오버 시 자동재생 중지
    config.elem.on('mouseenter touchstart', function(){
      if(config.autoplay === 'always') return;
      clearInterval(that.timer);
    }).on('mouseleave touchend', function(){
      if(config.autoplay === 'always') return;
      that.autoplay();
    });

    // 터치 스와이프
    var touchStartX = 0, touchStartY = 0, touchStartTime = 0;

    config.elem[0].addEventListener('touchstart', function(e){
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    });

    config.elem[0].addEventListener('touchend', function(e){
      var touchEndX = e.changedTouches[0].clientX;
      var touchEndY = e.changedTouches[0].clientY;
      var duration = Date.now() - touchStartTime;
      var isVertical = config.anim === 'updown';  // 매번 현재 anim 확인
      var distance = isVertical ? (touchStartY - touchEndY) : (touchStartX - touchEndX);
      var speed = distance / duration;
      var containerSize = isVertical ? config.elem[0].offsetHeight : config.elem[0].offsetWidth;
      
      // 속도 또는 거리 기반 스와이프 판정
      var shouldSwipe = Math.abs(speed) > 0.25 || Math.abs(distance) > containerSize / 3;
      if(shouldSwipe){
        that.slide(distance > 0 ? 'add' : 'sub');
      }
    });

    config.elem[0].setAttribute('data-events', 'true');
  };

  // 자동재생
  Class.prototype.autoplay = function(){
    var that = this
    ,config = that.config;

    if(!config.autoplay) return;
    if(that.timer) clearInterval(that.timer);
    
    that.timer = setInterval(function(){
      that.slide('add');
    }, config.interval);
  };

  // 일시정지
  Class.prototype.pause = function(){
    var that = this;
    if(that.timer) clearInterval(that.timer);
    that.timer = null;
  };

  // 슬라이드 (Layui 방식 - CSS 클래스 기반 애니메이션)
  // type: 'add' (다음) / 'sub' (이전)
  // num: 이동 수 (기본 1)
  Class.prototype.slide = function(type, num){
    var that = this
    ,config = that.config
    ,elemItem = that.elemItem;

    // 슬라이드 잠금 체크
    if(that.haveSlide || elemItem.length <= 1) return;

    num = num || 1;
    var thisIndex = config.index;

    // 인덱스 계산
    if(type === 'sub'){
      config.index = config.index - num;
      if(config.index < 0) config.index = elemItem.length - 1;
    } else {
      config.index = config.index + num;
      if(config.index >= elemItem.length) config.index = 0;
    }

    // 잠금
    that.haveSlide = true;

    // 슬라이드 방향에 따른 애니메이션
    if(type === 'sub'){
      // 이전으로 (오른쪽에서 들어옴)
      elemItem.eq(config.index).addClass(ELEM_PREV);
      setTimeout(function(){
        elemItem.eq(thisIndex).addClass(ELEM_RIGHT);
        elemItem.eq(config.index).addClass(ELEM_RIGHT);
      }, 50);
    } else {
      // 다음으로 (왼쪽에서 들어옴)
      elemItem.eq(config.index).addClass(ELEM_NEXT);
      setTimeout(function(){
        elemItem.eq(thisIndex).addClass(ELEM_LEFT);
        elemItem.eq(config.index).addClass(ELEM_LEFT);
      }, 50);
    }

    // 애니메이션 완료 후 클래스 정리
    setTimeout(function(){
      elemItem.removeClass(THIS + ' ' + ELEM_PREV + ' ' + ELEM_NEXT + ' ' + ELEM_LEFT + ' ' + ELEM_RIGHT);
      elemItem.eq(config.index).addClass(THIS);
      that.haveSlide = false;
    }, 300);

    // 인디케이터 업데이트
    if(that.elemInd){
      that.elemInd.find('li').eq(config.index).addClass(THIS)
        .siblings().removeClass(THIS);
    }

    // 이벤트 데이터
    var eventData = {
      index: config.index
      ,prevIndex: thisIndex
      ,item: elemItem.eq(config.index)
      ,length: elemItem.length
    };

    // 콜백
    if(typeof config.change === 'function'){
      config.change(eventData);
    }

    // Catui 이벤트 발생 (id 또는 cui-filter 사용)
    var filter = config.elem.attr('cui-filter') || that.key;
    if(window.Catui && Catui.event){
      Catui.event(MOD_NAME, 'change(' + filter + ')', eventData);
    }
  };

  // 특정 인덱스로 이동
  Class.prototype.goto = function(index){
    var that = this
    ,config = that.config;
    
    if(index === config.index) return;
    
    if(index > config.index){
      that.slide('add', index - config.index);
    } else {
      that.slide('sub', config.index - index);
    }
  };

  // 전역 노출
  window.carousel = carousel;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = carousel;
  }

}(window);
