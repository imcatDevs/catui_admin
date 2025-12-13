/*!
 * CatUI pagetabs - 페이지 탭 모듈
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'pagetabs'
  ,get$c = function(){ return window.$c; }
  
  // 탭 데이터
  ,tabs = {}
  ,tabsOrder = []
  ,activeTab = null
  ,initialized = false
  
  // DOM 요소 캐시
  ,elements = {
    container: null,
    list: null,
    wrap: null
  };

  // pagetabs 인터페이스
  var pagetabs = {
    config: {
      container: '#cuiPagetabs',      // 탭 컨테이너
      listSelector: '.cui-pagetabs-list',
      wrapSelector: '.cui-pagetabs-wrap',
      homeTab: true,                   // 홈 탭 표시
      homeIcon: 'home',               // 홈 아이콘
      homePath: '/examples/router/pages/home.html',
      maxTabs: 20,                     // 최대 탭 수
      closeable: true,                 // 탭 닫기 가능
      onChange: null,                  // 탭 변경 콜백
      onAdd: null,                     // 탭 추가 콜백
      onRemove: null                   // 탭 삭제 콜백
    }

    // 설정
    ,set: function(options){
      var that = this;
      for(var key in options){
        if(that.config.hasOwnProperty(key)){
          that.config[key] = options[key];
        }
      }
      return that;
    }

    // 초기화
    ,init: function(){
      var that = this;
      var config = that.config;
      
      if(initialized) return that;
      
      // DOM 요소 캐시
      elements.container = document.querySelector(config.container);
      if(!elements.container) return that;
      
      elements.list = elements.container.querySelector(config.listSelector);
      elements.wrap = elements.container.querySelector(config.wrapSelector);
      
      if(!elements.list) return that;
      
      initialized = true;
      
      // 홈 탭 추가
      if(config.homeTab){
        that.add({
          id: 'home',
          path: config.homePath,
          title: '',
          icon: config.homeIcon,
          closeable: false,
          isHome: true
        });
        that.active('home');
      }
      
      // 이벤트 바인딩
      that._bindEvents();
      
      // resize 이벤트
      var resizeTimer;
      window.addEventListener('resize', function(){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function(){
          that.scrollToActive();
        }, 100);
      });
      
      // 컨테이너 표시
      elements.container.style.display = 'block';
      
      return that;
    }

    // 탭 추가
    ,add: function(options){
      var that = this;
      var config = that.config;
      
      if(!elements.list) return that;
      
      var id = options.id || options.path;
      
      // 이미 존재하면 활성화만
      if(tabs[id]){
        that.active(id);
        return that;
      }
      
      // 최대 탭 수 체크
      if(tabsOrder.length >= config.maxTabs){
        console.warn('[PageTabs] 최대 탭 수에 도달했습니다.');
        return that;
      }
      
      // 탭 데이터 저장
      tabs[id] = {
        id: id,
        path: options.path || '',
        title: options.title || '',
        icon: options.icon || '',
        closeable: options.closeable !== false && config.closeable,
        isHome: options.isHome || false
      };
      tabsOrder.push(id);
      
      // 탭 요소 생성
      var li = document.createElement('li');
      li.setAttribute('data-id', id);
      li.className = 'cui-pagetabs-item';
      if(options.isHome) li.classList.add('cui-pagetabs-home');
      
      var html = '';
      if(options.icon){
        html += '<i class="cui-icon">' + options.icon + '</i>';
      }
      if(options.title){
        html += '<span>' + options.title + '</span>';
      }
      if(tabs[id].closeable){
        html += '<i class="cui-icon cui-pagetabs-close">close</i>';
      }
      
      li.innerHTML = html;
      elements.list.appendChild(li);
      
      // 콜백
      if(typeof config.onAdd === 'function'){
        config.onAdd(tabs[id]);
      }
      
      return that;
    }

    // 탭 활성화
    ,active: function(id){
      var that = this;
      var config = that.config;
      
      if(!tabs[id] || !elements.list) return that;
      
      // 이전 활성 탭 비활성화
      var prevActive = elements.list.querySelector('.cui-pagetabs-active');
      if(prevActive) prevActive.classList.remove('cui-pagetabs-active');
      
      // 새 탭 활성화
      var newActive = elements.list.querySelector('[data-id="' + id + '"]');
      if(newActive) newActive.classList.add('cui-pagetabs-active');
      
      activeTab = id;
      
      // 활성 탭이 보이도록 스크롤
      that.scrollToActive();
      
      // 콜백
      if(typeof config.onChange === 'function'){
        config.onChange(tabs[id]);
      }
      
      return that;
    }

    // 탭 삭제
    ,remove: function(id){
      var that = this;
      var config = that.config;
      
      if(!tabs[id] || !tabs[id].closeable) return that;
      
      // DOM에서 삭제
      var item = elements.list.querySelector('[data-id="' + id + '"]');
      if(item) item.remove();
      
      // 데이터에서 삭제
      var index = tabsOrder.indexOf(id);
      if(index > -1) tabsOrder.splice(index, 1);
      
      var removedTab = tabs[id];
      delete tabs[id];
      
      // 활성 탭이 삭제되면 이전 탭 활성화 및 라우터 이동
      if(activeTab === id){
        var newIndex = Math.min(index, tabsOrder.length - 1);
        if(newIndex >= 0){
          var newTabId = tabsOrder[newIndex];
          that.active(newTabId);
          // 라우터 연동
          if(window.router && tabs[newTabId] && tabs[newTabId].path){
            window.router.clearCache(tabs[newTabId].path);
            window.router.go(tabs[newTabId].path);
          }
        }
      }
      
      // 콜백
      if(typeof config.onRemove === 'function'){
        config.onRemove(removedTab);
      }
      
      return that;
    }

    // 현재 탭 삭제
    ,removeThis: function(){
      var that = this;
      if(activeTab) that.remove(activeTab);
      return that;
    }

    // 다른 탭 모두 삭제
    ,removeOther: function(){
      var that = this;
      var toRemove = tabsOrder.filter(function(id){
        return id !== activeTab && tabs[id] && tabs[id].closeable;
      });
      toRemove.forEach(function(id){
        that.remove(id);
      });
      return that;
    }

    // 모든 탭 삭제 (홈 제외)
    ,removeAll: function(){
      var that = this;
      var toRemove = tabsOrder.filter(function(id){
        return tabs[id] && tabs[id].closeable;
      });
      toRemove.forEach(function(id){
        that.remove(id);
      });
      // 홈 탭 활성화
      if(tabs['home']){
        that.active('home');
      }
      return that;
    }

    // 활성 탭으로 스크롤
    ,scrollToActive: function(){
      var that = this;
      if(!elements.list || !elements.wrap) return that;
      
      var activeItem = elements.list.querySelector('.cui-pagetabs-active');
      if(!activeItem) return that;
      
      var wrapWidth = elements.wrap.clientWidth;
      var listWidth = elements.list.scrollWidth;
      var currentLeft = parseFloat(elements.list.style.left) || 0;
      
      var itemLeft = activeItem.offsetLeft;
      var itemWidth = activeItem.offsetWidth;
      
      // 왼쪽으로 벗어난 경우
      if(itemLeft < -currentLeft){
        elements.list.style.left = -itemLeft + 'px';
      }
      // 오른쪽으로 벗어난 경우
      else if(itemLeft + itemWidth > wrapWidth - currentLeft){
        var newLeft = -(itemLeft + itemWidth - wrapWidth);
        elements.list.style.left = newLeft + 'px';
      }
      
      return that;
    }

    // 스크롤 (방향)
    ,scroll: function(direction){
      var that = this;
      if(!elements.list || !elements.wrap) return that;
      
      var wrapWidth = elements.wrap.clientWidth;
      var listWidth = elements.list.scrollWidth;
      var currentLeft = parseFloat(elements.list.style.left) || 0;
      
      if(direction === 'left' || direction === -1){
        // 왼쪽으로 스크롤
        if(currentLeft >= 0) return that;
        var newLeft = currentLeft + wrapWidth;
        if(newLeft > 0) newLeft = 0;
        elements.list.style.left = newLeft + 'px';
      } else {
        // 오른쪽으로 스크롤
        var maxScroll = -(listWidth - wrapWidth);
        if(maxScroll >= 0 || currentLeft <= maxScroll) return that;
        var newLeft = currentLeft - wrapWidth;
        if(newLeft < maxScroll) newLeft = maxScroll;
        elements.list.style.left = newLeft + 'px';
      }
      
      return that;
    }

    // 탭 존재 여부
    ,has: function(id){
      return !!tabs[id];
    }

    // 현재 활성 탭 ID
    ,getActive: function(){
      return activeTab;
    }

    // 탭 데이터 가져오기
    ,get: function(id){
      return tabs[id] || null;
    }

    // 모든 탭 ID 목록
    ,getAll: function(){
      return tabsOrder.slice();
    }

    // 이벤트 바인딩
    ,_bindEvents: function(){
      var that = this;
      var config = that.config;
      
      if(!elements.container) return;
      
      // 탭 클릭 이벤트
      elements.container.addEventListener('click', function(e){
        var target = e.target;
        
        // 닫기 버튼
        if(target.classList.contains('cui-pagetabs-close')){
          e.stopPropagation();
          var item = target.closest('.cui-pagetabs-item');
          if(item){
            var id = item.getAttribute('data-id');
            that.remove(id);
          }
          return;
        }
        
        // 탭 클릭
        var item = target.closest('.cui-pagetabs-item');
        if(item){
          var id = item.getAttribute('data-id');
          if(id && tabs[id]){
            that.active(id);
            // 라우터 연동 - 캐시 삭제 후 리로드
            if(window.router && tabs[id].path){
              window.router.clearCache(tabs[id].path);
              window.router.go(tabs[id].path);
            }
          }
          return;
        }
        
        // 스크롤 버튼
        if(target.closest('.cui-pagetabs-prev')){
          that.scroll('left');
          return;
        }
        if(target.closest('.cui-pagetabs-next')){
          that.scroll('right');
          return;
        }
        
        // 드롭다운 메뉴
        if(target.closest('[data-action="closeThis"]')){
          that.removeThis();
          return;
        }
        if(target.closest('[data-action="closeOther"]')){
          that.removeOther();
          return;
        }
        if(target.closest('[data-action="closeAll"]')){
          that.removeAll();
          return;
        }
      });
    }
  };

  // 전역 등록
  window.pagetabs = pagetabs;
  
  // CatUI 모듈로 등록
  if(typeof window.Catui !== 'undefined'){
    window.Catui[MOD_NAME] = pagetabs;
  }

}(window);
