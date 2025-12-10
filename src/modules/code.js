/*!
 * Catui code - 코드 하이라이팅 모듈
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'code'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; };

  // 키워드 정의
  var KEYWORDS = {
    javascript: ['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'new', 'delete', 'typeof', 'instanceof', 'in', 'this', 'class', 'extends', 'super', 'import', 'export', 'default', 'from', 'async', 'await', 'yield', 'static', 'get', 'set', 'true', 'false', 'null', 'undefined', 'NaN', 'Infinity'],
    html: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'select', 'option', 'textarea', 'label', 'script', 'style', 'link', 'meta', 'title', 'header', 'footer', 'nav', 'main', 'section', 'article', 'aside', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr'],
    css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom', 'font', 'text', 'flex', 'grid', 'align', 'justify', 'transform', 'transition', 'animation', 'opacity', 'overflow', 'z-index', 'box-shadow', 'border-radius']
  };

  // 외부 인터페이스
  var code = {
    config: {}

    // 전역 설정
    ,set: function(options){
      var $c = get$c();
      this.config = $c.extend({}, this.config, options);
      return this;
    }

    // 자동 하이라이팅
    ,render: function(filter){
      var $c = get$c();
      if(!$c) return;

      var selector = filter || 'pre code, .cui-code';
      $c(selector).each(function(i, elem){
        code.highlight(elem);
      });
    }

    // 단일 요소 하이라이팅
    ,highlight: function(elem){
      var $c = get$c();
      if(!$c) return;

      elem = $c(elem)[0];
      if(!elem || elem.getAttribute('data-highlighted')) return;

      var lang = code.detectLanguage(elem);
      var content = elem.textContent || elem.innerText;
      var highlighted = code.parse(content, lang);

      elem.innerHTML = highlighted;
      elem.setAttribute('data-highlighted', 'true');
      elem.setAttribute('data-lang', lang);

      // 줄번호 추가
      if(elem.classList.contains('cui-code-line') || elem.parentElement.classList.contains('cui-code-line')){
        code.addLineNumbers(elem);
      }
    }

    // 언어 감지
    ,detectLanguage: function(elem){
      var className = elem.className || '';
      var parent = elem.parentElement;
      var parentClass = parent ? (parent.className || '') : '';

      // class에서 언어 추출
      var match = className.match(/lang(?:uage)?-(\w+)/) || 
                  parentClass.match(/lang(?:uage)?-(\w+)/) ||
                  className.match(/cui-code-(\w+)/);

      if(match) return match[1].toLowerCase();

      // 내용으로 추측
      var content = elem.textContent || '';
      if(/<\w+/.test(content)) return 'html';
      if(/function|const|let|var/.test(content)) return 'javascript';
      if(/{[\s\S]*:[\s\S]*}/.test(content) && /;/.test(content)) return 'css';

      return 'text';
    }

    // 파싱
    ,parse: function(content, lang){
      // HTML 이스케이프
      content = code.escape(content);

      switch(lang){
        case 'javascript':
        case 'js':
          return code.parseJS(content);
        case 'html':
        case 'xml':
          return code.parseHTML(content);
        case 'css':
          return code.parseCSS(content);
        case 'json':
          return code.parseJSON(content);
        default:
          return content;
      }
    }

    // JavaScript 파싱
    ,parseJS: function(content){
      // 문자열
      content = content.replace(/(["'`])(?:(?!\1|\\).|\\.)*\1/g, '<span class="cui-code-string">$&</span>');
      
      // 주석
      content = content.replace(/(\/\/.*$)/gm, '<span class="cui-code-comment">$1</span>');
      content = content.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cui-code-comment">$1</span>');
      
      // 키워드
      var keywords = KEYWORDS.javascript;
      keywords.forEach(function(kw){
        var regex = new RegExp('\\b(' + kw + ')\\b(?![^<]*>)', 'g');
        content = content.replace(regex, '<span class="cui-code-keyword">$1</span>');
      });
      
      // 숫자
      content = content.replace(/\b(\d+\.?\d*)\b(?![^<]*>)/g, '<span class="cui-code-number">$1</span>');
      
      // 함수
      content = content.replace(/\b([a-zA-Z_]\w*)\s*\((?![^<]*>)/g, '<span class="cui-code-function">$1</span>(');

      return content;
    }

    // HTML 파싱
    ,parseHTML: function(content){
      // 태그
      content = content.replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="cui-code-tag">$2</span>');
      
      // 속성
      content = content.replace(/\s([\w-]+)(=)/g, ' <span class="cui-code-attr">$1</span>$2');
      
      // 속성값
      content = content.replace(/(=)(&quot;[^&]*&quot;)/g, '$1<span class="cui-code-string">$2</span>');
      
      // 주석
      content = content.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="cui-code-comment">$1</span>');

      return content;
    }

    // CSS 파싱
    ,parseCSS: function(content){
      // 주석
      content = content.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cui-code-comment">$1</span>');
      
      // 선택자
      content = content.replace(/^([^{]+)({)/gm, '<span class="cui-code-selector">$1</span>$2');
      
      // 속성
      content = content.replace(/([\w-]+)\s*:/g, '<span class="cui-code-property">$1</span>:');
      
      // 값
      content = content.replace(/:\s*([^;{}]+)/g, ': <span class="cui-code-value">$1</span>');
      
      // 숫자/단위
      content = content.replace(/\b(\d+\.?\d*)(px|em|rem|%|vh|vw|s|ms)?\b(?![^<]*>)/g, '<span class="cui-code-number">$1$2</span>');

      return content;
    }

    // JSON 파싱
    ,parseJSON: function(content){
      // 키
      content = content.replace(/(&quot;)([\w-]+)(&quot;)\s*:/g, '$1<span class="cui-code-property">$2</span>$3:');
      
      // 문자열 값
      content = content.replace(/:\s*(&quot;[^&]*&quot;)/g, ': <span class="cui-code-string">$1</span>');
      
      // 숫자
      content = content.replace(/:\s*(\d+\.?\d*)/g, ': <span class="cui-code-number">$1</span>');
      
      // 불린
      content = content.replace(/:\s*(true|false|null)/g, ': <span class="cui-code-keyword">$1</span>');

      return content;
    }

    // HTML 이스케이프
    ,escape: function(str){
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // 줄번호 추가
    ,addLineNumbers: function(elem){
      var lines = elem.innerHTML.split('\n');
      var numbered = lines.map(function(line, i){
        return '<span class="cui-code-line-num">' + (i + 1) + '</span>' + line;
      });
      elem.innerHTML = numbered.join('\n');
    }

    // 복사 버튼 추가
    ,addCopyButton: function(elem){
      var $c = get$c();
      if(!$c) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'cui-code-wrapper';
      
      elem.parentNode.insertBefore(wrapper, elem);
      wrapper.appendChild(elem);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cui-code-copy';
      btn.innerHTML = '<i class="cui-icon">content_copy</i>';
      btn.title = '복사';
      
      btn.addEventListener('click', function(){
        var text = elem.textContent || elem.innerText;
        navigator.clipboard.writeText(text).then(function(){
          btn.innerHTML = '<i class="cui-icon">check</i>';
          setTimeout(function(){
            btn.innerHTML = '<i class="cui-icon">content_copy</i>';
          }, 2000);
        });
      });

      wrapper.appendChild(btn);
    }

    // 이벤트 등록
    ,on: function(events, callback){
      if(window.Catui && Catui.onevent){
        return Catui.onevent.call(this, MOD_NAME, events, callback);
      }
      return this;
    }
  };

  // 전역 노출
  window.code = code;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = code;
  }

}(window);
