/*!
 * Catui tree - 트리 컴포넌트
 * Based on tree.js, jQuery-free
 * MIT Licensed
 */

;!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'tree'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 인덱스
  ,index = 0

  // 상수
  ,ELEM = 'cui-tree'
  ,ELEM_SET = 'cui-tree-set'
  ,ELEM_ENTRY = 'cui-tree-entry'
  ,ELEM_MAIN = 'cui-tree-main'
  ,ELEM_TEXT = 'cui-tree-txt'
  ,ELEM_PACK = 'cui-tree-pack'
  ,ELEM_SPREAD = 'cui-tree-spread'
  ,ELEM_LINE = 'cui-tree-line'
  ,ICON_CLICK = 'cui-tree-icon-click'
  ,SHOW = 'cui-show'

  // 외부 인터페이스
  ,tree = {
    config: {}
    ,index: 0
    ,that: {}  // 인스턴스 저장 (table과 동일)

    // 전역 설정
    ,set: function(options){
      var $c = get$c();
      this.config = $c.extend({}, this.config, options);
      return this;
    }

    // 렌더링
    ,render: function(options){
      var inst = new Class(options);
      return inst.thisTree();
    }

    // 인스턴스 가져오기
    ,getInst: function(id){
      return tree.that[id];
    }

    // 체크된 노드 가져오기
    ,getChecked: function(id){
      var inst = tree.that[id];
      return inst ? inst.getChecked() : [];
    }

    // 노드 체크 설정
    ,setChecked: function(id, nodeId){
      var inst = tree.that[id];
      if(inst) inst.setChecked(nodeId);
    }

    // 리로드
    ,reload: function(id, options){
      var inst = tree.that[id];
      if(inst) inst.reload(options);
    }

    // 이벤트 등록
    ,on: function(events, callback){
      if(window.Catui && Catui.onevent){
        return Catui.onevent.call(this, MOD_NAME, events, callback);
      }
      return this;
    }

    // 인스턴스 정리
    ,destroy: function(id){
      var inst = tree.that[id];
      if(!inst) return;

      // DOM 정리
      if(inst.config.elem && inst.config.elem[0]){
        inst.config.elem.html('');
      }

      // 인스턴스 저장소에서 제거
      delete tree.that[id];
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
    that.config = $c.extend({}, that.defaults, tree.config, options);
    that.config.id = that.config.id || that.index;
    
    tree.that[that.config.id] = that;
    that.key = that.config.id;
    that.render();
  };

  // thisTree 반환
  Class.prototype.thisTree = function(){
    var that = this;
    return {
      config: that.config
      ,reload: function(options){
        that.reload(options);
      }
      ,getChecked: function(){
        return that.getChecked();
      }
      ,setChecked: function(id){
        return that.setChecked(id);
      }
    };
  };

  // 기본 설정
  Class.prototype.defaults = {
    elem: null              // 컨테이너
    ,data: []               // 트리 데이터
    ,id: ''                 // 고유 ID
    ,showCheckbox: false    // 체크박스 표시
    ,showLine: true         // 연결선 표시
    ,accordion: false       // 아코디언 모드
    ,onlyIconControl: false // 아이콘으로만 열기/닫기
    ,isJump: false          // 링크 새창 열기
    ,edit: false            // 편집 버튼 표시 ['add', 'update', 'del']
    ,spread: 'click'        // 펼침 이벤트: click, dblclick
    ,text: {
      defaultNodeName: '새 항목'
      ,none: '데이터가 없습니다'
    }
    ,click: null            // 노드 클릭 콜백
    ,oncheck: null          // 체크박스 콜백
    ,operate: null          // 편집 콜백
  };

  // 리로드
  Class.prototype.reload = function(options){
    var that = this
    ,$c = get$c();
    
    that.config = $c.extend(true, {}, that.config, options);
    that.render();
  };

  // 렌더링
  Class.prototype.render = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    that.elem = $c(config.elem);
    if(!that.elem[0]) return;

    that.checkedIds = [];

    // 트리 컨테이너 생성
    var treeClass = ELEM 
      + (config.showCheckbox ? ' cui-form' : '') 
      + (config.showLine ? ' ' + ELEM_LINE : '');
    
    var container = document.createElement('div');
    container.className = treeClass;
    container.setAttribute('cui-filter', 'cui-tree-' + that.index);

    // 트리 빌드
    that.buildTree(container, config.data, 0);

    // 컨테이너에 삽입
    that.elem.html('');
    that.elem[0].appendChild(container);
    that.treeElem = $c(container);

    // 데이터 없음
    if(config.data.length === 0){
      that.treeElem.html('<div class="cui-tree-empty">' + config.text.none + '</div>');
    }

    // 이벤트 바인딩
    that.bindEvents();
  };

  // 트리 빌드
  Class.prototype.buildTree = function(container, data, level){
    var that = this
    ,config = that.config;

    data.forEach(function(item, idx){
      var hasChild = item.children && item.children.length > 0;
      var isSpread = item.spread !== false;

      // 노드 컨테이너
      var set = document.createElement('div');
      set.className = ELEM_SET + (hasChild && isSpread ? ' ' + ELEM_SPREAD : '');
      set.setAttribute('data-id', item.id || '');

      // 노드 엔트리
      var entry = document.createElement('div');
      entry.className = ELEM_ENTRY;

      // 메인 영역
      var main = document.createElement('div');
      main.className = ELEM_MAIN;

      // 펼침 아이콘
      if(hasChild){
        var icon = document.createElement('span');
        icon.className = ICON_CLICK;
        icon.innerHTML = '<i class="cui-icon">' + (isSpread ? 'expand_more' : 'chevron_right') + '</i>';
        main.appendChild(icon);
      } else {
        var iconPlaceholder = document.createElement('span');
        iconPlaceholder.className = ICON_CLICK + ' cui-tree-icon-leaf';
        iconPlaceholder.innerHTML = '<i class="cui-icon">description</i>';
        main.appendChild(iconPlaceholder);
      }

      // 체크박스
      if(config.showCheckbox){
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'cui-tree-checkbox';
        checkbox.setAttribute('data-id', item.id || '');
        if(item.checked){
          checkbox.checked = true;
          that.checkedIds.push(item.id);
        }
        if(item.disabled){
          checkbox.disabled = true;
        }
        main.appendChild(checkbox);
      }

      // 텍스트/링크
      var text = document.createElement('span');
      text.className = ELEM_TEXT;
      
      if(item.href && config.isJump){
        var link = document.createElement('a');
        link.href = item.href;
        link.target = item.target || '_blank';
        link.textContent = item.title || config.text.defaultNodeName;
        text.appendChild(link);
      } else {
        text.textContent = item.title || config.text.defaultNodeName;
      }
      main.appendChild(text);

      // 편집 버튼
      if(config.edit){
        var editBtns = document.createElement('span');
        editBtns.className = 'cui-tree-edit';

        var editArr = config.edit === true ? ['add', 'update', 'del'] : config.edit;

        editArr.forEach(function(type){
          var btn = document.createElement('i');
          btn.className = 'cui-icon cui-tree-edit-' + type;
          btn.setAttribute('data-type', type);
          
          var icons = { add: 'add', update: 'edit', del: 'delete' };
          btn.textContent = icons[type] || type;
          editBtns.appendChild(btn);
        });

        main.appendChild(editBtns);
      }

      entry.appendChild(main);
      set.appendChild(entry);

      // 자식 노드
      if(hasChild){
        var pack = document.createElement('div');
        pack.className = ELEM_PACK + (isSpread ? ' ' + SHOW : '');
        
        that.buildTree(pack, item.children, level + 1);
        set.appendChild(pack);
      }

      container.appendChild(set);
    });
  };

  // 이벤트 바인딩
  Class.prototype.bindEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    // 펼침/접힘 아이콘 클릭
    that.treeElem.find('.' + ICON_CLICK).each(function(i, icon){
      var $icon = $c(icon);
      if($icon.hasClass('cui-tree-icon-leaf')) return;

      $icon.off('click').on('click', function(e){
        e.stopPropagation();
        
        var set = $c(icon).closest('.' + ELEM_SET);
        var pack = set.find('.' + ELEM_PACK).eq(0);
        var iconElem = $icon.find('.cui-icon');
        
        if(set.hasClass(ELEM_SPREAD)){
          // 접기
          set.removeClass(ELEM_SPREAD);
          pack.removeClass(SHOW);
          iconElem.html('chevron_right');
        } else {
          // 펼치기
          if(config.accordion){
            // 아코디언: 같은 레벨의 다른 노드 접기
            set.siblings('.' + ELEM_SET).removeClass(ELEM_SPREAD)
              .find('.' + ELEM_PACK).removeClass(SHOW);
            set.siblings('.' + ELEM_SET).find('.' + ICON_CLICK + ' .cui-icon').html('chevron_right');
          }
          
          set.addClass(ELEM_SPREAD);
          pack.addClass(SHOW);
          iconElem.html('expand_more');
        }
      });
    });

    // 노드 텍스트 클릭
    that.treeElem.find('.' + ELEM_TEXT).each(function(i, text){
      $c(text).off('click').on('click', function(e){
        if(!config.onlyIconControl){
          // 펼침/접힘도 함께 처리
          var icon = $c(text).closest('.' + ELEM_MAIN).find('.' + ICON_CLICK);
          if(!icon.hasClass('cui-tree-icon-leaf')){
            icon[0].click();
          }
        }

        var set = $c(text).closest('.' + ELEM_SET);
        var data = that.getNodeData(set[0].getAttribute('data-id'));

        // 활성화 표시
        that.treeElem.find('.' + ELEM_TEXT).removeClass('cui-tree-active');
        $c(text).addClass('cui-tree-active');

        var eventData = {
          elem: set
          ,data: data
        };

        // 클릭 콜백
        if(typeof config.click === 'function'){
          config.click(eventData);
        }

        // Catui 이벤트
        if(window.Catui && Catui.event){
          Catui.event(MOD_NAME, 'click(' + that.key + ')', eventData);
        }
      });
    });

    // 체크박스
    if(config.showCheckbox){
      that.treeElem.find('.cui-tree-checkbox').each(function(i, checkbox){
        $c(checkbox).off('change').on('change', function(){
          var id = checkbox.getAttribute('data-id');
          var checked = checkbox.checked;
          var set = $c(checkbox).closest('.' + ELEM_SET);

          // 자식 노드도 함께 체크/해제
          set.find('.cui-tree-checkbox').each(function(j, child){
            child.checked = checked;
          });

          // 부모 노드 상태 업데이트
          that.updateParentCheckbox(checkbox);

          var eventData = {
            elem: set
            ,data: that.getNodeData(id)
            ,checked: checked
          };

          // 콜백
          if(typeof config.oncheck === 'function'){
            config.oncheck(eventData);
          }

          // Catui 이벤트
          if(window.Catui && Catui.event){
            Catui.event(MOD_NAME, 'checkbox(' + that.key + ')', eventData);
          }
        });
      });
    }

    // 편집 버튼
    if(config.edit){
      that.treeElem.find('.cui-tree-edit .cui-icon').each(function(i, btn){
        $c(btn).off('click').on('click', function(e){
          e.stopPropagation();
          
          var type = btn.getAttribute('data-type');
          var set = $c(btn).closest('.' + ELEM_SET);
          var id = set[0].getAttribute('data-id');
          var data = that.getNodeData(id);

          var eventData = {
            type: type
            ,elem: set
            ,data: data
          };

          if(typeof config.operate === 'function'){
            config.operate(eventData);
          }

          // Catui 이벤트
          if(window.Catui && Catui.event){
            Catui.event(MOD_NAME, 'operate(' + that.key + ')', eventData);
          }
        });
      });
    }
  };

  // 부모 체크박스 상태 업데이트
  Class.prototype.updateParentCheckbox = function(checkbox){
    var that = this
    ,$c = get$c();

    var set = $c(checkbox).closest('.' + ELEM_SET);
    var parentPack = set.parent('.' + ELEM_PACK);
    
    if(!parentPack[0]) return;

    var parentSet = parentPack.closest('.' + ELEM_SET);
    var parentCheckbox = parentSet.find('.cui-tree-checkbox').eq(0)[0];
    
    if(!parentCheckbox) return;

    // 형제 노드들의 체크 상태 확인
    var siblings = parentPack.find('.' + ELEM_SET);
    var checkedCount = 0;
    var totalCount = 0;

    siblings.each(function(i, sibling){
      var cb = $c(sibling).children('.' + ELEM_ENTRY).find('.cui-tree-checkbox')[0];
      if(cb){
        totalCount++;
        if(cb.checked) checkedCount++;
      }
    });

    parentCheckbox.checked = checkedCount === totalCount && totalCount > 0;
    parentCheckbox.indeterminate = checkedCount > 0 && checkedCount < totalCount;

    // 재귀적으로 상위 노드 업데이트
    that.updateParentCheckbox(parentCheckbox);
  };

  // 노드 데이터 가져오기
  Class.prototype.getNodeData = function(id, data){
    var that = this
    ,config = that.config;

    data = data || config.data;
    
    for(var i = 0; i < data.length; i++){
      if(String(data[i].id) === String(id)){
        return data[i];
      }
      if(data[i].children){
        var found = that.getNodeData(id, data[i].children);
        if(found) return found;
      }
    }
    return null;
  };

  // 체크된 노드 가져오기
  Class.prototype.getChecked = function(){
    var that = this
    ,$c = get$c()
    ,result = [];

    that.treeElem.find('.cui-tree-checkbox:checked').each(function(i, checkbox){
      var id = checkbox.getAttribute('data-id');
      var data = that.getNodeData(id);
      if(data) result.push(data);
    });

    return result;
  };

  // 노드 체크 설정
  Class.prototype.setChecked = function(id){
    var that = this
    ,$c = get$c();

    var ids = Array.isArray(id) ? id : [id];

    ids.forEach(function(nodeId){
      var checkbox = that.treeElem.find('.cui-tree-checkbox[data-id="' + nodeId + '"]')[0];
      if(checkbox){
        checkbox.checked = true;
        // 부모 상태 업데이트
        that.updateParentCheckbox(checkbox);
      }
    });
  };

  // 전역 노출
  window.tree = tree;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = tree;
  }

}(window);
