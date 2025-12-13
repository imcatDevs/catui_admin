/*!
 * Catui transfer - 이전 선택 컴포넌트
 * Based on transfer.js, jQuery-free
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'transfer'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 인덱스
  ,index = 0
  
  // 인스턴스 저장
  ,instances = {}

  // 상수
  ,ELEM = 'cui-transfer'

  // 외부 인터페이스
  ,transfer = {
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
      return {
        reload: function(opts){
          inst.reload(opts);
        }
        ,getData: function(){
          return inst.getData();
        }
        ,config: inst.config
      };
    }

    // 인스턴스 가져오기
    ,getInst: function(id){
      return instances[id];
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
    that.config = $c.extend({}, that.defaults, transfer.config, options);
    that.config.id = that.config.id || that.index;
    
    instances[that.config.id] = that;
    that.render();
  };

  // 기본 설정
  Class.prototype.defaults = {
    elem: null              // 컨테이너
    ,data: []               // 데이터: [{ value, title, disabled, checked }]
    ,id: ''                 // 고유 ID
    ,title: ['전체 목록', '선택 목록']  // 제목
    ,showSearch: false      // 검색 표시
    ,width: 200             // 너비
    ,height: 300            // 높이
    ,text: {
      none: '데이터 없음'
      ,searchNone: '검색 결과 없음'
    }
    ,value: []              // 초기 선택값
    ,parseData: null        // 데이터 파싱 함수
    ,onchange: null         // 변경 콜백
  };

  // 리로드
  Class.prototype.reload = function(options){
    var that = this
    ,$c = get$c();
    
    that.config = $c.extend({}, that.config, options);
    // 데이터 재초기화
    that.leftData = null;
    that.rightData = null;
    that.render();
  };

  // 렌더링
  Class.prototype.render = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    that.elem = $c(config.elem);
    if(!that.elem[0]) return;

    // 데이터 파싱 (초기 렌더링 시에만)
    if(!that.leftData || !that.rightData){
      that.leftData = [];
      that.rightData = [];
      
      var values = config.value || [];
      
      (config.data || []).forEach(function(item){
        var parsed = typeof config.parseData === 'function' 
          ? config.parseData(item) 
          : item;
        
        if(values.indexOf(parsed.value) !== -1 || parsed.checked){
          that.rightData.push(parsed);
        } else {
          that.leftData.push(parsed);
        }
      });
    }

    // 컨테이너 생성
    var container = document.createElement('div');
    container.className = ELEM;

    // 왼쪽 패널
    var leftPanel = that.createPanel('left', config.title[0], that.leftData);
    container.appendChild(leftPanel);

    // 버튼 영역
    var buttons = document.createElement('div');
    buttons.className = 'cui-transfer-buttons';
    buttons.innerHTML = '<button type="button" class="cui-btn cui-btn-xs cui-transfer-to-right" disabled>'
      + '<i class="cui-icon">chevron_right</i></button>'
      + '<button type="button" class="cui-btn cui-btn-xs cui-transfer-to-left" disabled>'
      + '<i class="cui-icon">chevron_left</i></button>';
    container.appendChild(buttons);
    that.toRightBtn = buttons.querySelector('.cui-transfer-to-right');
    that.toLeftBtn = buttons.querySelector('.cui-transfer-to-left');

    // 오른쪽 패널
    var rightPanel = that.createPanel('right', config.title[1], that.rightData);
    container.appendChild(rightPanel);

    that.elem.html('');
    that.elem[0].appendChild(container);
    that.container = $c(container);

    // 이벤트 바인딩
    that.bindEvents();
  };

  // 패널 생성
  Class.prototype.createPanel = function(side, title, data){
    var that = this
    ,config = that.config;

    var panel = document.createElement('div');
    panel.className = 'cui-transfer-panel cui-transfer-' + side;
    panel.style.width = config.width + 'px';

    // 헤더
    var header = document.createElement('div');
    header.className = 'cui-transfer-header';
    header.innerHTML = '<label class="cui-transfer-checkbox-wrap">'
      + '<input type="checkbox" class="cui-transfer-checkbox-all">'
      + '<span class="cui-transfer-title">' + title + '</span>'
      + '</label>'
      + '<span class="cui-transfer-count"><span class="cui-transfer-checked-count">0</span> / ' + data.length + '</span>';
    panel.appendChild(header);
    
    if(side === 'left'){
      that.leftCheckAll = header.querySelector('.cui-transfer-checkbox-all');
      that.leftCount = header.querySelector('.cui-transfer-checked-count');
      that.leftTotal = data.length;
    } else {
      that.rightCheckAll = header.querySelector('.cui-transfer-checkbox-all');
      that.rightCount = header.querySelector('.cui-transfer-checked-count');
      that.rightTotal = data.length;
    }

    // 검색
    if(config.showSearch){
      var search = document.createElement('div');
      search.className = 'cui-transfer-search';
      search.innerHTML = '<input type="text" class="cui-input" placeholder="검색...">'
        + '<i class="cui-icon">search</i>';
      panel.appendChild(search);
      
      if(side === 'left'){
        that.leftSearch = search.querySelector('input');
      } else {
        that.rightSearch = search.querySelector('input');
      }
    }

    // 목록
    var list = document.createElement('div');
    list.className = 'cui-transfer-list';
    list.style.height = config.height + 'px';

    if(data.length === 0){
      list.innerHTML = '<div class="cui-transfer-empty">' + config.text.none + '</div>';
    } else {
      var ul = document.createElement('ul');
      data.forEach(function(item, idx){
        var li = document.createElement('li');
        li.className = 'cui-transfer-item' + (item.disabled ? ' cui-transfer-item-disabled' : '');
        li.setAttribute('data-value', item.value);
        li.innerHTML = '<label>'
          + '<input type="checkbox" class="cui-transfer-checkbox"' + (item.disabled ? ' disabled' : '') + '>'
          + '<span>' + item.title + '</span>'
          + '</label>';
        ul.appendChild(li);
      });
      list.appendChild(ul);
    }

    panel.appendChild(list);

    if(side === 'left'){
      that.leftList = list;
    } else {
      that.rightList = list;
    }

    return panel;
  };

  // 이벤트 바인딩
  Class.prototype.bindEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    // 왼쪽 전체 선택
    $c(that.leftCheckAll).on('change', function(){
      var checked = that.leftCheckAll.checked;
      $c(that.leftList).find('.cui-transfer-checkbox:not(:disabled)').each(function(i, cb){
        cb.checked = checked;
      });
      that.updateCount('left');
      that.updateButtons();
    });

    // 오른쪽 전체 선택
    $c(that.rightCheckAll).on('change', function(){
      var checked = that.rightCheckAll.checked;
      $c(that.rightList).find('.cui-transfer-checkbox:not(:disabled)').each(function(i, cb){
        cb.checked = checked;
      });
      that.updateCount('right');
      that.updateButtons();
    });

    // 왼쪽 개별 체크박스
    $c(that.leftList).find('.cui-transfer-checkbox').each(function(i, cb){
      $c(cb).on('change', function(){
        that.updateCount('left');
        that.updateButtons();
      });
    });

    // 오른쪽 개별 체크박스
    $c(that.rightList).find('.cui-transfer-checkbox').each(function(i, cb){
      $c(cb).on('change', function(){
        that.updateCount('right');
        that.updateButtons();
      });
    });

    // 오른쪽으로 이동
    $c(that.toRightBtn).on('click', function(){
      that.moveItems('right');
    });

    // 왼쪽으로 이동
    $c(that.toLeftBtn).on('click', function(){
      that.moveItems('left');
    });

    // 검색
    if(config.showSearch){
      $c(that.leftSearch).on('input', function(){
        that.filterItems('left', that.leftSearch.value);
      });

      $c(that.rightSearch).on('input', function(){
        that.filterItems('right', that.rightSearch.value);
      });
    }
  };

  // 카운트 업데이트
  Class.prototype.updateCount = function(side){
    var that = this
    ,$c = get$c();

    var list = side === 'left' ? that.leftList : that.rightList;
    var countElem = side === 'left' ? that.leftCount : that.rightCount;
    var checkAll = side === 'left' ? that.leftCheckAll : that.rightCheckAll;

    var checkboxes = $c(list).find('.cui-transfer-checkbox:not(:disabled)');
    var checkedCount = 0;
    var totalCount = 0;

    checkboxes.each(function(i, cb){
      totalCount++;
      if(cb.checked) checkedCount++;
    });

    countElem.textContent = checkedCount;
    checkAll.checked = checkedCount > 0 && checkedCount === totalCount;
    checkAll.indeterminate = checkedCount > 0 && checkedCount < totalCount;
  };

  // 버튼 상태 업데이트
  Class.prototype.updateButtons = function(){
    var that = this
    ,$c = get$c();

    var leftChecked = $c(that.leftList).find('.cui-transfer-checkbox:checked').length > 0;
    var rightChecked = $c(that.rightList).find('.cui-transfer-checkbox:checked').length > 0;

    that.toRightBtn.disabled = !leftChecked;
    that.toLeftBtn.disabled = !rightChecked;
  };

  // 아이템 이동
  Class.prototype.moveItems = function(direction){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    var fromList = direction === 'right' ? that.leftList : that.rightList;
    var _toList = direction === 'right' ? that.rightList : that.leftList;
    var fromData = direction === 'right' ? that.leftData : that.rightData;
    var toData = direction === 'right' ? that.rightData : that.leftData;

    var toMove = [];
    $c(fromList).find('.cui-transfer-item').each(function(i, item){
      var cb = item.querySelector('.cui-transfer-checkbox');
      if(cb.checked && !cb.disabled){
        var value = item.getAttribute('data-value');
        // 데이터에서 찾기
        for(var j = 0; j < fromData.length; j++){
          if(String(fromData[j].value) === String(value)){
            toMove.push(fromData[j]);
            fromData.splice(j, 1);
            break;
          }
        }
      }
    });

    // 데이터 이동
    toMove.forEach(function(item){
      toData.push(item);
    });

    // 다시 렌더링
    that.render();

    // 콜백
    if(typeof config.onchange === 'function'){
      config.onchange({
        data: that.getData()
        ,direction: direction
        ,moved: toMove
      });
    }
  };

  // 필터링
  Class.prototype.filterItems = function(side, keyword){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    var list = side === 'left' ? that.leftList : that.rightList;
    keyword = keyword.toLowerCase();

    var hasVisible = false;
    $c(list).find('.cui-transfer-item').each(function(i, item){
      var text = item.textContent.toLowerCase();
      if(keyword === '' || text.indexOf(keyword) !== -1){
        item.style.display = '';
        hasVisible = true;
      } else {
        item.style.display = 'none';
      }
    });

    // 검색 결과 없음
    var empty = list.querySelector('.cui-transfer-empty');
    if(!hasVisible && !empty){
      var emptyDiv = document.createElement('div');
      emptyDiv.className = 'cui-transfer-empty';
      emptyDiv.textContent = config.text.searchNone;
      list.appendChild(emptyDiv);
    } else if(hasVisible && empty){
      empty.remove();
    }
  };

  // 데이터 가져오기
  Class.prototype.getData = function(){
    var that = this;
    return that.rightData.slice();
  };

  // 전역 노출
  window.transfer = transfer;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = transfer;
  }

}(window);
