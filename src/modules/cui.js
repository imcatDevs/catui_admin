/*!
 * Catui $c - DOM Library
 * jQuery-free DOM manipulation library
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";
  
  // 이미 로드된 경우 종료
  if(window.$c && window.$c._loaded) return;

  var document = window.document
  
  // 데이터 저장소 (WeakMap)
  ,dataStore = new WeakMap()

  // DOM 선택기
  ,$c = function(selector){
    return new Cui(selector);
  }

  // DOM 생성자
  ,Cui = function(selector){
    var that = this
    ,elems = [];

    that.length = 0;

    // null/undefined
    if(!selector) return that;

    // 문자열: CSS 선택자 또는 HTML
    if(typeof selector === 'string'){
      selector = selector.trim();
      
      // HTML 문자열
      if(selector.charAt(0) === '<'){
        var container = document.createElement('div');
        container.innerHTML = selector;
        elems = container.children;
      } else {
        // CSS 선택자
        elems = document.querySelectorAll(selector);
      }
    }
    // DOM 요소
    else if(selector.nodeType){
      elems = [selector];
    }
    // window 객체
    else if(selector === window){
      elems = [window];
    }
    // 배열 또는 NodeList
    else if(selector.length !== undefined){
      elems = selector;
    }
    // 함수: DOMContentLoaded
    else if(typeof selector === 'function'){
      if(document.readyState === 'complete' || document.readyState === 'interactive'){
        selector();
      } else {
        document.addEventListener('DOMContentLoaded', selector);
      }
      return that;
    }

    // 요소 할당
    for(var i = 0; i < elems.length; i++){
      that[i] = elems[i];
    }
    that.length = elems.length;

    return that;
  };

  // 프로토타입 설정
  Cui.prototype = [];
  Cui.prototype.constructor = Cui;

  // ===== 유틸리티 메소드 =====

  // 깊은 복사
  $c.extend = function(){
    var args = arguments
    ,target = args[0] || {}
    ,deep = false
    ,i = 1;

    // 깊은 복사 여부
    if(typeof target === 'boolean'){
      deep = target;
      target = args[1] || {};
      i = 2;
    }

    // target이 객체가 아니면 빈 객체로
    if(typeof target !== 'object' && typeof target !== 'function'){
      target = {};
    }

    for(; i < args.length; i++){
      var source = args[i];
      if(source == null) continue;

      for(var key in source){
        if(source.hasOwnProperty(key)){
          var src = target[key]
          ,copy = source[key];

          // 순환 참조 방지
          if(target === copy) continue;

          // 깊은 복사
          if(deep && copy && (isPlainObject(copy) || Array.isArray(copy))){
            var clone = Array.isArray(copy) 
              ? (Array.isArray(src) ? src : [])
              : (isPlainObject(src) ? src : {});
            target[key] = $c.extend(deep, clone, copy);
          } else if(copy !== undefined){
            target[key] = copy;
          }
        }
      }
    }

    return target;
  };

  // 순수 객체 확인
  function isPlainObject(obj){
    if(typeof obj !== 'object' || obj === null) return false;
    var proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }

  // each 반복
  $c.each = function(obj, callback){
    if(!obj || typeof callback !== 'function') return obj;
    
    if(obj.length !== undefined){
      for(var i = 0; i < obj.length; i++){
        if(callback.call(obj[i], i, obj[i]) === false) break;
      }
    } else {
      for(var key in obj){
        if(obj.hasOwnProperty(key)){
          if(callback.call(obj[key], key, obj[key]) === false) break;
        }
      }
    }
    return obj;
  };

  // AJAX 요청
  $c.ajax = function(options){
    options = $c.extend({
      type: 'GET'
      ,url: ''
      ,data: null
      ,dataType: 'json'
      ,contentType: 'application/x-www-form-urlencoded'
      ,headers: {}
      ,success: function(){}
      ,error: function(){}
      ,complete: function(){}
    }, options);

    var xhr = new XMLHttpRequest();

    xhr.open(options.type.toUpperCase(), options.url, true);

    // 헤더 설정
    for(var key in options.headers){
      xhr.setRequestHeader(key, options.headers[key]);
    }

    // Content-Type 설정 (FormData가 아닐 때만)
    if(options.contentType && !(options.data instanceof FormData)){
      xhr.setRequestHeader('Content-Type', options.contentType);
    }

    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        options.complete(xhr);
        if(xhr.status >= 200 && xhr.status < 300){
          var response = xhr.responseText;
          if(options.dataType === 'json'){
            try{ response = JSON.parse(response); }catch(_e){}
          }
          options.success(response, xhr);
        } else {
          options.error(xhr);
        }
      }
    };

    // 데이터 처리
    var sendData = null;
    if(options.data){
      if(options.data instanceof FormData){
        sendData = options.data;
      } else if(typeof options.data === 'object'){
        // JSON content-type이면 JSON 문자열로 변환
        if(options.contentType && options.contentType.indexOf('application/json') !== -1){
          sendData = JSON.stringify(options.data);
        } else {
          sendData = $c.param(options.data);
        }
      } else {
        sendData = options.data;
      }
    }

    xhr.send(sendData);
    return xhr;
  };

  // 객체 → 쿼리스트링
  $c.param = function(obj){
    var parts = [];
    for(var key in obj){
      if(obj.hasOwnProperty(key)){
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
    }
    return parts.join('&');
  };

  // JSON 파싱
  $c.parseJSON = function(str){
    try {
      return JSON.parse(str);
    } catch(_e){
      return null;
    }
  };

  // 컨텍스트 바인딩
  $c.proxy = function(fn, context){
    return function(){
      return fn.apply(context, arguments);
    };
  };

  // ===== 프로토타입 메소드 =====

  // each 반복
  Cui.prototype.each = function(callback){
    $c.each(this, callback);
    return this;
  };

  // find
  Cui.prototype.find = function(selector){
    var results = [];
    this.each(function(i, elem){
      var found = elem.querySelectorAll(selector);
      for(var j = 0; j < found.length; j++){
        if(results.indexOf(found[j]) === -1){
          results.push(found[j]);
        }
      }
    });
    return $c(results);
  };

  // eq
  Cui.prototype.eq = function(index){
    return $c(this[index < 0 ? this.length + index : index]);
  };

  // first
  Cui.prototype.first = function(){
    return this.eq(0);
  };

  // last
  Cui.prototype.last = function(){
    return this.eq(-1);
  };

  // parent
  Cui.prototype.parent = function(selector){
    var results = [];
    this.each(function(i, elem){
      var parent = elem.parentNode;
      if(parent && parent.nodeType === 1){
        if(!selector || parent.matches(selector)){
          if(results.indexOf(parent) === -1){
            results.push(parent);
          }
        }
      }
    });
    return $c(results);
  };

  // parents
  Cui.prototype.parents = function(selector){
    var results = [];
    this.each(function(i, elem){
      var parent = elem.parentNode;
      while(parent && parent.nodeType === 1){
        if(!selector || parent.matches(selector)){
          if(results.indexOf(parent) === -1){
            results.push(parent);
          }
        }
        parent = parent.parentNode;
      }
    });
    return $c(results);
  };

  // closest
  Cui.prototype.closest = function(selector){
    var results = [];
    this.each(function(i, elem){
      var closest = elem.closest(selector);
      if(closest && results.indexOf(closest) === -1){
        results.push(closest);
      }
    });
    return $c(results);
  };

  // children
  Cui.prototype.children = function(selector){
    var results = [];
    this.each(function(i, elem){
      var children = elem.children;
      for(var j = 0; j < children.length; j++){
        if(!selector || children[j].matches(selector)){
          results.push(children[j]);
        }
      }
    });
    return $c(results);
  };

  // siblings
  Cui.prototype.siblings = function(selector){
    var results = [];
    this.each(function(i, elem){
      var parent = elem.parentNode;
      if(parent){
        var children = parent.children;
        for(var j = 0; j < children.length; j++){
          if(children[j] !== elem){
            if(!selector || children[j].matches(selector)){
              if(results.indexOf(children[j]) === -1){
                results.push(children[j]);
              }
            }
          }
        }
      }
    });
    return $c(results);
  };

  // prev
  Cui.prototype.prev = function(selector){
    var results = [];
    this.each(function(i, elem){
      var prev = elem.previousElementSibling;
      if(prev){
        if(!selector || prev.matches(selector)){
          results.push(prev);
        }
      }
    });
    return $c(results);
  };

  // next
  Cui.prototype.next = function(selector){
    var results = [];
    this.each(function(i, elem){
      var next = elem.nextElementSibling;
      if(next){
        if(!selector || next.matches(selector)){
          results.push(next);
        }
      }
    });
    return $c(results);
  };

  // addClass
  Cui.prototype.addClass = function(className){
    var classes = (className || '').split(/\s+/);
    return this.each(function(i, elem){
      for(var j = 0; j < classes.length; j++){
        if(classes[j]){
          elem.classList.add(classes[j]);
        }
      }
    });
  };

  // removeClass
  Cui.prototype.removeClass = function(className){
    var classes = (className || '').split(/\s+/);
    return this.each(function(i, elem){
      for(var j = 0; j < classes.length; j++){
        if(classes[j]){
          elem.classList.remove(classes[j]);
        }
      }
    });
  };

  // toggleClass
  Cui.prototype.toggleClass = function(className, force){
    return this.each(function(i, elem){
      if(force !== undefined){
        elem.classList.toggle(className, force);
      } else {
        elem.classList.toggle(className);
      }
    });
  };

  // hasClass
  Cui.prototype.hasClass = function(className){
    return this[0] ? this[0].classList.contains(className) : false;
  };

  // attr
  Cui.prototype.attr = function(key, value){
    // getter
    if(typeof key === 'string' && value === undefined){
      return this[0] ? this[0].getAttribute(key) : undefined;
    }
    // setter (객체)
    if(typeof key === 'object'){
      return this.each(function(i, elem){
        for(var k in key){
          elem.setAttribute(k, key[k]);
        }
      });
    }
    // setter
    return this.each(function(i, elem){
      elem.setAttribute(key, value);
    });
  };

  // removeAttr
  Cui.prototype.removeAttr = function(key){
    return this.each(function(i, elem){
      elem.removeAttribute(key);
    });
  };

  // prop
  Cui.prototype.prop = function(key, value){
    if(value === undefined){
      return this[0] ? this[0][key] : undefined;
    }
    return this.each(function(i, elem){
      elem[key] = value;
    });
  };

  // css
  Cui.prototype.css = function(key, value){
    // getter
    if(typeof key === 'string' && value === undefined){
      return this[0] ? getComputedStyle(this[0])[key] : undefined;
    }
    // setter (객체)
    if(typeof key === 'object'){
      return this.each(function(i, elem){
        for(var k in key){
          elem.style[k] = key[k];
        }
      });
    }
    // setter
    return this.each(function(i, elem){
      elem.style[key] = value;
    });
  };

  // html
  Cui.prototype.html = function(content){
    if(content === undefined){
      return this[0] ? this[0].innerHTML : '';
    }
    return this.each(function(i, elem){
      elem.innerHTML = content;
    });
  };

  // text
  Cui.prototype.text = function(content){
    if(content === undefined){
      return this[0] ? this[0].textContent : '';
    }
    return this.each(function(i, elem){
      elem.textContent = content;
    });
  };

  // val
  Cui.prototype.val = function(value){
    if(value === undefined){
      return this[0] ? this[0].value : '';
    }
    return this.each(function(i, elem){
      elem.value = value;
    });
  };

  // data
  Cui.prototype.data = function(key, value){
    var elem = this[0];
    if(!elem) return value === undefined ? undefined : this;

    var store = dataStore.get(elem) || {};

    // getter (키 없이)
    if(key === undefined){
      return store;
    }
    // getter (키만)
    if(value === undefined){
      // data-* 속성 체크
      if(store[key] === undefined && elem.dataset){
        return elem.dataset[key];
      }
      return store[key];
    }
    // setter
    store[key] = value;
    dataStore.set(elem, store);
    return this;
  };

  // append
  Cui.prototype.append = function(content){
    return this.each(function(i, elem){
      if(typeof content === 'string'){
        elem.insertAdjacentHTML('beforeend', content);
      } else if(content.nodeType){
        elem.appendChild(content);
      } else if(content.length){
        for(var j = 0; j < content.length; j++){
          elem.appendChild(content[j]);
        }
      }
    });
  };

  // prepend
  Cui.prototype.prepend = function(content){
    return this.each(function(i, elem){
      if(typeof content === 'string'){
        elem.insertAdjacentHTML('afterbegin', content);
      } else if(content.nodeType){
        elem.insertBefore(content, elem.firstChild);
      }
    });
  };

  // before
  Cui.prototype.before = function(content){
    return this.each(function(i, elem){
      if(typeof content === 'string'){
        elem.insertAdjacentHTML('beforebegin', content);
      } else if(content.nodeType){
        elem.parentNode.insertBefore(content, elem);
      }
    });
  };

  // after
  Cui.prototype.after = function(content){
    return this.each(function(i, elem){
      if(typeof content === 'string'){
        elem.insertAdjacentHTML('afterend', content);
      } else if(content.nodeType){
        elem.parentNode.insertBefore(content, elem.nextSibling);
      }
    });
  };

  // remove
  Cui.prototype.remove = function(){
    return this.each(function(i, elem){
      if(elem.parentNode){
        elem.parentNode.removeChild(elem);
      }
    });
  };

  // empty
  Cui.prototype.empty = function(){
    return this.each(function(i, elem){
      elem.innerHTML = '';
    });
  };

  // clone
  Cui.prototype.clone = function(deep){
    var results = [];
    this.each(function(i, elem){
      results.push(elem.cloneNode(deep !== false));
    });
    return $c(results);
  };

  // wrap
  Cui.prototype.wrap = function(wrapper){
    return this.each(function(i, elem){
      var wrap = typeof wrapper === 'string' 
        ? document.createElement('div') 
        : wrapper.cloneNode(true);
      if(typeof wrapper === 'string'){
        wrap.innerHTML = wrapper;
        wrap = wrap.firstElementChild;
      }
      elem.parentNode.insertBefore(wrap, elem);
      wrap.appendChild(elem);
    });
  };

  // show
  Cui.prototype.show = function(){
    return this.each(function(i, elem){
      elem.style.display = '';
      if(getComputedStyle(elem).display === 'none'){
        elem.style.display = 'block';
      }
    });
  };

  // hide
  Cui.prototype.hide = function(){
    return this.each(function(i, elem){
      elem.style.display = 'none';
    });
  };

  // toggle
  Cui.prototype.toggle = function(){
    return this.each(function(i, elem){
      if(getComputedStyle(elem).display === 'none'){
        $c(elem).show();
      } else {
        $c(elem).hide();
      }
    });
  };

  // 이벤트 핸들러 저장소 (WeakMap 사용)
  var eventStore = new WeakMap();

  // on
  Cui.prototype.on = function(events, selectorOrHandler, handler){
    var selector, fn;

    if(typeof selectorOrHandler === 'function'){
      fn = selectorOrHandler;
      selector = null;
    } else {
      selector = selectorOrHandler;
      fn = handler;
    }

    var eventList = events.split(/\s+/);

    return this.each(function(i, elem){
      // 이벤트 저장소 초기화
      if(!eventStore.has(elem)){
        eventStore.set(elem, {});
      }
      var store = eventStore.get(elem);

      eventList.forEach(function(eventName){
        // 네임스페이스 분리 (예: 'click.menu')
        var parts = eventName.split('.');
        var type = parts[0];
        var namespace = parts[1] || '';

        // 핸들러 래퍼 생성
        var wrapper = function(e){
          if(selector){
            var target = e.target.closest(selector);
            if(target && elem.contains(target)){
              fn.call(target, e);
            }
          } else {
            fn.call(elem, e);
          }
        };

        // 저장소에 핸들러 저장
        var key = type + (namespace ? '.' + namespace : '');
        if(!store[key]) store[key] = [];
        store[key].push({ original: fn, wrapper: wrapper, selector: selector });

        elem.addEventListener(type, wrapper, false);
      });
    });
  };

  // off - 이벤트 제거
  Cui.prototype.off = function(events){
    if(!events){
      // 모든 이벤트 제거
      return this.each(function(i, elem){
        var store = eventStore.get(elem);
        if(!store) return;
        
        for(var key in store){
          var type = key.split('.')[0];
          store[key].forEach(function(h){
            elem.removeEventListener(type, h.wrapper, false);
          });
        }
        eventStore.delete(elem);
      });
    }

    var eventList = events.split(/\s+/);

    return this.each(function(i, elem){
      var store = eventStore.get(elem);
      if(!store) return;

      eventList.forEach(function(eventName){
        var parts = eventName.split('.');
        var type = parts[0];
        var namespace = parts[1] || '';

        // 매칭되는 핸들러 제거
        for(var key in store){
          var keyParts = key.split('.');
          var keyType = keyParts[0];
          var keyNs = keyParts[1] || '';

          // 타입 매칭 (빈 타입은 모든 타입)
          var typeMatch = !type || type === keyType;
          // 네임스페이스 매칭 (빈 네임스페이스는 정확히 일치하거나 네임스페이스 없는 것)
          var nsMatch = !namespace || namespace === keyNs;

          if(typeMatch && nsMatch){
            store[key].forEach(function(h){
              elem.removeEventListener(keyType, h.wrapper, false);
            });
            delete store[key];
          }
        }
      });
    });
  };

  // trigger
  Cui.prototype.trigger = function(eventName, data){
    return this.each(function(i, elem){
      var event;
      if(typeof CustomEvent === 'function'){
        event = new CustomEvent(eventName, { detail: data, bubbles: true });
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, data);
      }
      elem.dispatchEvent(event);
    });
  };

  // offset
  Cui.prototype.offset = function(){
    if(!this[0]) return { top: 0, left: 0 };
    var rect = this[0].getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset
      ,left: rect.left + window.pageXOffset
    };
  };

  // position
  Cui.prototype.position = function(){
    if(!this[0]) return { top: 0, left: 0 };
    return {
      top: this[0].offsetTop
      ,left: this[0].offsetLeft
    };
  };

  // width
  Cui.prototype.width = function(value){
    if(value === undefined){
      return this[0] ? this[0].offsetWidth : 0;
    }
    return this.css('width', typeof value === 'number' ? value + 'px' : value);
  };

  // height
  Cui.prototype.height = function(value){
    if(value === undefined){
      return this[0] ? this[0].offsetHeight : 0;
    }
    return this.css('height', typeof value === 'number' ? value + 'px' : value);
  };

  // outerWidth
  Cui.prototype.outerWidth = function(includeMargin){
    if(!this[0]) return 0;
    var width = this[0].offsetWidth;
    if(includeMargin){
      var style = getComputedStyle(this[0]);
      width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }
    return width;
  };

  // outerHeight
  Cui.prototype.outerHeight = function(includeMargin){
    if(!this[0]) return 0;
    var height = this[0].offsetHeight;
    if(includeMargin){
      var style = getComputedStyle(this[0]);
      height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    }
    return height;
  };

  // scrollTop
  Cui.prototype.scrollTop = function(value){
    if(value === undefined){
      return this[0] === window 
        ? window.pageYOffset 
        : (this[0] ? this[0].scrollTop : 0);
    }
    return this.each(function(i, elem){
      if(elem === window){
        window.scrollTo(window.pageXOffset, value);
      } else {
        elem.scrollTop = value;
      }
    });
  };

  // scrollLeft
  Cui.prototype.scrollLeft = function(value){
    if(value === undefined){
      return this[0] === window 
        ? window.pageXOffset 
        : (this[0] ? this[0].scrollLeft : 0);
    }
    return this.each(function(i, elem){
      if(elem === window){
        window.scrollTo(value, window.pageYOffset);
      } else {
        elem.scrollLeft = value;
      }
    });
  };

  // serialize (폼 직렬화)
  Cui.prototype.serialize = function(){
    var form = this[0];
    if(!form || form.tagName !== 'FORM') return '';
    return new URLSearchParams(new FormData(form)).toString();
  };

  // fadeIn
  Cui.prototype.fadeIn = function(duration, callback){
    duration = duration || 300;
    return this.each(function(i, elem){
      elem.style.opacity = 0;
      elem.style.display = '';
      elem.style.transition = 'opacity ' + duration + 'ms';
      
      setTimeout(function(){
        elem.style.opacity = 1;
      }, 10);

      if(typeof callback === 'function'){
        setTimeout(callback, duration);
      }
    });
  };

  // fadeOut
  Cui.prototype.fadeOut = function(duration, callback){
    duration = duration || 300;
    return this.each(function(i, elem){
      elem.style.transition = 'opacity ' + duration + 'ms';
      elem.style.opacity = 0;

      setTimeout(function(){
        elem.style.display = 'none';
        if(typeof callback === 'function'){
          callback();
        }
      }, duration);
    });
  };

  // 전역 노출
  window.$c = $c;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui['$c'] = $c;
    window.Catui.$ = $c;
    
    // 상태 등록
    if(Catui.config && typeof Catui.config === 'function'){
      // config.status에 등록
    }
  } else {
    // Catui 없을 때 임시 저장
    window._catuiModules = window._catuiModules || {};
    window._catuiModules['$c'] = $c;
  }

  // 중복 로드 방지 플래그
  $c._loaded = true;

}(window);
