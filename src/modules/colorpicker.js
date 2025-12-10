/*!
 * Catui colorpicker - 색상 선택기 컴포넌트
 * Based on colorpicker.js, jQuery-free
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'colorpicker'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 인덱스
  ,index = 0
  
  // 인스턴스 저장
  ,instances = {}

  // 상수
  ,ELEM = 'cui-colorpicker'

  // 외부 인터페이스
  ,colorpicker = {
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
        setValue: function(color){
          inst.setValue(color);
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
    that.config = $c.extend({}, that.defaults, colorpicker.config, options);
    that.config.id = that.config.id || that.index;
    
    instances[that.config.id] = that;
    that.render();
  };

  // 기본 설정
  Class.prototype.defaults = {
    elem: null              // 컨테이너
    ,color: ''              // 초기 색상
    ,format: 'hex'          // 포맷: hex, rgb, rgba
    ,predefine: false       // 미리 정의된 색상
    ,alpha: false           // 투명도 슬라이더
    ,size: ''               // 크기: xs, sm, md, lg
    ,change: null           // 변경 콜백
    ,done: null             // 확정 콜백
  };

  // 기본 프리셋 색상
  Class.prototype.presetColors = [
    '#1677ff', '#009688', '#5fb878', '#1e9fff', '#ff5722',
    '#ffb800', '#2f363c', '#5369e0', '#e01f54', '#00c0ef',
    '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4',
    '#00bcd4', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b',
    '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b'
  ];

  // 렌더링
  Class.prototype.render = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    that.elem = $c(config.elem);
    if(!that.elem[0]) return;

    // 현재 색상
    that.color = config.color || '#1677ff';
    that.hsv = that.hexToHsv(that.color);
    that.alpha = 1;

    // 컨테이너 생성
    var sizeClass = config.size ? ' cui-colorpicker-' + config.size : '';
    var container = document.createElement('div');
    container.className = ELEM + sizeClass;

    // 색상 박스 (트리거)
    var box = document.createElement('div');
    box.className = 'cui-colorpicker-box';
    box.innerHTML = '<span class="cui-colorpicker-color" style="background-color: ' + that.color + '"></span>'
      + '<i class="cui-icon cui-colorpicker-icon">expand_more</i>';
    container.appendChild(box);
    
    that.box = box;
    that.colorSpan = box.querySelector('.cui-colorpicker-color');

    that.elem.html('');
    that.elem[0].appendChild(container);
    that.container = $c(container);

    // 이벤트 바인딩
    that.bindEvents();
  };

  // 패널 생성
  Class.prototype.createPanel = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    // 패널 컨테이너
    var panel = document.createElement('div');
    panel.className = 'cui-colorpicker-panel';

    // 색상 영역 (Saturation-Brightness)
    var area = document.createElement('div');
    area.className = 'cui-colorpicker-area';
    area.innerHTML = '<div class="cui-colorpicker-saturation"></div>'
      + '<div class="cui-colorpicker-brightness"></div>'
      + '<span class="cui-colorpicker-cursor"></span>';
    panel.appendChild(area);
    that.area = area;
    that.cursor = area.querySelector('.cui-colorpicker-cursor');

    // 슬라이더 영역
    var sliders = document.createElement('div');
    sliders.className = 'cui-colorpicker-sliders';

    // Hue 슬라이더
    var hueWrap = document.createElement('div');
    hueWrap.className = 'cui-colorpicker-hue';
    hueWrap.innerHTML = '<span class="cui-colorpicker-hue-slider"></span>';
    sliders.appendChild(hueWrap);
    that.hueBar = hueWrap;
    that.hueSlider = hueWrap.querySelector('.cui-colorpicker-hue-slider');

    // Alpha 슬라이더
    if(config.alpha){
      var alphaWrap = document.createElement('div');
      alphaWrap.className = 'cui-colorpicker-alpha';
      alphaWrap.innerHTML = '<div class="cui-colorpicker-alpha-bg"></div>'
        + '<span class="cui-colorpicker-alpha-slider"></span>';
      sliders.appendChild(alphaWrap);
      that.alphaBar = alphaWrap;
      that.alphaSlider = alphaWrap.querySelector('.cui-colorpicker-alpha-slider');
    }

    panel.appendChild(sliders);

    // 프리셋 색상
    if(config.predefine){
      var presetColors = Array.isArray(config.predefine) ? config.predefine : that.presetColors;
      var preset = document.createElement('div');
      preset.className = 'cui-colorpicker-preset';
      
      presetColors.forEach(function(color){
        var item = document.createElement('span');
        item.className = 'cui-colorpicker-preset-item';
        item.style.backgroundColor = color;
        item.setAttribute('data-color', color);
        preset.appendChild(item);
      });
      
      panel.appendChild(preset);
      that.presetElem = preset;
    }

    // 입력 및 버튼
    var footer = document.createElement('div');
    footer.className = 'cui-colorpicker-footer';
    footer.innerHTML = '<input type="text" class="cui-input cui-colorpicker-input" value="' + that.color + '">'
      + '<div class="cui-colorpicker-buttons">'
      + '<button type="button" class="cui-btn cui-btn-xs cui-colorpicker-clear">초기화</button>'
      + '<button type="button" class="cui-btn cui-btn-xs cui-btn-primary cui-colorpicker-confirm">확인</button>'
      + '</div>';
    panel.appendChild(footer);
    that.input = footer.querySelector('.cui-colorpicker-input');

    document.body.appendChild(panel);
    that.panel = $c(panel);

    // 위치 설정
    that.positionPanel();

    // 초기 상태 설정
    that.updatePanel();

    // 패널 이벤트
    that.bindPanelEvents();

    return panel;
  };

  // 패널 위치 설정
  Class.prototype.positionPanel = function(){
    var that = this;
    var rect = that.box.getBoundingClientRect();
    var panel = that.panel[0];
    
    var top = rect.bottom + window.scrollY + 5;
    var left = rect.left + window.scrollX;

    // 화면 밖으로 넘어가면 조정
    var panelRect = panel.getBoundingClientRect();
    if(left + panelRect.width > window.innerWidth){
      left = window.innerWidth - panelRect.width - 10;
    }

    panel.style.top = top + 'px';
    panel.style.left = left + 'px';
  };

  // 패널 업데이트
  Class.prototype.updatePanel = function(){
    var that = this;
    var h = that.hsv.h;
    var s = that.hsv.s;
    var v = that.hsv.v;

    // 색상 영역 배경
    var hueColor = that.hsvToHex({ h: h, s: 100, v: 100 });
    that.area.style.backgroundColor = hueColor;

    // 커서 위치
    that.cursor.style.left = s + '%';
    that.cursor.style.top = (100 - v) + '%';

    // Hue 슬라이더 위치
    that.hueSlider.style.left = (h / 360 * 100) + '%';

    // Alpha 슬라이더
    if(that.config.alpha && that.alphaSlider){
      that.alphaBar.querySelector('.cui-colorpicker-alpha-bg').style.background = 
        'linear-gradient(to right, transparent, ' + that.hsvToHex(that.hsv) + ')';
      that.alphaSlider.style.left = (that.alpha * 100) + '%';
    }

    // 입력 필드
    if(that.input){
      that.input.value = that.getValue();
    }
  };

  // 이벤트 바인딩
  Class.prototype.bindEvents = function(){
    var that = this
    ,$c = get$c();

    // 클릭 시 패널 열기
    $c(that.box).off('click').on('click', function(e){
      e.stopPropagation();
      
      if(that.panel && that.panel[0].style.display !== 'none'){
        that.hidePanel();
      } else {
        that.showPanel();
      }
    });

    // 외부 클릭 시 닫기
    document.addEventListener('click', function(e){
      if(that.panel && !that.panel[0].contains(e.target) && !that.box.contains(e.target)){
        that.hidePanel();
      }
    });
  };

  // 패널 이벤트
  Class.prototype.bindPanelEvents = function(){
    var that = this
    ,$c = get$c();

    // 드래그 상태
    var isDraggingArea = false;
    var isDraggingHue = false;
    var isDraggingAlpha = false;

    // 색상 영역 드래그
    that.area.addEventListener('mousedown', function(e){
      isDraggingArea = true;
      that.updateAreaColor(e);
    });

    // Hue 슬라이더 드래그
    that.hueBar.addEventListener('mousedown', function(e){
      isDraggingHue = true;
      that.updateHue(e);
    });

    // Alpha 슬라이더 드래그
    if(that.config.alpha && that.alphaBar){
      that.alphaBar.addEventListener('mousedown', function(e){
        isDraggingAlpha = true;
        that.updateAlpha(e);
      });
    }

    // document 이벤트 핸들러 (한 번만 등록, 참조 저장)
    that._docMoveHandler = function(e){
      if(isDraggingArea) that.updateAreaColor(e);
      if(isDraggingHue) that.updateHue(e);
      if(isDraggingAlpha) that.updateAlpha(e);
    };

    that._docUpHandler = function(){
      isDraggingArea = false;
      isDraggingHue = false;
      isDraggingAlpha = false;
    };

    document.addEventListener('mousemove', that._docMoveHandler);
    document.addEventListener('mouseup', that._docUpHandler);

    // 프리셋 클릭
    if(that.presetElem){
      that.presetElem.addEventListener('click', function(e){
        var item = e.target.closest('.cui-colorpicker-preset-item');
        if(item){
          var color = item.getAttribute('data-color');
          that.setValue(color);
        }
      });
    }

    // 입력 필드
    that.input.addEventListener('change', function(){
      that.setValue(that.input.value);
    });

    // 초기화 버튼
    that.panel.find('.cui-colorpicker-clear').on('click', function(){
      that.setValue(that.config.color || '#1677ff');
    });

    // 확인 버튼
    that.panel.find('.cui-colorpicker-confirm').on('click', function(){
      that.hidePanel();
      if(typeof that.config.done === 'function'){
        that.config.done(that.getValue());
      }
    });
  };

  // 색상 영역 업데이트
  Class.prototype.updateAreaColor = function(e){
    var that = this;
    var rect = that.area.getBoundingClientRect();
    var x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    var y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    that.hsv.s = Math.round(x * 100);
    that.hsv.v = Math.round((1 - y) * 100);
    that.color = that.hsvToHex(that.hsv);

    that.updatePanel();
    that.updateBox();
    that.triggerChange();
  };

  // Hue 업데이트
  Class.prototype.updateHue = function(e){
    var that = this;
    var rect = that.hueBar.getBoundingClientRect();
    var x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    that.hsv.h = Math.round(x * 360);
    that.color = that.hsvToHex(that.hsv);

    that.updatePanel();
    that.updateBox();
    that.triggerChange();
  };

  // Alpha 업데이트
  Class.prototype.updateAlpha = function(e){
    var that = this;
    var rect = that.alphaBar.getBoundingClientRect();
    var x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    that.alpha = Math.round(x * 100) / 100;

    that.updatePanel();
    that.updateBox();
    that.triggerChange();
  };

  // 트리거 박스 업데이트
  Class.prototype.updateBox = function(){
    var that = this;
    that.colorSpan.style.backgroundColor = that.getValue();
  };

  // 변경 이벤트
  Class.prototype.triggerChange = function(){
    var that = this;
    if(typeof that.config.change === 'function'){
      that.config.change(that.getValue());
    }
  };

  // 패널 표시
  Class.prototype.showPanel = function(){
    var that = this;
    
    if(!that.panel){
      that.createPanel();
    }
    
    that.panel[0].style.display = 'block';
    that.positionPanel();
  };

  // 패널 숨기기
  Class.prototype.hidePanel = function(){
    var that = this;
    if(that.panel){
      that.panel[0].style.display = 'none';
    }
  };

  // 값 설정
  Class.prototype.setValue = function(color){
    var that = this;
    
    if(!color) return;

    that.color = color;
    that.hsv = that.hexToHsv(color);
    
    that.updateBox();
    if(that.panel){
      that.updatePanel();
    }
  };

  // 값 가져오기
  Class.prototype.getValue = function(){
    var that = this
    ,config = that.config;

    if(config.format === 'rgb' || config.format === 'rgba'){
      var rgb = that.hexToRgb(that.color);
      if(config.alpha){
        return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + that.alpha + ')';
      }
      return 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    }

    return that.color;
  };

  // 색상 변환: HEX to RGB
  Class.prototype.hexToRgb = function(hex){
    hex = hex.replace('#', '');
    if(hex.length === 3){
      hex = hex.split('').map(function(c){ return c + c; }).join('');
    }
    var num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  // 색상 변환: RGB to HEX
  Class.prototype.rgbToHex = function(r, g, b){
    return '#' + [r, g, b].map(function(c){
      var hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // 색상 변환: HEX to HSV
  Class.prototype.hexToHsv = function(hex){
    var rgb = this.hexToRgb(hex);
    var r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;
    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max === min){
      h = 0;
    } else {
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  // 색상 변환: HSV to HEX
  Class.prototype.hsvToHex = function(hsv){
    var h = hsv.h / 360, s = hsv.s / 100, v = hsv.v / 100;
    var r, g, b;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }

    return this.rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
  };

  // 전역 노출
  window.colorpicker = colorpicker;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = colorpicker;
  }

}(window);
