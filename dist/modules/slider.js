/*!
 * Catui slider - 슬라이더 컴포넌트
 * Based on slider.js, jQuery-free
 * MIT Licensed
 */

;!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'slider'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 인덱스
  ,index = 0
  
  // 인스턴스 저장
  ,instances = {}

  // 상수
  ,ELEM = 'cui-slider'

  // 외부 인터페이스
  ,slider = {
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
        setValue: function(value, idx){
          inst.setValue(value, idx);
        }
        ,getValue: function(){
          return inst.getValue();
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
    that.config = $c.extend({}, that.defaults, slider.config, options);
    that.config.id = that.config.id || that.index;
    
    instances[that.config.id] = that;
    that.render();
  };

  // 기본 설정
  Class.prototype.defaults = {
    elem: null              // 컨테이너
    ,type: 'default'        // 타입: default, vertical
    ,min: 0                 // 최소값
    ,max: 100               // 최대값
    ,value: 0               // 초기값 (범위: [min, max])
    ,range: false           // 범위 선택
    ,step: 1                // 단계
    ,showstep: false        // 단계 표시
    ,tips: true             // 툴팁 표시
    ,input: false           // 입력 필드 표시
    ,height: 200            // 수직 슬라이더 높이
    ,disabled: false        // 비활성화
    ,theme: ''              // 테마 색상
    ,setTips: function(value){
      return value;
    }
    ,change: null           // 변경 콜백
    ,done: null             // 완료 콜백
  };

  // 렌더링
  Class.prototype.render = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    that.elem = $c(config.elem);
    if(!that.elem[0]) return;

    var isVertical = config.type === 'vertical';
    
    // 컨테이너 생성
    var container = document.createElement('div');
    container.className = ELEM 
      + (isVertical ? ' cui-slider-vertical' : '')
      + (config.disabled ? ' cui-slider-disabled' : '');
    
    if(isVertical){
      container.style.height = config.height + 'px';
    }
    if(config.theme){
      container.style.setProperty('--cui-slider-color', config.theme);
    }

    // 트랙
    var track = document.createElement('div');
    track.className = 'cui-slider-track';

    // 프로그레스
    var progress = document.createElement('div');
    progress.className = 'cui-slider-progress';
    track.appendChild(progress);

    // 핸들
    if(config.range){
      // 범위 슬라이더: 두 개의 핸들
      that.values = Array.isArray(config.value) ? config.value : [config.min, config.value];
      
      var handle1 = that.createHandle(0);
      var handle2 = that.createHandle(1);
      track.appendChild(handle1);
      track.appendChild(handle2);
      
      that.handles = [handle1, handle2];
    } else {
      // 일반 슬라이더
      that.values = [typeof config.value === 'number' ? config.value : config.min];
      
      var handle = that.createHandle(0);
      track.appendChild(handle);
      
      that.handles = [handle];
    }

    container.appendChild(track);
    that.track = track;
    that.progress = progress;

    // 단계 표시
    if(config.showstep){
      var steps = document.createElement('div');
      steps.className = 'cui-slider-steps';
      
      var stepCount = (config.max - config.min) / config.step;
      for(var i = 0; i <= stepCount; i++){
        var stepDot = document.createElement('span');
        stepDot.className = 'cui-slider-step';
        var percent = (i / stepCount) * 100;
        if(isVertical){
          stepDot.style.bottom = percent + '%';
        } else {
          stepDot.style.left = percent + '%';
        }
        steps.appendChild(stepDot);
      }
      
      container.appendChild(steps);
    }

    // 입력 필드
    if(config.input){
      var inputWrap = document.createElement('div');
      inputWrap.className = 'cui-slider-input';
      
      if(config.range){
        var input1 = document.createElement('input');
        input1.type = 'number';
        input1.className = 'cui-input cui-slider-input-num';
        input1.min = config.min;
        input1.max = config.max;
        input1.value = that.values[0];
        
        var span = document.createElement('span');
        span.textContent = '-';
        
        var input2 = document.createElement('input');
        input2.type = 'number';
        input2.className = 'cui-input cui-slider-input-num';
        input2.min = config.min;
        input2.max = config.max;
        input2.value = that.values[1];
        
        inputWrap.appendChild(input1);
        inputWrap.appendChild(span);
        inputWrap.appendChild(input2);
        
        that.inputs = [input1, input2];
      } else {
        var input = document.createElement('input');
        input.type = 'number';
        input.className = 'cui-input cui-slider-input-num';
        input.min = config.min;
        input.max = config.max;
        input.value = that.values[0];
        
        inputWrap.appendChild(input);
        that.inputs = [input];
      }
      
      container.appendChild(inputWrap);
    }

    that.elem.html('');
    that.elem[0].appendChild(container);
    that.container = $c(container);

    // 초기값 업데이트
    that.updateView();

    // 이벤트 바인딩
    if(!config.disabled){
      that.bindEvents();
    }
  };

  // 핸들 생성
  Class.prototype.createHandle = function(idx){
    var that = this
    ,config = that.config;

    var handle = document.createElement('div');
    handle.className = 'cui-slider-handle';
    handle.setAttribute('data-index', idx);

    // 툴팁
    if(config.tips){
      var tips = document.createElement('div');
      tips.className = 'cui-slider-tips';
      handle.appendChild(tips);
    }

    return handle;
  };

  // 뷰 업데이트
  Class.prototype.updateView = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    var isVertical = config.type === 'vertical';
    var range = config.max - config.min;

    // Division by zero 방지
    if(range === 0) range = 1;

    if(config.range){
      var percent1 = ((that.values[0] - config.min) / range) * 100;
      var percent2 = ((that.values[1] - config.min) / range) * 100;

      if(isVertical){
        that.handles[0].style.bottom = percent1 + '%';
        that.handles[1].style.bottom = percent2 + '%';
        that.progress.style.bottom = percent1 + '%';
        that.progress.style.height = (percent2 - percent1) + '%';
      } else {
        that.handles[0].style.left = percent1 + '%';
        that.handles[1].style.left = percent2 + '%';
        that.progress.style.left = percent1 + '%';
        that.progress.style.width = (percent2 - percent1) + '%';
      }

      // 툴팁
      if(config.tips){
        that.handles[0].querySelector('.cui-slider-tips').textContent = config.setTips(that.values[0]);
        that.handles[1].querySelector('.cui-slider-tips').textContent = config.setTips(that.values[1]);
      }

      // 입력 필드
      if(config.input && that.inputs){
        that.inputs[0].value = that.values[0];
        that.inputs[1].value = that.values[1];
      }
    } else {
      var percent = ((that.values[0] - config.min) / range) * 100;

      if(isVertical){
        that.handles[0].style.bottom = percent + '%';
        that.progress.style.height = percent + '%';
      } else {
        that.handles[0].style.left = percent + '%';
        that.progress.style.width = percent + '%';
      }

      // 툴팁
      if(config.tips){
        that.handles[0].querySelector('.cui-slider-tips').textContent = config.setTips(that.values[0]);
      }

      // 입력 필드
      if(config.input && that.inputs){
        that.inputs[0].value = that.values[0];
      }
    }
  };

  // 이벤트 바인딩
  Class.prototype.bindEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    var isVertical = config.type === 'vertical';

    // 핸들 드래그
    that.handles.forEach(function(handle, idx){
      var isDragging = false;

      handle.addEventListener('mousedown', function(e){
        e.preventDefault();
        isDragging = true;
        handle.classList.add('cui-slider-handle-active');

        var onMove = function(e){
          if(!isDragging) return;
          that.moveHandle(e, idx);
        };

        var onUp = function(){
          isDragging = false;
          handle.classList.remove('cui-slider-handle-active');
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);

          if(typeof config.done === 'function'){
            config.done(that.getValue());
          }
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });

      // 터치 지원
      handle.addEventListener('touchstart', function(e){
        e.preventDefault();
        isDragging = true;
        handle.classList.add('cui-slider-handle-active');

        var onMove = function(e){
          if(!isDragging) return;
          that.moveHandle(e.touches[0], idx);
        };

        var onUp = function(){
          isDragging = false;
          handle.classList.remove('cui-slider-handle-active');
          document.removeEventListener('touchmove', onMove);
          document.removeEventListener('touchend', onUp);

          if(typeof config.done === 'function'){
            config.done(that.getValue());
          }
        };

        document.addEventListener('touchmove', onMove);
        document.addEventListener('touchend', onUp);
      });
    });

    // 트랙 클릭
    that.track.addEventListener('click', function(e){
      if(e.target.classList.contains('cui-slider-handle')) return;
      
      var rect = that.track.getBoundingClientRect();
      var percent;
      
      if(isVertical){
        percent = 1 - (e.clientY - rect.top) / rect.height;
      } else {
        percent = (e.clientX - rect.left) / rect.width;
      }

      var value = config.min + percent * (config.max - config.min);
      value = that.snapToStep(value);

      // 범위 슬라이더: 가까운 핸들 이동
      if(config.range){
        var diff1 = Math.abs(value - that.values[0]);
        var diff2 = Math.abs(value - that.values[1]);
        var idx = diff1 < diff2 ? 0 : 1;
        that.setValue(value, idx);
      } else {
        that.setValue(value, 0);
      }

      if(typeof config.done === 'function'){
        config.done(that.getValue());
      }
    });

    // 입력 필드 이벤트
    if(config.input && that.inputs){
      that.inputs.forEach(function(input, idx){
        input.addEventListener('change', function(){
          var value = parseFloat(input.value);
          if(isNaN(value)) value = config.min;
          value = Math.max(config.min, Math.min(config.max, value));
          that.setValue(value, idx);

          if(typeof config.done === 'function'){
            config.done(that.getValue());
          }
        });
      });
    }
  };

  // 핸들 이동
  Class.prototype.moveHandle = function(e, idx){
    var that = this
    ,config = that.config;

    var isVertical = config.type === 'vertical';
    var rect = that.track.getBoundingClientRect();
    var percent;

    if(isVertical){
      percent = 1 - (e.clientY - rect.top) / rect.height;
    } else {
      percent = (e.clientX - rect.left) / rect.width;
    }

    percent = Math.max(0, Math.min(1, percent));
    var value = config.min + percent * (config.max - config.min);
    value = that.snapToStep(value);

    that.setValue(value, idx);

    if(typeof config.change === 'function'){
      config.change(that.getValue());
    }
  };

  // 단계에 맞춤
  Class.prototype.snapToStep = function(value){
    var config = this.config;
    var step = config.step;
    var steps = Math.round((value - config.min) / step);
    return Math.max(config.min, Math.min(config.max, config.min + steps * step));
  };

  // 값 설정
  Class.prototype.setValue = function(value, idx){
    var that = this
    ,config = that.config;

    idx = idx || 0;
    value = that.snapToStep(value);

    // 범위 슬라이더: 값 순서 유지
    if(config.range){
      if(idx === 0 && value > that.values[1]){
        value = that.values[1];
      } else if(idx === 1 && value < that.values[0]){
        value = that.values[0];
      }
    }

    that.values[idx] = value;
    that.updateView();
  };

  // 값 가져오기
  Class.prototype.getValue = function(){
    var that = this
    ,config = that.config;

    return config.range ? that.values.slice() : that.values[0];
  };

  // 전역 노출
  window.slider = slider;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = slider;
  }

}(window);
