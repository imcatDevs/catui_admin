/*!
 * Catui tpl - Template Engine
 * Based on laytpl, jQuery-free
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var MOD_NAME = 'tpl'
  
  ,config = {
    open: '{{'
    ,close: '}}'
  }

  // 템플릿 캐시 저장소
  ,cache = {}

  // 헬퍼 함수 저장소
  ,helpers = {}

  ,tool = {
    exp: function(str){
      return new RegExp(str, 'g');
    }
    // 규칙에 맞는 내용 매칭
    ,query: function(type, _, __){
      var types = [
        '#([\\s\\S])+?'   // JS 문장
        ,'([^{#}])*?'     // 일반 필드
      ][type || 0];
      return exp((_ || '') + config.open + types + config.close + (__ || ''));
    }
    ,escape: function(html){
      return String(html || '').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;');
    }
    ,error: function(e, tplog){
      var error = 'Catui tpl Error: ';
      typeof console === 'object' && console.error(error + e + '\n' + (tplog || ''));
      return error + e;
    }
  }

  ,exp = tool.exp

  // 템플릿 생성자
  ,Tpl = function(tpl, id){
    this.tpl = tpl;
    this.id = id;
  };

  Tpl.pt = Tpl.prototype;

  // 템플릿 컴파일
  Tpl.pt.parse = function(tpl, data){
    var that = this
    ,tplog = tpl
    ,jss = exp('^' + config.open + '#', '')
    ,jsse = exp(config.close + '$', '');

    tpl = tpl.replace(/\s+|\r|\t|\n/g, ' ')
      .replace(exp(config.open + '#'), config.open + '# ')
      .replace(exp(config.close + '}'), '} ' + config.close)
      .replace(/\\/g, '\\\\')
      
      // 지정 영역 내용 매칭 제외
      .replace(exp(config.open + '!(.+?)!' + config.close), function(str){
        str = str.replace(exp('^' + config.open + '!'), '')
          .replace(exp('!' + config.close), '')
          .replace(exp(config.open + '|' + config.close), function(tag){
            return tag.replace(/(.)/g, '\\$1');
          });
        return str;
      })
      
      // JS 규칙 내용 매칭
      .replace(/(?="|')/g, '\\')
      .replace(tool.query(), function(str){
        str = str.replace(jss, '').replace(jsse, '');
        return '";' + str.replace(/\\(.)/g, '$1') + ';view+="';
      })
      
      // 일반 필드 매칭
      .replace(tool.query(1), function(str){
        var start = '"+(';
        if(str.replace(/\s/g, '') === config.open + config.close){
          return '';
        }
        str = str.replace(exp(config.open + '|' + config.close), '');
        if(/^=/.test(str)){
          str = str.replace(/^=/, '');
          start = '"+_escape_(';
        }
        return start + str.replace(/\\(.)/g, '$1') + ')+"';
      });

    tpl = '"use strict";var view = "' + tpl + '";return view;';

    try {
      that.cache = tpl = new Function('d, _escape_, _helpers_', tpl);
      return tpl(data, tool.escape, helpers);
    } catch(e) {
      delete that.cache;
      return tool.error(e, tplog);
    }
  };

  // 템플릿 렌더링
  Tpl.pt.render = function(data, callback){
    var that = this, result;
    if(!data) return tool.error('no data');
    
    // 헬퍼 함수를 data에 주입
    data._h = helpers;
    
    result = that.cache ? that.cache(data, tool.escape, helpers) : that.parse(that.tpl, data);
    
    // ID가 있으면 캐시에 저장
    if(that.id && !cache[that.id]){
      cache[that.id] = that;
    }
    
    if(!callback) return result;
    callback(result);
  };

  // 비동기 렌더링 (Promise)
  Tpl.pt.renderAsync = function(data){
    var that = this;
    return new Promise(function(resolve, reject){
      try {
        var result = that.render(data);
        if(result.indexOf('Catui tpl Error') === 0){
          reject(new Error(result));
        } else {
          resolve(result);
        }
      } catch(e){
        reject(e);
      }
    });
  };

  // DOM에 직접 렌더링
  Tpl.pt.renderTo = function(elem, data, callback){
    var that = this;
    var target = typeof elem === 'string' ? document.querySelector(elem) : elem;
    if(!target) return tool.error('Target element not found');
    
    var result = that.render(data);
    target.innerHTML = result;
    
    if(callback) callback(result, target);
    return result;
  };

  // 모듈 인터페이스
  var tpl = function(template){
    // ID 셀렉터 (#id)
    if(typeof template === 'string' && template.charAt(0) === '#'){
      var id = template.substring(1);
      
      // 캐시 확인
      if(cache[id]){
        return cache[id];
      }
      
      // DOM에서 템플릿 로드
      var elem = document.getElementById(id);
      if(!elem){
        return { render: function(){ return tool.error('Template "' + id + '" not found'); } };
      }
      
      var tplContent = elem.innerHTML || elem.value || '';
      var instance = new Tpl(tplContent, id);
      cache[id] = instance;
      return instance;
    }
    
    if(typeof template !== 'string') return { render: function(){ return tool.error('Template not found'); } };
    return new Tpl(template);
  };

  // 설정
  tpl.config = function(options){
    options = options || {};
    for(var i in options){
      config[i] = options[i];
    }
    return tpl;
  };

  // 헬퍼 함수 등록
  tpl.helper = function(name, fn){
    if(typeof name === 'object'){
      // 객체로 여러 헬퍼 등록
      for(var key in name){
        helpers[key] = name[key];
      }
    } else if(typeof fn === 'function'){
      helpers[name] = fn;
    }
    return tpl;
  };

  // 헬퍼 함수 가져오기
  tpl.getHelper = function(name){
    return name ? helpers[name] : helpers;
  };

  // 캐시된 템플릿 가져오기
  tpl.get = function(id){
    return cache[id];
  };

  // 캐시 삭제
  tpl.clear = function(id){
    if(id){
      delete cache[id];
    } else {
      cache = {};
    }
    return tpl;
  };

  // 캐시 목록
  tpl.list = function(){
    return Object.keys(cache);
  };

  // 기본 헬퍼 등록
  tpl.helper({
    // 날짜 포맷
    date: function(timestamp, format){
      if(!timestamp) return '';
      var d = new Date(timestamp);
      format = format || 'yyyy-MM-dd';
      var map = {
        'yyyy': d.getFullYear(),
        'MM': ('0' + (d.getMonth() + 1)).slice(-2),
        'dd': ('0' + d.getDate()).slice(-2),
        'HH': ('0' + d.getHours()).slice(-2),
        'mm': ('0' + d.getMinutes()).slice(-2),
        'ss': ('0' + d.getSeconds()).slice(-2)
      };
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(m){ return map[m]; });
    }
    // 숫자 천단위 콤마
    ,number: function(num){
      if(num === undefined || num === null) return '';
      return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    // 문자열 자르기
    ,truncate: function(str, len, suffix){
      if(!str) return '';
      len = len || 50;
      suffix = suffix || '...';
      return str.length > len ? str.substring(0, len) + suffix : str;
    }
    // 기본값
    ,default: function(val, defaultVal){
      return val !== undefined && val !== null && val !== '' ? val : defaultVal;
    }
  });

  tpl.v = '1.1.0';

  // 전역 노출
  window.tpl = tpl;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = tpl;
  }

}(window);
