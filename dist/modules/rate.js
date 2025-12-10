/*!
 * Catui rate - 별점 컴포넌트
 * Based on rate.js, jQuery-free
 * MIT Licensed
 */

;!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'rate'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 인덱스
  ,index = 0
  
  // 인스턴스 저장
  ,instances = {}

  // 상수
  ,ELEM = 'cui-rate'

  // 외부 인터페이스
  ,rate = {
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
        setvalue: function(value){
          inst.setValue(value);
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
    that.config = $c.extend({}, that.defaults, rate.config, options);
    that.config.id = that.config.id || that.index;
    
    instances[that.config.id] = that;
    that.render();
  };

  // 기본 설정
  Class.prototype.defaults = {
    elem: null              // 컨테이너
    ,length: 5              // 별 개수
    ,value: 0               // 초기값
    ,half: false            // 반별 허용
    ,text: false            // 텍스트 표시
    ,readonly: false        // 읽기전용
    ,theme: ''              // 테마 색상
    ,icon: 'star'           // 아이콘 (star, favorite, thumb_up 등 Material Icons)
    ,setText: function(value){
      return value + '점';
    }
    ,choose: null           // 선택 콜백
  };

  // 렌더링
  Class.prototype.render = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    that.elem = $c(config.elem);
    if(!that.elem[0]) return;

    // 컨테이너 생성
    var container = document.createElement('div');
    container.className = ELEM + (config.readonly ? ' cui-rate-readonly' : '');
    if(config.theme){
      container.style.color = config.theme;
    }

    // 아이콘 (별, 하트 등)
    var iconName = config.icon || 'star';
    
    // 별 생성
    var starsHtml = '';
    for(var i = 1; i <= config.length; i++){
      starsHtml += '<li class="cui-rate-item" data-index="' + i + '">';
      if(config.half){
        // 반: 전체 아이콘을 50% 너비로 잘라서 표시
        starsHtml += '<i class="cui-icon cui-rate-half" data-value="' + (i - 0.5) + '">' + iconName + '</i>';
      }
      starsHtml += '<i class="cui-icon cui-rate-full" data-value="' + i + '">' + iconName + '</i>';
      starsHtml += '</li>';
    }

    container.innerHTML = '<ul class="cui-rate-list">' + starsHtml + '</ul>';

    // 텍스트
    if(config.text){
      var textElem = document.createElement('span');
      textElem.className = 'cui-rate-text';
      container.appendChild(textElem);
      that.textElem = textElem;
    }

    that.elem.html('');
    that.elem[0].appendChild(container);
    that.container = $c(container);

    // 초기값 설정
    that.setValue(config.value);

    // 이벤트 바인딩
    if(!config.readonly){
      that.bindEvents();
    }
  };

  // 값 설정
  Class.prototype.setValue = function(value){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    that.value = value;

    // 별 상태 업데이트
    that.container.find('.cui-rate-item').each(function(i, item){
      var idx = i + 1;
      var $item = $c(item);
      var fullStar = $item.find('.cui-rate-full');
      var halfStar = $item.find('.cui-rate-half');

      // 초기화
      fullStar.removeClass('cui-rate-active');
      if(halfStar[0]) halfStar.removeClass('cui-rate-active');

      if(value >= idx){
        // 꽉 찬 별
        fullStar.addClass('cui-rate-active');
      } else if(config.half && value >= idx - 0.5){
        // 반별
        if(halfStar[0]) halfStar.addClass('cui-rate-active');
      }
    });

    // 텍스트 업데이트
    if(config.text && that.textElem){
      var text = typeof config.setText === 'function' 
        ? config.setText(value) 
        : value + '점';
      that.textElem.textContent = text;
    }
  };

  // 이벤트 바인딩
  Class.prototype.bindEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    // hover 효과
    that.container.find('.cui-rate-item').each(function(i, item){
      var $item = $c(item);

      $item.on('mousemove', function(e){
        var value = i + 1;
        
        if(config.half){
          var rect = item.getBoundingClientRect();
          var isLeft = e.clientX - rect.left < rect.width / 2;
          value = isLeft ? i + 0.5 : i + 1;
        }

        that.previewValue(value);
      });

      $item.on('mouseleave', function(){
        that.setValue(that.value);
      });

      $item.on('click', function(e){
        var value = i + 1;
        
        if(config.half){
          var rect = item.getBoundingClientRect();
          var isLeft = e.clientX - rect.left < rect.width / 2;
          value = isLeft ? i + 0.5 : i + 1;
        }

        that.setValue(value);

        if(typeof config.choose === 'function'){
          config.choose(value);
        }
      });
    });
  };

  // 미리보기 값
  Class.prototype.previewValue = function(value){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    that.container.find('.cui-rate-item').each(function(i, item){
      var idx = i + 1;
      var $item = $c(item);
      var fullStar = $item.find('.cui-rate-full');
      var halfStar = $item.find('.cui-rate-half');

      fullStar.removeClass('cui-rate-active cui-rate-hover');
      if(halfStar[0]) halfStar.removeClass('cui-rate-active cui-rate-hover');

      if(value >= idx){
        fullStar.addClass('cui-rate-hover');
      } else if(config.half && value >= idx - 0.5){
        if(halfStar[0]) halfStar.addClass('cui-rate-hover');
      }
    });
  };

  // 전역 노출
  window.rate = rate;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = rate;
  }

}(window);
