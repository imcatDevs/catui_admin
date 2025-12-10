/*!
 * Catui util - 유틸리티 모듈
 * Based on util.js, jQuery-free
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'util'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; };

  // 유틸리티 인터페이스
  var util = {
    
    // 고정바 (플로팅 버튼)
    fixbar: function(options){
      var $c = get$c();
      if(!$c) return;
      
      options = $c.extend({
        bar1: false           // 첫 번째 버튼 (아이콘/텍스트)
        ,bar2: false          // 두 번째 버튼
        ,bgcolor: ''          // 배경색
        ,showHeight: 200      // 표시 스크롤 위치
        ,css: {}              // 추가 스타일
        ,click: null          // 클릭 콜백
      }, options);

      var ELEM = 'cui-fixbar';
      
      // 기존 요소 제거
      var existing = document.querySelector('.' + ELEM);
      if(existing) existing.remove();

      // 컨테이너 생성
      var container = document.createElement('ul');
      container.className = ELEM;
      
      // 스타일 적용
      if(options.bgcolor){
        container.style.setProperty('--cui-fixbar-bg', options.bgcolor);
      }
      for(var key in options.css){
        container.style[key] = options.css[key];
      }

      // bar1
      if(options.bar1){
        var li1 = document.createElement('li');
        li1.className = 'cui-fixbar-item cui-fixbar-bar1';
        li1.innerHTML = options.bar1 === true 
          ? '<i class="cui-icon">chat</i>' 
          : options.bar1;
        li1.addEventListener('click', function(){
          if(typeof options.click === 'function'){
            options.click('bar1');
          }
        });
        container.appendChild(li1);
      }

      // bar2
      if(options.bar2){
        var li2 = document.createElement('li');
        li2.className = 'cui-fixbar-item cui-fixbar-bar2';
        li2.innerHTML = options.bar2 === true 
          ? '<i class="cui-icon">help</i>' 
          : options.bar2;
        li2.addEventListener('click', function(){
          if(typeof options.click === 'function'){
            options.click('bar2');
          }
        });
        container.appendChild(li2);
      }

      // 맨 위로 버튼
      var liTop = document.createElement('li');
      liTop.className = 'cui-fixbar-item cui-fixbar-top';
      liTop.innerHTML = '<i class="cui-icon">vertical_align_top</i>';
      liTop.style.display = 'none';
      liTop.addEventListener('click', function(){
        util.scrollTo(0, 200);
        if(typeof options.click === 'function'){
          options.click('top');
        }
      });
      container.appendChild(liTop);

      document.body.appendChild(container);

      // 스크롤 이벤트
      var onScroll = function(){
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        liTop.style.display = scrollTop >= options.showHeight ? '' : 'none';
      };

      window.addEventListener('scroll', onScroll);
      onScroll();

      return container;
    }

    // 카운트다운
    ,countdown: function(endTime, serverTime, callback){
      var that = this;
      
      if(typeof serverTime === 'function'){
        callback = serverTime;
        serverTime = null;
      }

      var end = new Date(endTime).getTime();
      var now = serverTime ? new Date(serverTime).getTime() : Date.now();
      var diff = end - now;

      if(diff <= 0){
        callback && callback(0, 0, 0, 0, 'end');
        return;
      }

      var timer = setInterval(function(){
        diff -= 1000;
        
        if(diff <= 0){
          clearInterval(timer);
          callback && callback(0, 0, 0, 0, 'end');
          return;
        }

        var d = Math.floor(diff / (1000 * 60 * 60 * 24));
        var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var s = Math.floor((diff % (1000 * 60)) / 1000);

        callback && callback(d, h, m, s, 'run');
      }, 1000);

      return timer;
    }

    // 시간 경과 표시 (몇 분 전)
    ,timeAgo: function(time, onlyDate){
      var that = this;
      var now = Date.now();
      var past = new Date(time).getTime();
      var diff = now - past;

      if(isNaN(diff)) return '';

      var minute = 60 * 1000;
      var hour = 60 * minute;
      var day = 24 * hour;

      if(diff < minute){
        return '방금';
      } else if(diff < hour){
        return Math.floor(diff / minute) + '분 전';
      } else if(diff < day){
        return Math.floor(diff / hour) + '시간 전';
      } else if(diff < 7 * day){
        return Math.floor(diff / day) + '일 전';
      } else {
        var d = new Date(past);
        var Y = d.getFullYear();
        var M = ('0' + (d.getMonth() + 1)).slice(-2);
        var D = ('0' + d.getDate()).slice(-2);
        var h = ('0' + d.getHours()).slice(-2);
        var m = ('0' + d.getMinutes()).slice(-2);
        
        return onlyDate 
          ? Y + '-' + M + '-' + D
          : Y + '-' + M + '-' + D + ' ' + h + ':' + m;
      }
    }

    // 숫자 포맷
    ,digit: function(num, length){
      var str = String(num);
      length = length || 2;
      while(str.length < length){
        str = '0' + str;
      }
      return str;
    }

    // 천단위 콤마
    ,comma: function(num){
      if(num === undefined || num === null) return '';
      return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // 스크롤 애니메이션
    ,scrollTo: function(to, duration){
      duration = duration || 300;
      var start = document.documentElement.scrollTop || document.body.scrollTop;
      var change = to - start;
      var startTime = Date.now();

      var animate = function(){
        var elapsed = Date.now() - startTime;
        var progress = Math.min(elapsed / duration, 1);
        
        // easeInOutQuad
        var ease = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        var current = start + change * ease;
        window.scrollTo(0, current);

        if(progress < 1){
          requestAnimationFrame(animate);
        }
      };

      animate();
    }

    // 딥 복사
    ,deepClone: function(obj){
      if(obj === null || typeof obj !== 'object') return obj;
      if(Array.isArray(obj)){
        return obj.map(function(item){
          return util.deepClone(item);
        });
      }
      var clone = {};
      for(var key in obj){
        if(obj.hasOwnProperty(key)){
          clone[key] = util.deepClone(obj[key]);
        }
      }
      return clone;
    }

    // 디바운스
    ,debounce: function(fn, delay){
      var timer = null;
      return function(){
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function(){
          fn.apply(context, args);
        }, delay || 300);
      };
    }

    // 쓰로틀
    ,throttle: function(fn, delay){
      var last = 0;
      return function(){
        var now = Date.now();
        if(now - last >= (delay || 300)){
          last = now;
          fn.apply(this, arguments);
        }
      };
    }

    // 이벤트 바인딩 (이벤트 위임)
    ,on: function(elem, event, selector, callback){
      var $c = get$c();
      if(!$c) return;

      $c(elem).on(event, function(e){
        var target = e.target;
        while(target && target !== elem){
          if(target.matches && target.matches(selector)){
            callback.call(target, e);
            break;
          }
          target = target.parentNode;
        }
      });
    }

    // 쿼리스트링 파싱
    ,parseQuery: function(str){
      str = str || window.location.search;
      if(str.charAt(0) === '?') str = str.slice(1);
      
      var result = {};
      var pairs = str.split('&');
      pairs.forEach(function(pair){
        var parts = pair.split('=');
        if(parts[0]){
          result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
        }
      });
      return result;
    }

    // 쿼리스트링 생성
    ,toQuery: function(obj){
      var parts = [];
      for(var key in obj){
        if(obj.hasOwnProperty(key) && obj[key] !== undefined){
          parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
      }
      return parts.join('&');
    }

    // 쿠키 설정
    ,setCookie: function(name, value, days){
      var expires = '';
      if(days){
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
    }

    // 쿠키 가져오기
    ,getCookie: function(name){
      var nameEQ = name + '=';
      var cookies = document.cookie.split(';');
      for(var i = 0; i < cookies.length; i++){
        var c = cookies[i].trim();
        if(c.indexOf(nameEQ) === 0){
          return decodeURIComponent(c.substring(nameEQ.length));
        }
      }
      return null;
    }

    // 쿠키 삭제
    ,removeCookie: function(name){
      util.setCookie(name, '', -1);
    }

    // UUID 생성
    ,uuid: function(){
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    // 짧은 ID 생성
    ,shortId: function(length){
      length = length || 8;
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var result = '';
      for(var i = 0; i < length; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    // 빈 값 체크
    ,isEmpty: function(value){
      if(value === null || value === undefined) return true;
      if(typeof value === 'string') return value.trim() === '';
      if(Array.isArray(value)) return value.length === 0;
      if(typeof value === 'object') return Object.keys(value).length === 0;
      return false;
    }

    // 이메일 검증
    ,isEmail: function(str){
      return /^[\w.-]+@[\w.-]+\.\w+$/.test(str);
    }

    // 전화번호 검증 (한국)
    ,isPhone: function(str){
      return /^01[016789]-?\d{3,4}-?\d{4}$/.test(str);
    }

    // URL 검증
    ,isUrl: function(str){
      return /^https?:\/\/.+/.test(str);
    }

    // HTML 이스케이프
    ,escape: function(str){
      if(typeof str !== 'string') return str;
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // HTML 언이스케이프
    ,unescape: function(str){
      if(typeof str !== 'string') return str;
      return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    }

    // XSS 방지 - 스크립트 태그 제거
    ,stripScripts: function(str){
      if(typeof str !== 'string') return str;
      
      // 대소문자 혼합 우회 방지 (ScRiPt, SCRIPT 등)
      var lower = str.toLowerCase();
      var result = str;
      
      // script 태그 위치 찾아서 제거
      var scriptStart = lower.indexOf('<script');
      while(scriptStart !== -1){
        var scriptEnd = lower.indexOf('</script>', scriptStart);
        if(scriptEnd !== -1){
          scriptEnd += 9; // '</script>'.length
          result = result.substring(0, scriptStart) + result.substring(scriptEnd);
          lower = result.toLowerCase();
        } else {
          // 닫는 태그 없으면 끝까지 제거
          result = result.substring(0, scriptStart);
          break;
        }
        scriptStart = lower.indexOf('<script');
      }
      
      // 이벤트 핸들러 제거 (onClick, ONCLICK, OnClick 등)
      result = result.replace(/\s+on[a-z]+\s*=\s*["'][^"']*["']/gi, '');
      result = result.replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, '');
      
      return result;
    }

    // XSS 방지 - 위험한 태그/속성 제거 (화이트리스트)
    ,sanitize: function(str, options){
      if(typeof str !== 'string') return str;
      
      options = options || {};
      var allowedTags = options.allowedTags || ['b', 'i', 'u', 'strong', 'em', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div'];
      var allowedAttrs = options.allowedAttrs || ['href', 'title', 'class', 'id', 'style'];
      
      // 대소문자 혼합 우회 방지를 위해 태그명 정규화
      var lower = str.toLowerCase();
      
      // script 태그 완전 제거 (대소문자 무관)
      var scriptStart = lower.indexOf('<script');
      while(scriptStart !== -1){
        var scriptEnd = lower.indexOf('</script>', scriptStart);
        if(scriptEnd !== -1){
          scriptEnd += 9;
          str = str.substring(0, scriptStart) + str.substring(scriptEnd);
          lower = str.toLowerCase();
        } else {
          str = str.substring(0, scriptStart);
          break;
        }
        scriptStart = lower.indexOf('<script');
      }
      
      // 이벤트 핸들러 제거 (대소문자 무관)
      str = str.replace(/\s+on[a-z]+\s*=\s*["'][^"']*["']/gi, '');
      str = str.replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, '');
      
      // javascript: 프로토콜 제거 (대소문자, 공백 무관)
      str = str.replace(/j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi, '');
      
      // vbscript: 프로토콜 제거
      str = str.replace(/v\s*b\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi, '');
      
      // data: 프로토콜 제거 (이미지 외)
      str = str.replace(/data\s*:\s*(?!image\/)/gi, '');
      
      // expression() 제거 (IE CSS 공격)
      str = str.replace(/expression\s*\(/gi, '');
      
      // 허용되지 않은 태그 제거
      var tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
      str = str.replace(tagPattern, function(match, tagName){
        var lowerTagName = tagName.toLowerCase();
        if(allowedTags.indexOf(lowerTagName) !== -1){
          // 허용된 태그 - 허용되지 않은 속성 제거
          return match.replace(/\s+([a-z-]+)\s*=\s*["'][^"']*["']/gi, function(attrMatch, attrName){
            var lowerAttrName = attrName.toLowerCase();
            // on으로 시작하는 이벤트 핸들러 차단
            if(lowerAttrName.indexOf('on') === 0) return '';
            if(allowedAttrs.indexOf(lowerAttrName) !== -1){
              return attrMatch;
            }
            return '';
          });
        }
        return '';  // 태그 제거
      });
      
      return str;
    }

    // SQL 인젝션 방지 - 위험 문자 이스케이프
    ,escapeSql: function(str){
      if(typeof str !== 'string') return str;
      return str
        .replace(/'/g, "''")
        .replace(/\\/g, '\\\\')
        .replace(/\x00/g, '\\0')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\x1a/g, '\\Z');
    }

    // 정규식 특수문자 이스케이프
    ,escapeRegex: function(str){
      if(typeof str !== 'string') return str;
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 안전한 JSON 파싱
    ,safeJsonParse: function(str, defaultValue){
      if(typeof str !== 'string') return defaultValue !== undefined ? defaultValue : null;
      try {
        return JSON.parse(str);
      } catch(_e){
        return defaultValue !== undefined ? defaultValue : null;
      }
    }

    // URL 파라미터 안전 인코딩
    ,safeEncodeUri: function(str){
      if(typeof str !== 'string') return str;
      return encodeURIComponent(str)
        .replace(/[!'()*]/g, function(c){
          return '%' + c.charCodeAt(0).toString(16).toUpperCase();
        });
    }

    // 날짜 문자열 변환
    ,toDateString: function(date, format){
      if(!date) return '';
      var d = date instanceof Date ? date : new Date(date);
      if(isNaN(d.getTime())) return '';
      
      format = format || 'yyyy-MM-dd HH:mm:ss';
      
      var pad = function(n){ return n < 10 ? '0' + n : n; };
      
      var tokens = {
        'yyyy': d.getFullYear(),
        'yy': String(d.getFullYear()).slice(-2),
        'MM': pad(d.getMonth() + 1),
        'M': d.getMonth() + 1,
        'dd': pad(d.getDate()),
        'd': d.getDate(),
        'HH': pad(d.getHours()),
        'H': d.getHours(),
        'hh': pad(d.getHours() % 12 || 12),
        'h': d.getHours() % 12 || 12,
        'mm': pad(d.getMinutes()),
        'm': d.getMinutes(),
        'ss': pad(d.getSeconds()),
        's': d.getSeconds()
      };
      
      return format.replace(/yyyy|yy|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s/g, function(match){
        return tokens[match];
      });
    }

    // 숫자 카운트업 애니메이션
    ,countUp: function(options){
      var $c = get$c();
      if(!$c) return;

      options = $c.extend({
        elem: null           // 대상 요소
        ,start: 0            // 시작값
        ,end: 100            // 종료값
        ,duration: 1500      // 지속시간 (ms)
        ,decimals: 0         // 소수점 자리수
        ,separator: ','      // 천단위 구분자
        ,prefix: ''          // 접두사
        ,suffix: ''          // 접미사
        ,easing: true        // 이징 효과
        ,callback: null      // 완료 콜백
      }, options);

      var elem = $c(options.elem);
      if(!elem[0]) return;

      var start = parseFloat(options.start) || 0;
      var end = parseFloat(options.end) || 0;
      var duration = options.duration;
      var decimals = options.decimals;
      var startTime = null;

      // 숫자 포맷팅
      var formatNumber = function(num){
        var fixed = num.toFixed(decimals);
        var parts = fixed.split('.');
        if(options.separator){
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, options.separator);
        }
        return options.prefix + parts.join('.') + options.suffix;
      };

      // 이징 함수 (easeOutExpo)
      var easeOutExpo = function(t){
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      };

      var animate = function(timestamp){
        if(!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        
        var easedProgress = options.easing ? easeOutExpo(progress) : progress;
        var current = start + (end - start) * easedProgress;
        
        elem.html(formatNumber(current));

        if(progress < 1){
          requestAnimationFrame(animate);
        } else {
          elem.html(formatNumber(end));
          if(typeof options.callback === 'function'){
            options.callback();
          }
        }
      };

      requestAnimationFrame(animate);
    }
  };

  // 전역 노출
  window.util = util;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = util;
  }

}(window);
