/*!
 * Catui router - SPA 라우터 모듈
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'router'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 현재 라우트 정보
  ,currentRoute = {
    path: '',
    params: {},
    query: {}
  }

  // 내부 히스토리 스택 (silentMode용)
  ,historyStack = []
  ,historyIndex = -1

  // 라우트 캐시
  ,cache = {}

  // 로딩 중인 요청
  ,loading = {}

  // 초기화 플래그
  ,initialized = false

  // 페이지 인스턴스 관리 (메모리 누수 방지)
  ,pageInstances = {
    intervals: [],      // setInterval ID 목록
    timeouts: [],       // setTimeout ID 목록
    listeners: [],      // 이벤트 리스너 목록 [{elem, type, handler}]
    cleanups: []        // 커스텀 정리 함수 목록
  };

  // 라우터 인터페이스
  var router = {
    config: {
      // 기본 설정
      hashbang: false,          // hash 모드 (#/) - 기본 비활성화
      silentMode: true,         // URL 변경 없이 페이지만 로드 (기본 활성화)
      root: '/',                // 기본 경로
      cache: true,              // 페이지 캐싱
      container: null,          // 기본 컨테이너 (cui-target-content)
      linkAttr: 'cui-href',     // 링크 속성
      targetAttr: 'cui-target-content',  // 타겟 속성
      activeClass: 'cui-router-active',  // 활성 링크 클래스
      loadingClass: 'cui-router-loading', // 로딩 클래스
      transition: true,         // 트랜지션 효과
      beforeEach: null,         // 라우트 전 훅
      afterEach: null,          // 라우트 후 훅
      onError: null             // 에러 핸들러
    }

    // 전역 설정
    ,set: function(options){
      var that = this;
      var $c = get$c();
      if($c){
        that.config = $c.extend({}, that.config, options);
      } else {
        // $c 없으면 수동 병합
        for(var key in options){
          if(options.hasOwnProperty(key)){
            that.config[key] = options[key];
          }
        }
      }
      return that;
    }

    // 초기화 (자동 실행)
    ,init: function(){
      var that = this;
      var $c = get$c();
      
      // 이미 초기화되었으면 스킵
      if(initialized) return that;
      
      if(!$c){
        setTimeout(function(){ that.init(); }, 50);
        return;
      }
      
      initialized = true;

      // 이벤트 위임 - cui-href 클릭 처리
      document.addEventListener('click', function(e){
        var target = e.target;
        
        // cui-href 속성 찾기 (버블링)
        while(target && target !== document){
          var href = target.getAttribute(that.config.linkAttr);
          if(href){
            e.preventDefault();
            that.go(href, target);
            return;
          }
          target = target.parentNode;
        }
      });

      // hash 변경 감지
      if(that.config.hashbang){
        window.addEventListener('hashchange', function(){
          var path = that.getHashPath();
          if(path !== currentRoute.path){
            that.loadRoute(path);
          }
        });
      }

      // popstate 감지 (history 모드)
      window.addEventListener('popstate', function(e){
        if(e.state && e.state.path){
          that.loadRoute(e.state.path, null, true);
        }
      });

      // 초기 라우트 로드
      var initialPath = that.getHashPath();
      if(initialPath){
        that.loadRoute(initialPath);
      }

      return that;
    }

    // 해시 경로 가져오기
    ,getHashPath: function(){
      var hash = window.location.hash;
      if(hash.indexOf('#/') === 0){
        return hash.substring(1);
      } else if(hash.indexOf('#') === 0){
        return '/' + hash.substring(1);
      }
      return '';
    }

    // 라우트 이동
    ,go: function(path, linkElem){
      var that = this;
      
      // 상대 경로 처리
      if(path.indexOf('/') !== 0 && path.indexOf('http') !== 0){
        path = '/' + path;
      }

      // 타겟 컨테이너 찾기
      var container = null;
      if(linkElem){
        // 링크에 지정된 타겟
        var targetId = linkElem.getAttribute('cui-target');
        if(targetId){
          container = document.querySelector(targetId);
        }
        // 가장 가까운 cui-target-content 찾기
        if(!container){
          container = that.findContainer(linkElem);
        }
      }
      if(!container){
        container = document.querySelector('[' + that.config.targetAttr + ']');
      }

      // silentMode - URL 변경 없이 페이지만 로드
      if(that.config.silentMode){
        // 히스토리 스택에 추가
        historyIndex++;
        historyStack = historyStack.slice(0, historyIndex);
        historyStack.push(path);
        
        that.loadRoute(path, container);
      }
      // hash 모드
      else if(that.config.hashbang){
        window.location.hash = '#' + path;
      } else {
        history.pushState({ path: path }, '', path);
        that.loadRoute(path, container);
      }

      return that;
    }

    // 컨테이너 찾기
    ,findContainer: function(elem){
      var that = this;
      var parent = elem.parentNode;
      while(parent && parent !== document){
        var container = parent.querySelector('[' + that.config.targetAttr + ']');
        if(container) return container;
        parent = parent.parentNode;
      }
      return document.querySelector('[' + that.config.targetAttr + ']');
    }

    // 라우트 로드
    ,loadRoute: function(path, container, isPopstate){
      var that = this;
      var $c = get$c();
      
      if(!$c) return that;

      // 컨테이너
      container = container || document.querySelector('[' + that.config.targetAttr + ']');
      if(!container){
        console.warn('[Router] cui-target-content 컨테이너를 찾을 수 없습니다.');
        return that;
      }

      // 쿼리스트링 파싱
      var pathParts = path.split('?');
      var cleanPath = pathParts[0];
      var queryString = pathParts[1] || '';
      var query = that.parseQuery(queryString);

      // beforeEach 훅 (정리 전에 호출 - 취소 가능)
      if(typeof that.config.beforeEach === 'function'){
        var next = that.config.beforeEach({
          path: cleanPath,
          query: query,
          from: currentRoute
        });
        if(next === false) return that;
        if(typeof next === 'string'){
          cleanPath = next;
        }
      }

      // 기존 페이지 인스턴스 정리 (메모리 누수 방지)
      that._cleanup();

      // 현재 라우트 업데이트
      currentRoute = {
        path: cleanPath,
        query: query,
        params: {}
      };

      // 캐시 확인
      if(that.config.cache && cache[cleanPath]){
        that.renderContent(container, cache[cleanPath]);
        that.updateActiveLinks(cleanPath);
        
        // afterEach 훅 (캐시 로드 시에도 호출)
        if(typeof that.config.afterEach === 'function'){
          that.config.afterEach(currentRoute);
        }
        return that;
      }

      // 로딩 중 표시
      container.classList.add(that.config.loadingClass);

      // 이미 로딩 중이면 무시
      if(loading[cleanPath]){
        return that;
      }
      loading[cleanPath] = true;

      // AJAX 로드
      $c.ajax({
        url: cleanPath,
        type: 'GET',
        dataType: 'html',
        timeout: 30000,
        success: function(html){
          delete loading[cleanPath];
          
          // 캐시 저장
          if(that.config.cache){
            cache[cleanPath] = html;
          }

          // 렌더링
          that.renderContent(container, html);
          that.updateActiveLinks(cleanPath);

          // afterEach 훅
          if(typeof that.config.afterEach === 'function'){
            that.config.afterEach(currentRoute);
          }
        },
        error: function(xhr, status){
          delete loading[cleanPath];
          container.classList.remove(that.config.loadingClass);
          
          var errorMsg = '<div class="cui-router-error">' +
            '<h3>페이지를 불러올 수 없습니다</h3>' +
            '<p>' + (status === 'timeout' ? '요청 시간 초과' : '오류: ' + xhr.status) + '</p>' +
          '</div>';
          
          container.innerHTML = errorMsg;

          if(typeof that.config.onError === 'function'){
            that.config.onError(xhr, status, cleanPath);
          }
        }
      });

      return that;
    }

    // 컨텐츠 렌더링
    ,renderContent: function(container, html){
      var that = this;
      var $c = get$c();

      container.classList.remove(that.config.loadingClass);

      // 트랜지션
      if(that.config.transition){
        container.style.opacity = '0';
        container.innerHTML = html;
        
        // 스크립트 실행
        that.executeScripts(container);
        
        // Catui 컴포넌트 자동 렌더링
        that.renderCatuiComponents(container);

        setTimeout(function(){
          container.style.transition = 'opacity 0.2s';
          container.style.opacity = '1';
        }, 10);
      } else {
        container.innerHTML = html;
        that.executeScripts(container);
        that.renderCatuiComponents(container);
      }
    }

    // 스크립트 실행
    ,executeScripts: function(container){
      var scripts = container.querySelectorAll('script');
      
      scripts.forEach(function(oldScript){
        var newScript = document.createElement('script');
        
        // 속성 복사
        Array.from(oldScript.attributes).forEach(function(attr){
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // 인라인 스크립트
        if(!oldScript.src){
          newScript.textContent = oldScript.textContent;
        }
        
        // 기존 스크립트 교체
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }

    // Catui 컴포넌트 자동 렌더링
    // 각 페이지에서 Catui.use로 필요한 모듈을 로드하고 직접 렌더링하는 것을 권장
    // 이 함수는 이미 로드된 모듈만 자동 렌더링 (선택적)
    ,renderCatuiComponents: function(container){
      var $c = get$c();
      if(!$c) return;

      // 커스텀 이벤트 발생 - 페이지에서 이 이벤트를 받아 처리 가능
      var event = new CustomEvent('cui:routerender', {
        detail: { container: container, route: currentRoute }
      });
      document.dispatchEvent(event);
    }

    // 활성 링크 업데이트
    ,updateActiveLinks: function(path){
      var that = this;
      var links = document.querySelectorAll('[' + that.config.linkAttr + ']');
      
      links.forEach(function(link){
        var href = link.getAttribute(that.config.linkAttr);
        if(href === path || '/' + href === path){
          link.classList.add(that.config.activeClass);
        } else {
          link.classList.remove(that.config.activeClass);
        }
      });
    }

    // 쿼리스트링 파싱
    ,parseQuery: function(str){
      var result = {};
      if(!str) return result;
      
      var pairs = str.split('&');
      pairs.forEach(function(pair){
        var parts = pair.split('=');
        if(parts[0]){
          result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
        }
      });
      return result;
    }

    // 현재 라우트 가져오기
    ,current: function(){
      return currentRoute;
    }

    // 뒤로 가기
    ,back: function(){
      var that = this;
      if(that.config.silentMode){
        if(historyIndex > 0){
          historyIndex--;
          that.loadRoute(historyStack[historyIndex]);
        }
      } else {
        history.back();
      }
      return that;
    }

    // 앞으로 가기
    ,forward: function(){
      var that = this;
      if(that.config.silentMode){
        if(historyIndex < historyStack.length - 1){
          historyIndex++;
          that.loadRoute(historyStack[historyIndex]);
        }
      } else {
        history.forward();
      }
      return that;
    }

    // 새로고침
    ,reload: function(){
      var that = this;
      if(currentRoute.path){
        delete cache[currentRoute.path];
        that.loadRoute(currentRoute.path);
      }
      return that;
    }

    // 캐시 클리어
    ,clearCache: function(path){
      if(path){
        delete cache[path];
      } else {
        cache = {};
      }
      return this;
    }

    // 프리로드
    ,preload: function(paths){
      var that = this;
      var $c = get$c();
      if(!$c) return that;

      (Array.isArray(paths) ? paths : [paths]).forEach(function(path){
        if(!cache[path]){
          $c.ajax({
            url: path,
            type: 'GET',
            dataType: 'html',
            success: function(html){
              cache[path] = html;
            }
          });
        }
      });

      return that;
    }

    // 이벤트 등록
    ,on: function(events, callback){
      if(window.Catui && Catui.onevent){
        return Catui.onevent.call(this, MOD_NAME, events, callback);
      }
      return this;
    }

    // ========== 인스턴스 관리 API (메모리 누수 방지) ==========

    // setInterval 등록 (페이지 이동 시 자동 정리)
    ,addInterval: function(callback, delay){
      var id = setInterval(callback, delay);
      pageInstances.intervals.push(id);
      return id;
    }

    // setTimeout 등록 (페이지 이동 시 자동 정리)
    ,addTimeout: function(callback, delay){
      var id = setTimeout(callback, delay);
      pageInstances.timeouts.push(id);
      return id;
    }

    // 이벤트 리스너 등록 (페이지 이동 시 자동 정리)
    ,bindEvent: function(elem, type, handler, options){
      var that = this;
      if(typeof elem === 'string'){
        elem = document.querySelector(elem);
      }
      if(!elem) return that;
      
      elem.addEventListener(type, handler, options);
      pageInstances.listeners.push({
        elem: elem,
        type: type,
        handler: handler,
        options: options
      });
      return that;
    }

    // 커스텀 정리 함수 등록
    ,addCleanup: function(fn){
      var that = this;
      if(typeof fn === 'function'){
        pageInstances.cleanups.push(fn);
      }
      return that;
    }

    // 수동으로 interval 제거
    ,removeInterval: function(id){
      var that = this;
      clearInterval(id);
      var idx = pageInstances.intervals.indexOf(id);
      if(idx > -1) pageInstances.intervals.splice(idx, 1);
      return that;
    }

    // 수동으로 timeout 제거
    ,removeTimeout: function(id){
      var that = this;
      clearTimeout(id);
      var idx = pageInstances.timeouts.indexOf(id);
      if(idx > -1) pageInstances.timeouts.splice(idx, 1);
      return that;
    }

    // 페이지 인스턴스 정리 (내부 사용)
    ,_cleanup: function(){
      // intervals 정리
      pageInstances.intervals.forEach(function(id){
        clearInterval(id);
      });
      pageInstances.intervals = [];

      // timeouts 정리
      pageInstances.timeouts.forEach(function(id){
        clearTimeout(id);
      });
      pageInstances.timeouts = [];

      // 이벤트 리스너 정리
      pageInstances.listeners.forEach(function(item){
        if(item.elem && item.elem.removeEventListener){
          item.elem.removeEventListener(item.type, item.handler, item.options);
        }
      });
      pageInstances.listeners = [];

      // 커스텀 정리 함수 실행
      pageInstances.cleanups.forEach(function(fn){
        try { fn(); } catch(e){ console.warn('[Router] cleanup error:', e); }
      });
      pageInstances.cleanups = [];

      // beforeDestroy 이벤트 발생
      var event = new CustomEvent('cui:routedestroy', {
        detail: { route: currentRoute }
      });
      document.dispatchEvent(event);

      return this;
    }
  };

  // Catui.use 시 자동 초기화
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      router.init();
    });
  } else {
    router.init();
  }

  // 전역 노출
  window.router = router;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = router;
  }

}(window);
