/*!
 * Catui element - 요소 컴포넌트 (탭, 네비게이션, 프로그레스)
 * Based on element.js, jQuery-free
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'element'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 상수
  ,THIS = 'cui-this'
  ,SHOW = 'cui-show'
  ,_HIDE = 'cui-hide'

  // Element 생성자
  ,Element = function(){
    this.config = {};
  };

  // 전역 설정
  Element.prototype.set = function(options){
    var that = this;
    get$c().extend(true, that.config, options);
    return that;
  };

  // 이벤트 등록
  Element.prototype.on = function(events, callback){
    if(window.Catui && Catui.onevent){
      return Catui.onevent.call(this, MOD_NAME, events, callback);
    }
    return this;
  };

  // 탭 추가
  Element.prototype.tabAdd = function(filter, options){
    var tabElem = get$c()('.cui-tab[cui-filter="' + filter + '"]');
    var titElem = tabElem.find('.cui-tab-title');
    var contElem = tabElem.find('.cui-tab-content');

    // 탭 헤더 추가
    var attrs = '';
    for(var key in options){
      if(/^(title|content)$/.test(key)) continue;
      attrs += ' cui-' + key + '="' + options[key] + '"';
    }
    
    var li = '<li' + attrs + '>' + (options.title || '새 탭') + '</li>';
    titElem.append(li);
    
    // 탭 콘텐츠 추가
    contElem.append('<div class="cui-tab-item">' + (options.content || '') + '</div>');

    return this;
  };

  // 탭 삭제
  Element.prototype.tabDelete = function(filter, layid){
    var tabElem = get$c()('.cui-tab[cui-filter="' + filter + '"]');
    var titElem = tabElem.find('.cui-tab-title');
    var contElem = tabElem.find('.cui-tab-content');
    var liElem = titElem.find('li[cui-id="' + layid + '"]');
    
    // 요소가 없으면 종료
    if(!liElem[0] || !titElem[0]) return this;
    
    var index = Array.prototype.indexOf.call(titElem[0].children, liElem[0]);

    // 선택된 탭이면 이전/다음 탭 선택
    if(liElem.hasClass(THIS)){
      var nextLi = liElem.next()[0] || liElem.prev()[0];
      if(nextLi){
        get$c()(nextLi).addClass(THIS);
        var nextIndex = Array.prototype.indexOf.call(titElem[0].children, nextLi);
        contElem.find('.cui-tab-item').eq(nextIndex).addClass(SHOW);
      }
    }

    liElem.remove();
    contElem.find('.cui-tab-item').eq(index).remove();

    return this;
  };

  // 탭 변경
  Element.prototype.tabChange = function(filter, layid){
    var tabElem = get$c()('.cui-tab[cui-filter="' + filter + '"]');
    var titElem = tabElem.find('.cui-tab-title');
    var liElem = titElem.find('li[cui-id="' + layid + '"]');

    if(liElem[0]){
      liElem[0].click();
    }

    return this;
  };

  // 커스텀 탭
  Element.prototype.tab = function(options){
    options = options || {};
    get$c()(document).on('click', options.headerElem, function(e){
      var index = Array.prototype.indexOf.call(this.parentNode.children, this);
      
      // 헤더 활성화
      get$c()(this).addClass(THIS).siblings().removeClass(THIS);
      
      // 콘텐츠 활성화
      var bodyElems = get$c()(options.bodyElem);
      bodyElems.removeClass(SHOW);
      bodyElems.eq(index).addClass(SHOW);
    });
  };

  // 프로그레스 바
  Element.prototype.progress = function(filter, percent){
    var elem = get$c()('.cui-progress[cui-filter="' + filter + '"]');
    var bar = elem.find('.cui-progress-bar');
    var text = bar.find('.cui-progress-text');

    bar.css('width', percent);
    bar.attr('cui-percent', percent);
    text.html(percent);

    return this;
  };

  // 초기화
  Element.prototype.init = function(filter){
    var that = this
    ,$c = get$c();
    
    // $c가 없으면 대기 후 재시도
    if(!$c){
      setTimeout(function(){ that.init(filter); }, 50);
      return;
    }

    // 탭 이벤트
    that.initTab(filter);

    // 네비게이션 이벤트
    that.initNav(filter);

    // 콜랩스 이벤트
    that.initCollapse(filter);

    // 브레드크럼 이벤트
    that.initBreadcrumb(filter);
  };

  // 탭 초기화
  Element.prototype.initTab = function(filter){
    var that = this;
    var selector = '.cui-tab' + (filter ? '[cui-filter="' + filter + '"]' : '');

    get$c()(selector).each(function(i, tab){
      var titElem = get$c()(tab).find('.cui-tab-title');
      var contElem = get$c()(tab).find('.cui-tab-content');
      var allowClose = tab.getAttribute('cui-allowClose') !== null;

      titElem.find('li').each(function(j, li){
        // 닫기 버튼 추가
        if(allowClose && !get$c()(li).find('.cui-tab-close')[0]){
          var closeBtn = document.createElement('i');
          closeBtn.className = 'cui-icon cui-tab-close';
          closeBtn.textContent = 'close';
          li.appendChild(closeBtn);
          
          closeBtn.addEventListener('click', function(e){
            e.stopPropagation();
            that.tabDelete(tab.getAttribute('cui-filter'), li.getAttribute('cui-id'));
          });
        }

        get$c()(li).off('click').on('click', function(e){
          if(e.target.classList.contains('cui-tab-close')) return;
          
          // 헤더 활성화
          get$c()(this).addClass(THIS).siblings().removeClass(THIS);

          // 콘텐츠 활성화
          var idx = Array.prototype.indexOf.call(titElem[0].querySelectorAll('li'), this);
          contElem.find('.cui-tab-item').removeClass(SHOW).eq(idx).addClass(SHOW);

          // 이벤트 트리거
          var layid = li.getAttribute('cui-id') || '';
          if(window.Catui && Catui.event){
            Catui.event(MOD_NAME, 'tab(' + (tab.getAttribute('cui-filter') || '') + ')', {
              elem: tab
              ,index: idx
              ,id: layid
            });
          }
        });
      });

      // 탭 자동조절 (오버플로우)
      that.tabAuto(tab);

      // 기본 탭 활성화
      if(!titElem.find('li.' + THIS)[0]){
        titElem.find('li').eq(0).addClass(THIS);
        contElem.find('.cui-tab-item').eq(0).addClass(SHOW);
      }
    });
  };

  // 탭 오버플로우 자동조절
  Element.prototype.tabAuto = function(tab){
    if(!tab) return;
    var titElem = tab.querySelector('.cui-tab-title');
    if(!titElem) return;

    var barElem = titElem.querySelector('.cui-tab-bar');

    // 오버플로우 체크
    if(titElem.scrollWidth > titElem.offsetWidth + 1){
      if(!barElem){
        tab.setAttribute('overflow', '');
        var bar = document.createElement('span');
        bar.className = 'cui-unselect cui-tab-bar';
        bar.innerHTML = '<i class="cui-icon">more_horiz</i>';
        titElem.appendChild(bar);

        bar.addEventListener('click', function(){
          titElem.classList.toggle('cui-tab-more');
        });
      }
    } else {
      tab.removeAttribute('overflow');
      if(barElem) barElem.remove();
    }
  };

  // 네비게이션 초기화
  Element.prototype.initNav = function(filter){
    var selector = '.cui-nav' + (filter ? '[cui-filter="' + filter + '"]' : '');

    get$c()(selector).each(function(i, nav){
      var isTree = get$c()(nav).hasClass('cui-nav-tree');
      var shrinkAll = nav.getAttribute('cui-shrink') === 'all';
      var trigger = nav.getAttribute('cui-trigger') || 'click'; // 'click' 또는 'hover'

      // 슬라이더 바 추가
      if(!nav.querySelector('.cui-nav-bar')){
        var bar = document.createElement('span');
        bar.className = 'cui-nav-bar';
        nav.appendChild(bar);
      }

      // 토글 함수
      var toggleItem = function(item, isOpen){
        if(shrinkAll){
          get$c()(nav).find('.cui-nav-item').removeClass('cui-nav-itemed');
        }
        get$c()(item).toggleClass('cui-nav-itemed', !isOpen);
      };

      var toggleSubItem = function(dd, isOpen){
        get$c()(dd).siblings('dd').removeClass('cui-nav-itemed');
        get$c()(dd).toggleClass('cui-nav-itemed', !isOpen);
      };

      // 이벤트
      get$c()(nav).find('.cui-nav-item').each(function(j, item){
        var child = get$c()(item).find('.cui-nav-child');
        var aElem = get$c()(item).children('a');

        // 서브메뉴 화살표 추가
        if(child[0] && !aElem.find('.cui-nav-more')[0]){
          aElem.append('<i class="cui-icon cui-nav-more">expand_more</i>');
        }

        // hover 슬라이더 효과 (가로 네비게이션)
        if(!isTree){
          get$c()(item).off('mouseenter mouseleave').on('mouseenter', function(){
            var bar = nav.querySelector('.cui-nav-bar');
            if(bar && !child[0]){
              bar.style.left = item.offsetLeft + 'px';
              bar.style.width = item.offsetWidth + 'px';
              bar.style.opacity = '1';
            }
          }).on('mouseleave', function(){
            var bar = nav.querySelector('.cui-nav-bar');
            if(bar){
              bar.style.opacity = '0';
            }
          });
        }

        if(child[0]){
          // 서브메뉴가 있는 경우
          if(trigger === 'hover' && isTree){
            // 호버 모드
            get$c()(item).off('mouseenter mouseleave').on('mouseenter', function(){
              toggleItem(item, false);
            }).on('mouseleave', function(){
              get$c()(item).removeClass('cui-nav-itemed');
            });
          } else {
            // 클릭 모드
            aElem.off('click').on('click', function(e){
              if(isTree){
                e.preventDefault();
                var isOpen = get$c()(item).hasClass('cui-nav-itemed');
                toggleItem(item, isOpen);
              }
            });
          }

          // 3단 메뉴 (dd 안의 서브메뉴) 토글
          child.find('dd').each(function(k, dd){
            var subChild = get$c()(dd).children('.cui-nav-child');
            var subAElem = get$c()(dd).children('a');

            // 3단 서브메뉴 화살표 추가
            if(subChild[0] && !subAElem.find('.cui-nav-more')[0]){
              subAElem.append('<i class="cui-icon cui-nav-more">expand_more</i>');
            }

            if(subChild[0]){
              if(trigger === 'hover'){
                // 호버 모드
                get$c()(dd).off('mouseenter mouseleave').on('mouseenter', function(){
                  toggleSubItem(dd, false);
                }).on('mouseleave', function(){
                  get$c()(dd).removeClass('cui-nav-itemed');
                });
              } else {
                // 클릭 모드
                subAElem.off('click').on('click', function(e){
                  e.preventDefault();
                  e.stopPropagation();
                  var isSubOpen = get$c()(dd).hasClass('cui-nav-itemed');
                  toggleSubItem(dd, isSubOpen);
                });
              }
            }
          });
        } else {
          // 링크 클릭
          aElem.off('click').on('click', function(){
            get$c()(nav).find('.cui-nav-item').removeClass(THIS);
            get$c()(item).addClass(THIS);

            // 이벤트 트리거
            if(window.Catui && Catui.event){
              Catui.event(MOD_NAME, 'nav(' + (nav.getAttribute('cui-filter') || '') + ')', {
                elem: this
              });
            }
          });
        }
      });
    });
  };

  // 브레드크럼 초기화
  Element.prototype.initBreadcrumb = function(filter){
    var selector = '.cui-breadcrumb' + (filter ? '[cui-filter="' + filter + '"]' : '');

    get$c()(selector).each(function(i, elem){
      // 이미 렌더링됨
      if(elem.getAttribute('cui-rendered')) {
        elem.style.visibility = 'visible';
        return;
      }
      elem.setAttribute('cui-rendered', 'true');
      
      var separator = elem.getAttribute('cui-separator') || '/';
      var aNodes = elem.querySelectorAll('a');
      
      if(!aNodes || aNodes.length === 0) {
        elem.style.visibility = 'visible';
        return;
      }

      // a 태그 뒤에 구분자 추가
      aNodes.forEach(function(a){
        var span = document.createElement('span');
        span.setAttribute('cui-separator', '');
        span.textContent = separator;
        a.after(span);
      });

      elem.style.visibility = 'visible';
    });
  };

  // 콜랩스 초기화 (이벤트 위임 방식)
  Element.prototype.initCollapse = function(filter){
    var $c = get$c();
    
    // 이벤트 위임: document에 한 번만 바인딩
    if(!Element.collapseEventBound){
      Element.collapseEventBound = true;
      
      $c(document).on('click', '.cui-collapse-title', function(e){
        var title = $c(this);
        var item = title.closest('.cui-collapse-item');
        var collapse = title.closest('.cui-collapse');
        
        if(!item[0] || !collapse[0]) return;
        
        var isOpen = item.hasClass('cui-collapse-opened');
        
        // 아코디언 모드
        if(collapse[0].getAttribute('cui-accordion') !== null){
          collapse.find('.cui-collapse-item').removeClass('cui-collapse-opened');
        }
        
        item.toggleClass('cui-collapse-opened', !isOpen);
        
        // 이벤트 트리거
        if(window.Catui && Catui.event){
          Catui.event(MOD_NAME, 'collapse(' + (collapse[0].getAttribute('cui-filter') || '') + ')', {
            elem: item[0]
            ,show: !isOpen
          });
        }
      });
    }
  };

  // 렌더링
  Element.prototype.render = function(type, filter){
    var that = this;
    that.init(filter);
    return that;
  };

  // 인스턴스 생성
  var element = new Element();

  // 초기 렌더링 (DOM Ready 후)
  var initOnReady = function(){
    var $c = get$c();
    if($c){
      $c(function(){
        element.init();
      });
    } else {
      // $c가 아직 없으면 DOM Ready 이벤트 사용
      if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', function(){
          element.init();
        });
      } else {
        element.init();
      }
    }
  };
  initOnReady();

  // 전역 노출
  window.element = element;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = element;
  }

}(window);
