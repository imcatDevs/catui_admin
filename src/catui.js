/*!
 * Catui - Modern modular Front-End UI library
 * MIT Licensed
 */

;!function(window, undefined){
  "use strict";

  var document = window.document
  ,location = window.location

  // 버전
  ,version = '1.0.0'

  // 설정
  ,config = {
    modules: {}   // 모듈 목록
    ,status: {}   // 모듈 상태
    ,timeout: 10  // 모듈 로드 타임아웃 (초)
    ,event: {}    // 이벤트 저장소
  }

  // 내장 모듈 목록
  ,modules = {
    '$c': 'modules/cui'         // DOM 라이브러리
    ,'popup': 'modules/popup'   // 팝업 (layer → popup)
    ,'date': 'modules/date'     // 날짜 선택기
    ,'page': 'modules/page'     // 페이지네이션
    ,'tpl': 'modules/tpl'       // 템플릿 엔진
    ,'form': 'modules/form'     // 폼
    ,'table': 'modules/table'   // 테이블
    ,'element': 'modules/element' // 요소
    ,'upload': 'modules/upload' // 업로드
    ,'tree': 'modules/tree'     // 트리
    ,'dropdown': 'modules/dropdown' // 드롭다운
    ,'util': 'modules/util'     // 유틸리티
    ,'carousel': 'modules/carousel' // 캐러셀
    ,'slider': 'modules/slider' // 슬라이더
    ,'rate': 'modules/rate'     // 평점
    ,'colorpicker': 'modules/colorpicker' // 색상 선택기
    ,'transfer': 'modules/transfer' // 트랜스퍼
    ,'editor': 'modules/editor' // 에디터
    ,'flow': 'modules/flow'     // 플로우
    ,'code': 'modules/code'     // 코드 하이라이트
    ,'theme': 'modules/theme'   // 테마
  }

  // 오류 힌트
  ,error = function(msg, type){
    type = type || 'Catui';
    window.console && console.error && console.error(type + ' error hint: ' + msg);
  }

  // 힌트 반환
  ,hint = function(){
    return { error: error };
  }

  // Catui 생성자
  ,Catui = function(){
    this.v = version;
  };

  // 경로 가져오기
  Catui.prototype.getPath = function(){
    // 현재 스크립트 경로 기준으로 설정
    var scripts = document.getElementsByTagName('script');
    var path = '';
    for(var i = 0; i < scripts.length; i++){
      var src = scripts[i].src;
      if(src && src.indexOf('catui') > -1){
        path = src.substring(0, src.lastIndexOf('/') + 1);
        break;
      }
    }
    return path || './';
  };

  // 전역 설정
  Catui.prototype.config = function(options){
    options = options || {};
    for(var key in options){
      config[key] = options[key];
    }
    return this;
  };

  // 모듈 정의
  Catui.prototype.define = function(deps, callback){
    var that = this
    ,args = []
    ,mods = function(){
      return typeof deps === 'function' ? (
        callback = deps,
        ['$c']
      ) : deps;
    }();

    // 콜백이 없으면 종료
    if(typeof callback !== 'function'){
      return error('define callback is not a function');
    }

    // 의존 모듈 로드
    that.use(mods, function(){
      args = Array.prototype.slice.call(arguments);
      args.unshift(function(name, module){
        // 모듈 등록
        Catui[name] = module;
        config.status[name] = true;
      });
      callback.apply(that, args);
    });

    return that;
  };

  // 모듈 사용
  Catui.prototype.use = function(mods, callback, exports){
    var that = this
    ,catui = window.Catui
    ,head = document.head || document.getElementsByTagName('head')[0]
    ,modNames = typeof mods === 'string' ? [mods] : mods
    ,loadedCount = 0;

    // 콜백 타입 검사
    if(typeof callback !== 'function'){
      callback = function(){};
    }

    // 모든 모듈 로드 완료
    var onReady = function(){
      // 모듈이 실제로 등록되었는지 확인
      var allReady = true;
      for(var i = 0; i < modNames.length; i++){
        if(!catui[modNames[i]] && !window[modNames[i]]){
          allReady = false;
          break;
        }
      }
      
      if(!allReady){
        // 모듈이 아직 준비되지 않으면 잠시 대기
        setTimeout(onReady, 20);
        return;
      }
      
      var args = [];
      for(var i = 0; i < modNames.length; i++){
        args.push(catui[modNames[i]] || window[modNames[i]]);
      }
      callback.apply(catui, args);
    };

    // 모듈 로드 체크
    var checkModule = function(name){
      // 이미 로드된 경우
      if(catui[name] || window[name] || config.status[name]){
        config.status[name] = true;
        loadedCount++;
        if(loadedCount >= modNames.length){
          onReady();
        }
        return true;
      }
      return false;
    };

    // 모듈 로드
    var loadModule = function(name){
      var path = modules[name] || name;
      
      // 이미 로드된 경우
      if(checkModule(name)) return;
      
      // 이미 로딩 중인 경우
      if(config.status[name] === 'loading'){
        // 로드 완료를 대기
        var waitForLoad = function(){
          if(config.status[name] === true){
            loadedCount++;
            if(loadedCount >= modNames.length){
              onReady();
            }
          } else if(config.status[name] === 'loading'){
            setTimeout(waitForLoad, 20);
          }
        };
        waitForLoad();
        return;
      }
      
      // 로딩 중 상태로 설정
      config.status[name] = 'loading';

      // 스크립트 로드
      var script = document.createElement('script');
      script.src = that.getPath() + path + '.js';
      script.async = true;

      script.onload = function(){
        // 모듈이 전역에 등록되었는지 확인
        setTimeout(function(){
          if(window[name]){
            catui[name] = window[name];
          }
          config.status[name] = true;
          loadedCount++;
          if(loadedCount >= modNames.length){
            onReady();
          }
        }, 10);
      };

      script.onerror = function(){
        error('Failed to load module: ' + name);
        config.status[name] = false;
        loadedCount++;
        if(loadedCount >= modNames.length){
          onReady();
        }
      };

      head.appendChild(script);
    };

    // 모듈 순회 로드
    for(var i = 0; i < modNames.length; i++){
      loadModule(modNames[i]);
    }

    return that;
  };

  // 이벤트 등록
  Catui.prototype.onevent = function(modName, events, callback){
    if(typeof modName !== 'string' || typeof callback !== 'function'){
      return this;
    }
    return Catui.event(modName, events, null, callback);
  };

  // 이벤트 등록 (정적 메서드)
  Catui.onevent = function(modName, events, callback){
    if(typeof modName !== 'string' || typeof callback !== 'function'){
      return this;
    }
    return Catui.event(modName, events, null, callback);
  };

  // 이벤트 실행
  Catui.prototype.event = Catui.event = function(modName, events, params, callback){
    var that = this
    ,mods = config.event[modName] || {}
    ,filter = (events || '').match(/\((.*)\)$/) || []
    ,eventName = (events || '').replace(filter[0] || '', '')
    ,filterValue = filter[1] || '';

    // 이벤트 등록 (callback이 함수로 전달된 경우)
    if(typeof callback === 'function'){
      mods[eventName] = mods[eventName] || {};
      mods[eventName][filterValue] = callback;
      config.event[modName] = mods;
      return this;
    }

    // 이벤트 실행 (callback 없이 params만 전달된 경우)
    var eventCallback = (mods[eventName] || {})[filterValue];
    if(typeof eventCallback === 'function'){
      return eventCallback.call(this, params);
    }
  };

  // 이벤트 해제
  Catui.prototype.off = function(modName, events){
    var mods = config.event[modName] || {}
    ,filter = (events || '').match(/\((.*)\)$/) || []
    ,eventName = (events || '').replace(filter[0] || '', '')
    ,filterValue = filter[1] || '';

    if(mods[eventName]){
      delete mods[eventName][filterValue];
    }
    return this;
  };

  // each 반복
  Catui.prototype.each = function(obj, callback){
    var key;
    if(typeof callback !== 'function') return this;
    
    if(obj.length !== undefined){
      for(key = 0; key < obj.length; key++){
        if(callback.call(obj[key], key, obj[key]) === false){
          break;
        }
      }
    } else {
      for(key in obj){
        if(obj.hasOwnProperty(key)){
          if(callback.call(obj[key], key, obj[key]) === false){
            break;
          }
        }
      }
    }
    return this;
  };

  // 로컬 스토리지
  Catui.prototype.data = function(table, settings, storage){
    table = table || 'catui';
    storage = storage || localStorage;

    if(!window.JSON || !window.JSON.parse) return;

    // getter
    if(settings === null){
      return storage.removeItem(table);
    }
    if(typeof settings === 'object'){
      return storage.setItem(table, JSON.stringify(settings));
    }
    if(typeof settings === 'string'){
      var data = JSON.parse(storage.getItem(table) || '{}');
      return data[settings];
    }
    return JSON.parse(storage.getItem(table) || '{}');
  };

  // 세션 스토리지
  Catui.prototype.sessionData = function(table, settings){
    return this.data(table, settings, sessionStorage);
  };

  // 디바이스 정보
  Catui.prototype.device = function(key){
    var agent = navigator.userAgent.toLowerCase()
    ,info = {
      mobile: /android|iphone|ipad|ipod|mobile/i.test(agent)
      ,ios: /iphone|ipad|ipod/i.test(agent)
      ,android: /android/i.test(agent)
      ,weixin: /micromessenger/i.test(agent)
    };
    return key ? info[key] : info;
  };

  // 힌트 반환
  Catui.prototype.hint = hint;

  // CSS 동적 로드
  Catui.prototype.link = function(href, callback, id){
    var head = document.head || document.getElementsByTagName('head')[0]
    ,link = document.createElement('link');

    if(typeof callback === 'string') id = callback;

    link.href = href;
    link.rel = 'stylesheet';
    link.id = id || '';

    head.appendChild(link);

    if(typeof callback === 'function'){
      link.onload = callback;
    }

    return this;
  };

  // 전역 노출
  var catui = new Catui();
  window.Catui = catui;

  // CSS는 HTML에서 직접 로드 (자동 로드 비활성화)
  // catui.link(catui.getPath() + 'css/catui.css', 'catui-css');

  // $c 모듈 즉시 로드
  catui.use('$c', function(){
    console.log('Catui v' + catui.v + ' ready');
  });

}(window);
