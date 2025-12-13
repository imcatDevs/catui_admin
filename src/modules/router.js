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
      onError: null,            // 에러 핸들러
      
      // 페이지 탭 설정
      pageTabs: false,          // 페이지 탭 활성화
      pageTabsNames: {},        // 페이지 이름 매핑 { 'page.html': { name: '이름', icon: 'icon' } }
      
      // 퀵링크 설정 (레거시 - pageTabs 사용 권장)
      quicklink: false,         // 퀵링크 활성화
      quicklinkContainer: null, // 퀵링크 컨테이너 (CSS 선택자)
      quicklinkHome: null,      // 홈 경로 (퀵링크에서 제외)
      quicklinkNames: {},       // 페이지 이름 매핑 { 'page.html': { name: '이름', icon: 'icon' } }
      onQuicklinkAdd: null,     // 퀵링크 추가 콜백
      onQuicklinkRemove: null   // 퀵링크 제거 콜백
    }
    
    // 퀵링크 저장소
    ,quicklinks: {}

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
            // 캐시 삭제 후 이동 (동적 페이지 대응)
            that.clearCache(href);
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

      // resize 이벤트 - 퀵링크 위치 재계산
      var resizeTimer;
      window.addEventListener('resize', function(){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function(){
          that.resetQuicklinksScroll();
        }, 100);
      });

      return that;
    }
    
    // 퀵링크 스크롤 위치 리셋
    ,resetQuicklinksScroll: function(){
      var that = this;
      var config = that.config;
      if(!config.quicklinkContainer) return that;
      
      var listContainer = document.querySelector(config.quicklinkContainer);
      if(listContainer){
        // 현재 활성 탭이 보이도록 스크롤
        var activeItem = listContainer.querySelector('.cui-quicklink-active');
        if(activeItem){
          var items = listContainer.querySelectorAll('.cui-quicklink-item');
          var index = Array.prototype.indexOf.call(items, activeItem);
          that.scrollQuicklinks('auto', index);
        }
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

    // 경로 정규화 (root 적용)
    ,normalizePath: function(path){
      var that = this;
      var root = that.config.root || '/';
      
      // http/https URL은 그대로
      if(path.indexOf('http') === 0) return path;
      
      // 절대 경로 (root 적용 안함)
      if(path.indexOf('/') === 0) return path;
      
      // 상대 경로 - root 적용
      root = root.replace(/\/+$/, ''); // 끝의 슬래시 제거
      return root + '/' + path;
    }

    // 라우트 이동
    ,go: function(path, linkElem){
      var that = this;
      
      // 경로 정규화 (root 적용)
      path = that.normalizePath(path);

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
        // config.container 우선, 없으면 targetAttr로 검색
        container = that.config.container 
          ? document.querySelector(that.config.container)
          : document.querySelector('[' + that.config.targetAttr + ']');
      }

      // silentMode - URL 변경 없이 페이지만 로드
      if(that.config.silentMode){
        // 히스토리 스택에 추가 (현재 위치 이후 삭제 후 추가)
        historyStack = historyStack.slice(0, historyIndex + 1);
        historyStack.push(path);
        historyIndex = historyStack.length - 1;
        
        that.loadRoute(path, container);
      }
      // hash 모드
      else if(that.config.hashbang){
        window.location.hash = '#' + path;
      } else {
        history.pushState({ path: path }, '', path);
        that.loadRoute(path, container);
      }

      // pageTabs 연동
      if(that.config.pageTabs && window.pagetabs){
        var filename = path.split('/').pop().split('?')[0];
        var tabInfo = that.config.pageTabsNames[filename] || {};
        window.pagetabs.add({
          id: path,
          path: path,
          title: tabInfo.name || filename.replace('.html', ''),
          icon: tabInfo.icon || ''
        });
        window.pagetabs.active(path);
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

      // 컨테이너 (config.container 우선)
      if(!container){
        container = that.config.container 
          ? document.querySelector(that.config.container)
          : document.querySelector('[' + that.config.targetAttr + ']');
      }
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
        
        // 외부 스크립트 (src 속성 있음)
        if(oldScript.src){
          newScript.src = oldScript.src;
        } else {
          // 인라인 스크립트
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

    // 현재 페이지 새로고침
    ,refresh: function(){
      var that = this;
      var path = currentRoute.path;
      if(path){
        that.clearCache(path);
        that.go(path);
      }
      return that;
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

    // 퀵링크 추가
    ,addQuicklink: function(path){
      var that = this;
      var config = that.config;
      
      if(!config.quicklink || !config.quicklinkContainer) return that;
      
      // 홈 경로는 퀵링크에서 제외
      if(config.quicklinkHome && path === config.quicklinkHome) return that;
      
      // 이미 존재하면 활성화만
      if(that.quicklinks[path]){
        that.setActiveQuicklink(path);
        return that;
      }
      
      var container = document.querySelector(config.quicklinkContainer);
      if(!container) return that;
      
      // 페이지 정보 가져오기
      var filename = path.split('/').pop();
      var info = config.quicklinkNames[filename] || { name: filename, icon: 'description' };
      
      // 퀵링크 요소 생성
      var link = document.createElement('a');
      link.className = 'cui-quicklink-item cui-quicklink-active';
      link.href = 'javascript:;';
      link.setAttribute('data-path', path);
      link.innerHTML = '<i class="cui-icon cui-quicklink-icon">' + info.icon + '</i>'
        + '<span class="cui-quicklink-title">' + info.name + '</span>'
        + '<span class="cui-quicklink-close"><i class="cui-icon">close</i></span>';
      
      // 클릭 이벤트 - 캐시 무시하고 리로드
      link.addEventListener('click', function(e){
        if(!e.target.closest('.cui-quicklink-close')){
          e.preventDefault();
          // 캐시 삭제 후 이동
          router.clearCache(path);
          router.go(path);
        }
      });
      
      // 닫기 버튼 이벤트
      link.querySelector('.cui-quicklink-close').addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        router.removeQuicklink(path);
      });
      
      container.appendChild(link);
      that.quicklinks[path] = link;
      that.setActiveQuicklink(path);
      that.updateQuicklinkVisibility();
      
      if(typeof config.onQuicklinkAdd === 'function'){
        config.onQuicklinkAdd(path, link);
      }
      
      return that;
    }
    
    // 퀵링크 제거
    ,removeQuicklink: function(path){
      var that = this;
      var config = that.config;
      var link = that.quicklinks[path];
      
      if(link){
        link.remove();
        delete that.quicklinks[path];
        that.updateQuicklinkVisibility();
        
        if(typeof config.onQuicklinkRemove === 'function'){
          config.onQuicklinkRemove(path);
        }
        
        // 다른 퀵링크로 이동
        var keys = Object.keys(that.quicklinks);
        if(keys.length > 0){
          router.go(keys[keys.length - 1]);
        }
      }
      
      return that;
    }
    
    // 활성 퀵링크 설정
    ,setActiveQuicklink: function(path){
      var that = this;
      document.querySelectorAll('.cui-quicklink-item').forEach(function(el){
        el.classList.remove('cui-quicklink-active');
      });
      if(path && that.quicklinks[path]){
        that.quicklinks[path].classList.add('cui-quicklink-active');
      }
      return that;
    }
    
    // 퀵링크 컨테이너 가시성 업데이트
    ,updateQuicklinkVisibility: function(){
      var that = this;
      var config = that.config;
      if(!config.quicklinkContainer) return that;
      
      var wrapper = document.querySelector(config.quicklinkContainer);
      if(wrapper && wrapper.parentElement){
        var parent = wrapper.closest('.cui-quicklinks');
        if(parent){
          var count = Object.keys(that.quicklinks).length;
          parent.style.display = count > 0 ? 'flex' : 'none';
        }
      }
      return that;
    }
    
    // 퀵링크 스크롤
    ,scrollQuicklinks: function(direction, autoIndex){
      var that = this;
      var config = that.config;
      if(!config.quicklinkContainer) return that;
      
      var listContainer = document.querySelector(config.quicklinkContainer);
      if(!listContainer) return that;
      
      var quicklinksWrap = listContainer.parentElement; // .cui-quicklinks-wrap
      var items = listContainer.querySelectorAll('.cui-quicklink-item');
      if(!items.length) return that;
      
      var scrollWidth = listContainer.scrollWidth;
      var outerWidth = quicklinksWrap.clientWidth; // wrap 자체가 이미 버튼 제외한 영역
      var currentLeft = parseFloat(listContainer.style.left) || 0;
      
      if(direction === 'auto' && typeof autoIndex === 'number'){
        // 자동 스크롤 (특정 탭으로)
        var targetItem = items[autoIndex];
        if(!targetItem) return that;
        
        var targetLeft = targetItem.offsetLeft;
        var targetWidth = targetItem.offsetWidth;
        
        // 왼쪽으로 벗어난 경우
        if(targetLeft < -currentLeft){
          listContainer.style.left = -targetLeft + 'px';
        }
        // 오른쪽으로 벗어난 경우
        else if(targetLeft + targetWidth > outerWidth - currentLeft){
          var newLeft = -(targetLeft + targetWidth - outerWidth);
          listContainer.style.left = newLeft + 'px';
        }
      } else if(direction === -1){
        // 왼쪽으로 스크롤
        if(currentLeft >= 0) return that;
        
        var newLeft = currentLeft + outerWidth;
        if(newLeft > 0) newLeft = 0;
        listContainer.style.left = newLeft + 'px';
      } else {
        // 오른쪽으로 스크롤
        var maxScroll = -(scrollWidth - outerWidth);
        if(currentLeft <= maxScroll) return that;
        
        var newLeft = currentLeft - outerWidth;
        if(newLeft < maxScroll) newLeft = maxScroll;
        listContainer.style.left = newLeft + 'px';
      }
      
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
