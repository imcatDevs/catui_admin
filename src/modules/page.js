/*!
 * Catui page - Pagination Component
 * Based on laypage, jQuery-free
 * MIT Licensed
 */

;!function(window, undefined){
  "use strict";

  var doc = document
  ,MOD_NAME = 'page'
  ,DISABLED = 'cui-disabled'

  // 인스턴스 저장소
  ,instances = {}

  // 생성자
  ,Class = function(options){
    var that = this;
    that.config = options || {};
    that.config.index = ++page.index;
    
    // 인스턴스 저장
    instances[that.config.index] = that;
    if(that.config.id){
      instances[that.config.id] = that;
    }
    
    that.render(true);
  };

  // 컨테이너 타입 판단
  Class.prototype.type = function(){
    var config = this.config;
    if(typeof config.elem === 'object'){
      return config.elem.length === undefined ? 2 : 3;
    }
  };

  // 페이지네이션 뷰
  Class.prototype.view = function(){
    var that = this
    ,config = that.config
    ,groups = config.groups = 'groups' in config ? (config.groups | 0) : 5;

    // 레이아웃
    config.layout = typeof config.layout === 'object'
      ? config.layout
      : ['prev', 'page', 'next'];

    config.count = config.count | 0;
    config.curr = (config.curr | 0) || 1;

    // 페이지당 건수 선택 옵션
    config.limits = typeof config.limits === 'object'
      ? config.limits
      : [10, 20, 30, 40, 50];
    config.limit = (config.limit | 0) || 10;

    // 총 페이지 수
    config.pages = Math.ceil(config.count / config.limit) || 1;

    // 현재 페이지는 총 페이지 수를 초과할 수 없음
    if(config.curr > config.pages){
      config.curr = config.pages;
    }

    // 연속 페이지 개수는 0 미만이거나 총 페이지 수를 초과할 수 없음
    if(groups < 0){
      groups = 1;
    } else if(groups > config.pages){
      groups = config.pages;
    }

    // 아이콘 모드 (기본 true)
    var useIcon = config.icon !== false;
    
    // 이전/다음 텍스트 또는 아이콘
    config.prev = 'prev' in config ? config.prev : (useIcon ? '<i class="cui-icon">chevron_left</i>' : '이전');
    config.next = 'next' in config ? config.next : (useIcon ? '<i class="cui-icon">chevron_right</i>' : '다음');
    
    // 사이즈 (sm, md, lg)
    config.size = config.size || 'md';

    // 현재 그룹 계산
    var index = config.pages > groups
      ? Math.ceil((config.curr + (groups > 1 ? 1 : 0)) / (groups > 0 ? groups : 1))
      : 1

    // 뷰 조각
    ,views = {
      // 첫 페이지 버튼
      first: function(){
        if(config.first === false) return '';
        var icon = useIcon ? '<i class="cui-icon">first_page</i>' : '첫 페이지';
        return '<a href="javascript:;" class="cui-page-first' + (config.curr == 1 ? (' ' + DISABLED) : '') + '" data-page="1" title="첫 페이지">' + icon + '</a>';
      }()

      // 이전 페이지
      ,prev: function(){
        return config.prev
          ? '<a href="javascript:;" class="cui-page-prev' + (config.curr == 1 ? (' ' + DISABLED) : '') + '" data-page="' + (config.curr - 1) + '">' + config.prev + '</a>'
          : '';
      }()

      // 페이지 번호
      ,page: function(){
        var pager = [];

        if(config.count < 1){
          return '';
        }

        // 첫 페이지 번호
        if(index > 1 && groups !== 0){
          pager.push('<a href="javascript:;" data-page="1">1</a>');
        }

        // 현재 페이지 그룹의 시작 페이지 계산
        var halve = Math.floor((groups - 1) / 2)
        ,start = index > 1 ? config.curr - halve : 1
        ,end = index > 1 ? (function(){
          var max = config.curr + (groups - halve - 1);
          return max > config.pages ? config.pages : max;
        }()) : groups;

        // 마지막 그룹에서 연속 페이지 수가 맞지 않는 것 방지
        if(end - start < groups - 1){
          start = end - groups + 1;
        }

        // 좌측 구분자 출력
        if(start > 2){
          pager.push('<span class="cui-page-spr">…</span>');
        }

        // 연속 페이지 번호 출력
        for(; start <= end; start++){
          if(start === config.curr){
            pager.push('<span class="cui-page-curr"><em class="cui-page-em"' + (/^#/.test(config.theme) ? ' style="background-color:' + config.theme + ';"' : '') + '></em><em>' + start + '</em></span>');
          } else {
            pager.push('<a href="javascript:;" data-page="' + start + '">' + start + '</a>');
          }
        }

        // 우측 구분자 & 마지막 페이지 출력
        if(config.pages > groups && config.pages > end){
          if(end + 1 < config.pages){
            pager.push('<span class="cui-page-spr">…</span>');
          }
          if(groups !== 0 && end < config.pages){
            pager.push('<a href="javascript:;" data-page="' + config.pages + '">' + config.pages + '</a>');
          }
        }

        return pager.join('');
      }()

      // 다음 페이지
      ,next: function(){
        return config.next
          ? '<a href="javascript:;" class="cui-page-next' + (config.curr == config.pages ? (' ' + DISABLED) : '') + '" data-page="' + (config.curr + 1) + '">' + config.next + '</a>'
          : '';
      }()

      // 마지막 페이지 버튼
      ,last: function(){
        if(config.last === false) return '';
        var icon = useIcon ? '<i class="cui-icon">last_page</i>' : '끝 페이지';
        return '<a href="javascript:;" class="cui-page-last' + (config.curr == config.pages ? (' ' + DISABLED) : '') + '" data-page="' + config.pages + '" title="마지막 페이지">' + icon + '</a>';
      }()

      // 데이터 총 개수
      ,count: '<span class="cui-page-count">총 <b>' + config.count + '</b> 건</span>'

      // 총 페이지 수 표시
      ,pages: '<span class="cui-page-pages"><b>' + config.curr + '</b> / <b>' + config.pages + '</b> 페이지</span>'

      // 간단 정보 (X-Y / Total)
      ,info: function(){
        var start = (config.curr - 1) * config.limit + 1;
        var end = Math.min(config.curr * config.limit, config.count);
        return '<span class="cui-page-info">' + start + '-' + end + ' / ' + config.count + '</span>';
      }()

      // 페이지당 건수
      ,limit: function(){
        var options = ['<span class="cui-page-limits"><select cui-ignore>'];
        config.limits.forEach(function(item){
          options.push(
            '<option value="' + item + '"'
            + (item === config.limit ? ' selected' : '')
            + '>' + item + ' 건/페이지</option>'
          );
        });
        return options.join('') + '</select></span>';
      }()

      // 현재 페이지 새로고침
      ,refresh: '<a href="javascript:;" data-page="' + config.curr + '" class="cui-page-refresh" title="새로고침"><i class="cui-icon">refresh</i></a>'

      // 페이지 이동 영역
      ,skip: function(){
        return '<span class="cui-page-skip"><input type="text" min="1" value="' + config.curr + '" class="cui-input"> 페이지로 <button type="button" class="cui-page-btn">이동</button></span>';
      }()
    };

    // 스킨 클래스
    var skinClass = config.skin ? ' cui-page-skin-' + config.skin : '';
    // 사이즈 클래스
    var sizeClass = config.size !== 'md' ? ' cui-page-' + config.size : '';

    return '<div class="cui-box cui-page cui-page-' + (config.theme ? (/^#/.test(config.theme) ? 'molv' : config.theme) : 'default') + skinClass + sizeClass + '" id="cui-page-' + config.index + '">'
      + (function(){
        var plate = [];
        config.layout.forEach(function(item){
          if(views[item]){
            plate.push(views[item]);
          }
        });
        return plate.join('');
      }())
      + '</div>';
  };

  // 페이지 이동 콜백
  Class.prototype.jump = function(elem, isskip){
    if(!elem) return;
    var that = this
    ,config = that.config
    ,childs = elem.children
    ,btn = elem.querySelector('button')
    ,input = elem.querySelector('input')
    ,select = elem.querySelector('select')
    ,skip = function(){
      var curr = input.value.replace(/\s|\D/g, '') | 0;
      if(curr){
        config.curr = curr;
        that.render();
      }
    };

    if(isskip) return skip();

    // 페이지 번호
    for(var i = 0, len = childs.length; i < len; i++){
      if(childs[i].nodeName.toLowerCase() === 'a'){
        childs[i].addEventListener('click', function(){
          var curr = this.getAttribute('data-page') | 0;
          if(curr < 1 || curr > config.pages) return;
          config.curr = curr;
          that.render();
        });
      }
    }

    // 건수
    if(select){
      select.addEventListener('change', function(){
        var value = this.value;
        if(config.curr * value > config.count){
          config.curr = Math.ceil(config.count / value);
        }
        config.limit = value;
        that.render();
      });
    }

    // 확인
    if(btn){
      btn.addEventListener('click', function(){
        skip();
      });
    }
  };

  // 페이지 번호 입력 제어
  Class.prototype.skip = function(elem){
    if(!elem) return;
    var that = this
    ,input = elem.querySelector('input');
    if(!input) return;

    input.addEventListener('keyup', function(e){
      var value = this.value
      ,keyCode = e.keyCode;
      if(/^(37|38|39|40)$/.test(keyCode)) return;
      if(/\D/.test(value)){
        this.value = value.replace(/\D/, '');
      }
      if(keyCode === 13){
        that.jump(elem, true);
      }
    });
  };

  // 페이지네이션 렌더링
  Class.prototype.render = function(load){
    var that = this
    ,config = that.config
    ,type = that.type()
    ,view = that.view();

    if(type === 2){
      config.elem && (config.elem.innerHTML = view);
    } else if(type === 3){
      config.elem.html(view);
    } else {
      var elemNode = doc.getElementById(config.elem);
      if(elemNode){
        elemNode.innerHTML = view;
      }
    }

    config.jump && config.jump(config, load);

    var elem = doc.getElementById('cui-page-' + config.index);
    that.jump(elem);

    if(config.hash && !load){
      location.hash = '!' + config.hash + '=' + config.curr;
    }

    that.skip(elem);
  };

  // 외부 인터페이스
  var page = {
    // 렌더링
    render: function(options){
      var o = new Class(options);
      return o.config.index;
    }

    // 인스턴스 가져오기
    ,getInst: function(id){
      return instances[id];
    }

    // 리로드 (옵션 업데이트)
    ,reload: function(id, options){
      var inst = instances[id];
      if(!inst) return;
      
      // 옵션 병합
      for(var key in options){
        inst.config[key] = options[key];
      }
      inst.render();
      return inst;
    }

    // 현재 페이지 가져오기
    ,curr: function(id){
      var inst = instances[id];
      return inst ? inst.config.curr : null;
    }

    // 특정 페이지로 이동
    ,go: function(id, pageNum){
      var inst = instances[id];
      if(!inst) return;
      
      var pages = inst.config.pages;
      pageNum = Math.max(1, Math.min(pages, pageNum | 0));
      inst.config.curr = pageNum;
      inst.render();
      return inst;
    }

    // 이벤트 등록
    ,on: function(events, callback){
      if(window.Catui && Catui.onevent){
        return Catui.onevent.call(this, MOD_NAME, events, callback);
      }
      return this;
    }

    ,index: window.Catui && Catu