/*!
 * Catui dropdown - 드롭다운 메뉴 컴포넌트
 * Based on dropdown.js, jQuery-free
 * MIT Licensed
 */

;!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'dropdown'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 인덱스
  ,index = 0
  
  // 인스턴스 저장
  ,instances = {}

  // 상수
  ,STR_ELEM = 'cui-dropdown'
  ,STR_HIDE = 'cui-hide'
  ,STR_DISABLED = 'cui-disabled'
  ,STR_MENU_ITEM = 'cui-dropdown-item'
  ,STR_MENU_DIVIDER = 'cui-dropdown-divider'
  ,STR_MENU_TITLE = 'cui-dropdown-title'
  ,STR_MENU_CHILD = 'cui-dropdown-child'
  ,STR_ITEM_ACTIVE = 'cui-dropdown-item-active'

  // 외부 인터페이스
  ,dropdown = {
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
      return inst;
    }

    // 인스턴스 가져오기
    ,getInst: function(id){
      return instances[id];
    }

    // 모두 닫기
    ,close: function(id){
      if(id){
        var inst = instances[id];
        if(inst) inst.remove();
      } else {
        for(var key in instances){
          if(instances[key] && instances[key].remove){
            instances[key].remove();
          }
        }
      }
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
    that.config = $c.extend({}, that.defaults, dropdown.config, options);
    that.config.id = that.config.id || that.index;
    
    instances[that.config.id] = that;
    that.init();
  };

  // 기본 설정
  Class.prototype.defaults = {
    elem: null              // 트리거 요소
    ,trigger: 'click'       // 트리거 이벤트: click, hover, contextmenu
    ,data: []               // 메뉴 데이터
    ,content: ''            // 커스텀 내용
    ,className: ''          // 추가 클래스
    ,style: ''              // 추가 스타일
    ,show: false            // 초기 표시
    ,align: 'left'          // 정렬: left, center, right
    ,isAllowSpread: true    // 그룹 펼침 허용
    ,isSpreadItem: true     // 초기 펼침 상태
    ,delay: 300             // hover 시 딜레이
    ,shade: false           // 배경 표시
    ,shadeClose: true       // 배경 클릭 닫기
    ,click: null            // 클릭 콜백
    ,ready: null            // 준비 콜백
  };

  // 초기화
  Class.prototype.init = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,elem = $c(config.elem);

    if(!elem[0]) return;
    
    that.elem = elem;
    
    // 이미 초기화되었으면 리로드
    if(elem[0].getAttribute('cui-dropdown-id')){
      var existId = elem[0].getAttribute('cui-dropdown-id');
      if(instances[existId]){
        instances[existId].reload(config);
        return;
      }
    }
    
    elem[0].setAttribute('cui-dropdown-id', config.id);
    
    // 초기 표시
    if(config.show){
      that.render();
    }
    
    // 이벤트 바인딩
    that.bindEvents();
  };

  // 리로드
  Class.prototype.reload = function(options){
    var that = this
    ,$c = get$c();
    
    that.config = $c.extend({}, that.config, options);
    that.remove();
    that.init();
  };

  // 렌더링
  Class.prototype.render = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,elem = that.elem;

    // 이미 열려있으면 닫기
    if(that.dropdown){
      that.remove();
      return;
    }

    // 다른 드롭다운 닫기
    dropdown.close();

    // 드롭다운 컨테이너 생성
    var container = document.createElement('div');
    container.className = STR_ELEM + ' ' + (config.className || '');
    container.id = 'cui-dropdown-' + that.index;
    if(config.style){
      container.style.cssText = config.style;
    }

    // 내용 생성
    if(config.content){
      container.innerHTML = config.content;
    } else if(config.data && config.data.length > 0){
      container.innerHTML = that.buildMenu(config.data);
    } else {
      container.innerHTML = '<div class="cui-dropdown-empty">메뉴 없음</div>';
    }

    document.body.appendChild(container);
    that.dropdown = $c(container);

    // 위치 설정
    that.position();

    // 메뉴 이벤트
    that.bindMenuEvents();

    // 준비 콜백
    if(typeof config.ready === 'function'){
      config.ready(that.dropdown, that);
    }
  };

  // 메뉴 HTML 생성
  Class.prototype.buildMenu = function(data){
    var that = this
    ,config = that.config
    ,html = '<ul class="cui-dropdown-menu">';

    data.forEach(function(item, index){
      // 구분선
      if(item.type === '-' || item.type === 'divider'){
        html += '<li class="' + STR_MENU_DIVIDER + '"></li>';
        return;
      }

      // 비활성화
      var disabled = item.disabled ? ' ' + STR_DISABLED : '';
      
      // 자식 메뉴 여부 (children 또는 child 둘 다 지원)
      var childData = item.children || item.child;
      var hasChild = childData && childData.length > 0;
      var itemClass = STR_MENU_ITEM + disabled;
      
      if(hasChild){
        itemClass += ' cui-dropdown-item-parent';
      }

      html += '<li class="' + itemClass + '"';
      
      // 데이터 속성
      if(item.id !== undefined){
        html += ' data-id="' + item.id + '"';
      }
      if(item.value !== undefined){
        html += ' data-value="' + item.value + '"';
      }
      
      html += '>';

      // 아이콘
      var iconHtml = item.icon ? '<i class="cui-icon">' + item.icon + '</i>' : '';
      
      // 링크 또는 텍스트
      if(item.href){
        html += '<a href="' + item.href + '" target="' + (item.target || '_self') + '">'
          + iconHtml + '<span>' + (item.title || '') + '</span></a>';
      } else {
        html += '<div class="' + STR_MENU_TITLE + '">'
          + iconHtml + '<span>' + (item.title || '') + '</span>';
        
        // 자식 화살표
        if(hasChild){
          html += '<i class="cui-icon cui-dropdown-arrow">chevron_right</i>';
        }
        
        html += '</div>';
      }

      // 자식 메뉴
      if(hasChild){
        html += '<div class="' + STR_MENU_CHILD + '">';
        html += that.buildMenu(childData).replace('<ul class="cui-dropdown-menu">', '<ul class="cui-dropdown-menu cui-dropdown-submenu">');
        html += '</div>';
      }

      html += '</li>';
    });

    html += '</ul>';
    return html;
  };

  // 위치 설정
  Class.prototype.position = function(){
    var that = this
    ,config = that.config
    ,elem = that.elem[0]
    ,dd = that.dropdown[0];

    if(!elem || !dd) return;

    var rect = elem.getBoundingClientRect();
    var ddRect = dd.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    var top = rect.bottom + scrollTop;
    var left = rect.left + scrollLeft;

    // 정렬
    if(config.align === 'center'){
      left = left + (rect.width - ddRect.width) / 2;
    } else if(config.align === 'right'){
      left = left + rect.width - ddRect.width;
    }

    // 화면 밖으로 나가지 않도록
    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;

    if(left + ddRect.width > winWidth){
      left = winWidth - ddRect.width - 10;
    }
    if(left < 0) left = 10;

    // 아래 공간이 부족하면 위로
    if(rect.bottom + ddRect.height > winHeight && rect.top > ddRect.height){
      top = rect.top + scrollTop - ddRect.height;
    }

    dd.style.top = top + 'px';
    dd.style.left = left + 'px';
  };

  // 이벤트 바인딩
  Class.prototype.bindEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,elem = that.elem;

    var delayTimer = null;

    if(config.trigger === 'hover'){
      elem.off('mouseenter mouseleave').on('mouseenter', function(){
        clearTimeout(delayTimer);
        that.render();
      }).on('mouseleave', function(){
        delayTimer = setTimeout(function(){
          that.remove();
        }, config.delay);
      });
    } else if(config.trigger === 'contextmenu'){
      elem.off('contextmenu').on('contextmenu', function(e){
        e.preventDefault();
        that.contextPos = { x: e.pageX, y: e.pageY };
        that.render();
        that.positionContext();
      });
    } else {
      // click - 이미 바인딩되었는지 확인
      if(!elem[0]._dropdownClickBound){
        elem[0]._dropdownClickBound = true;
        elem[0].addEventListener('click', function(e){
          e.stopPropagation();
          that.render();
        });
      }
    }

    // 외부 클릭 시 닫기 (전역 이벤트 한 번만 등록)
    if(!window._dropdownDocClickBound){
      window._dropdownDocClickBound = true;
      document.addEventListener('click', function(e){
        // 모든 드롭다운 인스턴스 확인
        for(var key in instances){
          var inst = instances[key];
          if(inst && inst.dropdown && inst.elem){
            if(!inst.dropdown[0].contains(e.target) && !inst.elem[0].contains(e.target)){
              inst.remove();
            }
          }
        }
      });
    }
  };

  // 컨텍스트 메뉴 위치
  Class.prototype.positionContext = function(){
    var that = this;
    if(!that.dropdown || !that.contextPos) return;

    var dd = that.dropdown[0];
    dd.style.top = that.contextPos.y + 'px';
    dd.style.left = that.contextPos.x + 'px';

    // 화면 밖으로 나가지 않도록
    var rect = dd.getBoundingClientRect();
    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;

    if(rect.right > winWidth){
      dd.style.left = (that.contextPos.x - rect.width) + 'px';
    }
    if(rect.bottom > winHeight){
      dd.style.top = (that.contextPos.y - rect.height) + 'px';
    }
  };

  // 메뉴 이벤트
  Class.prototype.bindMenuEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    if(!that.dropdown) return;

    // 메뉴 아이템 클릭
    that.dropdown.find('.' + STR_MENU_ITEM).each(function(i, item){
      var $item = $c(item);
      
      // 자식 메뉴가 있으면 hover로 표시
      if($item.hasClass('cui-dropdown-item-parent')){
        $item.on('mouseenter', function(){
          $item.find('.' + STR_MENU_CHILD).addClass('cui-show');
        }).on('mouseleave', function(){
          $item.find('.' + STR_MENU_CHILD).removeClass('cui-show');
        });
      }

      // 클릭 이벤트
      $item.on('click', function(e){
        if($item.hasClass(STR_DISABLED)) return;
        if($item.hasClass('cui-dropdown-item-parent')) return;
        
        var data = {
          id: item.getAttribute('data-id')
          ,value: item.getAttribute('data-value')
          ,title: $item.find('span').text()
          ,elem: item
        };

        // 콜백
        if(typeof config.click === 'function'){
          if(config.click(data) === false) return;
        }

        // 이벤트 트리거
        if(window.Catui && Catui.event){
          Catui.event(MOD_NAME, 'click(' + config.id + ')', data);
        }

        that.remove();
      });
    });

    // hover 시 드롭다운 유지
    if(config.trigger === 'hover'){
      var delayTimer = null;
      that.dropdown.on('mouseenter', function(){
        clearTimeout(delayTimer);
      }).on('mouseleave', function(){
        delayTimer = setTimeout(function(){
          that.remove();
        }, config.delay);
      });
    }
  };

  // 제거
  Class.prototype.remove = function(){
    var that = this
    ,$c = get$c();

    if(that.dropdown){
      that.dropdown.remove();
      that.dropdown = null;
    }
  };

  // ========================================
  // 수직 메뉴 (cui-menu) 초기화
  // ========================================
  
  dropdown.initMenu = function(filter){
    var $c = get$c();
    if(!$c){
      console.warn('dropdown.initMenu: $c not loaded');
      return;
    }
    
    var selector = '.cui-menu' + (filter ? '[cui-filter="' + filter + '"]' : '');
    var menus = $c(selector);

    menus.each(function(i, menu){
      // 강제 재초기화 옵션 (filter가 있으면 재초기화)
      if(!filter && menu.getAttribute('cui-menu-rendered')) return;
      menu.setAttribute('cui-menu-rendered', 'true');
      
      var trigger = menu.getAttribute('cui-trigger') || 'click';
      var accordion = menu.getAttribute('cui-accordion') !== null;
      var menuFilter = menu.getAttribute('cui-filter') || '';

      // 메뉴 아이템 초기화 함수
      var initItem = function(item){
        var $item = $c(item);
        var subMenu = $item.children('.cui-menu-sub');
        var aElem = $item.children('a');

        if(!aElem[0]) return;

        // 서브메뉴가 있으면 화살표 추가
        if(subMenu[0] && !aElem.find('.cui-menu-arrow')[0]){
          aElem.append('<i class="cui-icon cui-menu-arrow">expand_more</i>');
        }

        if(subMenu[0]){
          if(trigger === 'hover'){
            // 호버 모드
            $item.off('mouseenter.menu mouseleave.menu')
              .on('mouseenter.menu', function(){
                if(accordion){
                  $item.siblings('.cui-menu-item').removeClass('cui-menu-open');
                }
                $item.addClass('cui-menu-open');
              })
              .on('mouseleave.menu', function(){
                $item.removeClass('cui-menu-open');
              });
          } else {
            // 클릭 모드 - 직접 이벤트 바인딩
            var aNode = aElem[0];
            aNode.removeEventListener('click', aNode._menuClickHandler);
            aNode._menuClickHandler = function(e){
              e.preventDefault();
              e.stopPropagation();
              var isOpen = $item.hasClass('cui-menu-open');
              
              if(accordion){
                $item.siblings('.cui-menu-item').removeClass('cui-menu-open');
              }
              
              $item.toggleClass('cui-menu-open', !isOpen);
            };
            aNode.addEventListener('click', aNode._menuClickHandler);
          }
          
          // 하위 메뉴 초기화
          subMenu.children('.cui-menu-item').each(function(k, subItem){
            initItem(subItem);
          });
        } else {
          // 서브메뉴 없는 링크 - 직접 이벤트 바인딩
          var aNode = aElem[0];
          aNode.removeEventListener('click', aNode._menuClickHandler);
          aNode._menuClickHandler = function(e){
            $c(menu).find('.cui-menu-item').removeClass('cui-menu-active');
            $item.addClass('cui-menu-active');

            var eventData = {
              elem: item,
              a: aNode,
              title: aElem.text().trim()
            };

            // 이벤트 트리거
            if(window.Catui && Catui.event){
              Catui.event(MOD_NAME, 'menu(' + menuFilter + ')', eventData);
            }
          };
          aNode.addEventListener('click', aNode._menuClickHandler);
        }
      };

      // 최상위 메뉴 아이템 초기화
      $c(menu).children('.cui-menu-item').each(function(j, item){
        initItem(item);
      });
    });
  };

  // 전역 노출
  window.dropdown = dropdown;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = dropdown;
  }

}(window);
