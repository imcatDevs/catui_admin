/*!
 * Catui table - 데이터 테이블 컴포넌트
 * jQuery-free
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'table'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 상수
  ,ELEM = 'cui-table'
  ,ELEM_VIEW = 'cui-table-view'
  ,ELEM_TOOL = 'cui-table-tool'
  ,ELEM_BOX = 'cui-table-box'
  ,ELEM_HEADER = 'cui-table-header'
  ,ELEM_BODY = 'cui-table-body'
  ,ELEM_MAIN = 'cui-table-main'
  ,ELEM_PAGE = 'cui-table-page'
  ,ELEM_SORT = 'cui-table-sort'
  ,ELEM_LOADING = 'cui-table-loading'
  ,ELEM_NONE = 'cui-none'
  ,THIS = 'cui-this'
  ,HIDE = 'cui-hide'
  ,DISABLED = 'cui-disabled'
  ,CHECKED = 'cui-table-checked'

  // 외부 인터페이스
  ,table = {
    config: {
      checkName: 'CUI_CHECKED'
      ,indexName: 'CUI_TABLE_INDEX'
    }
    ,cache: {}
    ,index: 0
    ,that: {}

    // 전역 설정
    ,set: function(options){
      var $c = get$c();
      this.config = $c.extend({}, this.config, options);
      return this;
    }

    // 렌더링
    ,render: function(options){
      var inst = new Class(options);
      return inst.thisTable();
    }

    // 이벤트 등록
    ,on: function(events, callback){
      if(window.Catui && Catui.onevent){
        return Catui.onevent.call(this, MOD_NAME, events, callback);
      }
      return this;
    }

    // 체크 상태 가져오기
    ,checkStatus: function(id){
      var data = table.cache[id] || [];
      var checkName = table.config.checkName;
      var checkedData = [];
      var isAll = data.length > 0;

      data.forEach(function(item){
        if(item[checkName]){
          checkedData.push(item);
        } else {
          isAll = false;
        }
      });

      return {
        data: checkedData
        ,isAll: isAll
      };
    }

    // 데이터 가져오기
    ,getData: function(id){
      return table.cache[id] || [];
    }

    // 열 순회
    ,eachCols: function(id, callback, cols){
      var config = table.that[id] ? table.that[id].config : null;
      cols = cols || (config ? config.cols : []);
      
      cols.forEach(function(row, i1){
        row.forEach(function(col, i2){
          if(!col) return;
          col.key = i1 + '-' + i2;
          callback(i2, col);
        });
      });
    }

    // 리로드
    ,reload: function(id, options, deep){
      var inst = table.that[id];
      if(inst){
        inst.reload(options, deep);
      }
    }

    // 크기 재조정
    ,resize: function(id){
      if(id){
        var inst = table.that[id];
        if(inst) inst.setColsWidth();
      } else {
        for(var key in table.that){
          table.that[key].setColsWidth();
        }
      }
    }

    // 내보내기
    ,exportFile: function(id, data, type){
      var inst = table.that[id];
      if(!inst) return;
      
      data = data || table.cache[id] || [];
      type = type || 'csv';
      
      if(type === 'csv'){
        inst.exportData(data);
      }
    }

    // 캐시 키 정리
    ,clearCacheKey: function(data){
      var result = Object.assign({}, data);
      delete result[table.config.checkName];
      delete result[table.config.indexName];
      return result;
    }

    // 선택 설정
    ,setRowChecked: function(id, index, checked){
      var inst = table.that[id];
      if(!inst) return;
      
      var data = table.cache[id] || [];
      var item = data[index];
      if(!item) return;
      
      var checkName = table.config.checkName;
      item[checkName] = checked;
      
      var tr = inst.layTbody.querySelector('tr[data-index="' + index + '"]');
      if(tr){
        var cb = tr.querySelector('.cui-table-checkbox');
        if(cb) cb.checked = checked;
        tr.classList.toggle('cui-table-checked', checked);
      }
      inst.updateCheckAll();
    }

    // 인스턴스 정리
    ,destroy: function(id){
      var inst = table.that[id];
      if(!inst) return;

      // 캐시 정리
      delete table.cache[id];

      // DOM 정리
      if(inst.layView){
        inst.layView.remove();
      }

      // 인스턴스 저장소에서 제거
      delete table.that[id];
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

    that.index = ++table.index;
    that.config = $c.extend({}, that.defaults, table.config, options);
    
    // ID 설정
    that.config.id = that.config.id || that.index;
    that.key = that.config.id;
    
    // 인스턴스 저장
    table.that[that.key] = that;
    
    // 초기 페이지
    that.page = 1;
    
    that.render();
  };

  // 기본 설정
  Class.prototype.defaults = {
    elem: null
    ,cols: [[]]
    ,data: null
    ,url: null
    ,method: 'get'
    ,where: {}
    ,headers: {}
    ,contentType: 'application/json'
    ,page: false
    ,limit: 10
    ,limits: [10, 20, 30, 50, 100]
    ,loading: true
    ,skin: null        // line, row, nob
    ,even: false       // 짝수행 배경
    ,size: null        // sm, lg
    ,height: null
    ,cellMinWidth: 60
    ,toolbar: false
    ,defaultToolbar: ['filter', 'exports', 'print']
    ,autoSort: true
    ,initSort: null
    ,text: {
      none: '데이터가 없습니다'
    }
    ,request: {
      pageName: 'page'
      ,limitName: 'limit'
    }
    ,response: {
      statusName: 'code'
      ,statusCode: 0
      ,msgName: 'msg'
      ,dataName: 'data'
      ,countName: 'count'
    }
    ,parseData: null
    ,done: null
    ,error: null
    ,pageBtns: null  // 하단 버튼 ['버튼1', '버튼2'] 또는 [{text: '버튼', callback: fn}]
    ,totalRow: false  // 합계행 표시
  };

  // thisTable 반환
  Class.prototype.thisTable = function(){
    var that = this;
    return {
      config: that.config
      ,reload: function(options, deep){
        that.reload(options, deep);
      }
      ,setColsWidth: function(){
        that.setColsWidth();
      }
    };
  };

  // 렌더링
  Class.prototype.render = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    that.elem = $c(config.elem);
    if(!that.elem[0]) return;

    // 열 초기화
    that.initCols();

    // 컨테이너 너비
    config.width = config.width || that.elem[0].offsetWidth;

    // 컨테이너 생성
    var view = document.createElement('div');
    view.className = ELEM_VIEW
      + (config.skin ? ' ' + ELEM + '-' + config.skin : '')
      + (config.even ? ' ' + ELEM + '-even' : '')
      + (config.size ? ' ' + ELEM + '-' + config.size : '');
    
    if(config.width){
      view.style.width = config.width + 'px';
    }

    // 기존 뷰 제거
    var oldView = that.elem[0].nextElementSibling;
    if(oldView && oldView.classList.contains(ELEM_VIEW)){
      oldView.remove();
    }

    // 툴바
    if(config.toolbar){
      view.appendChild(that.renderToolbar());
    }

    // 테이블 박스
    var box = document.createElement('div');
    box.className = ELEM_BOX;

    // 로딩
    if(config.loading){
      var loading = document.createElement('div');
      loading.className = ELEM_LOADING;
      loading.innerHTML = '<i class="cui-icon cui-anim-rotate">sync</i>';
      box.appendChild(loading);
      that.loading = loading;
    }

    // 헤더
    var header = document.createElement('div');
    header.className = ELEM_HEADER;
    header.appendChild(that.renderHeader());
    box.appendChild(header);
    that.layHeader = header;

    // 바디
    var body = document.createElement('div');
    body.className = ELEM_BODY + ' ' + ELEM_MAIN;
    if(config.height){
      body.style.maxHeight = config.height + 'px';
      body.style.overflowY = 'auto';
    }
    body.appendChild(that.renderBody());
    box.appendChild(body);
    that.layBody = body;
    that.layMain = body;

    view.appendChild(box);

    // 페이지 또는 하단 버튼
    if(config.page || config.pageBtns){
      var page = document.createElement('div');
      page.className = ELEM_PAGE;
      view.appendChild(page);
      that.layPage = page;
    }

    // 스타일 추가
    view.appendChild(that.renderStyle());

    // 삽입
    that.elem[0].after(view);
    that.layView = view;
    that.layBox = box;

    // 캐시 초기화
    delete table.cache[that.key];

    // 데이터 로드
    that.pullData(that.page);
  };

  // 열 초기화
  Class.prototype.initCols = function(){
    var that = this
    ,config = that.config
    ,initWidth = {
      checkbox: 48
      ,radio: 48
      ,numbers: 60
    };

    // cols 배열 유효성 체크
    if(!config.cols || !config.cols.length){
      config.cols = [[]];
      return;
    }

    config.cols.forEach(function(row, i1){
      row.forEach(function(col, i2){
        if(!col) return;
        
        col.key = i1 + '-' + i2;
        col.hide = col.hide || false;
        
        // 타입별 기본 너비
        if(col.type && initWidth[col.type]){
          col.width = col.width || initWidth[col.type];
          col.unresize = true;
        }
        
        if(!col.type) col.type = 'normal';
      });
    });
  };

  // 툴바 렌더링
  Class.prototype.renderToolbar = function(){
    var that = this
    ,config = that.config;

    var toolbar = document.createElement('div');
    toolbar.className = ELEM_TOOL;

    var temp = document.createElement('div');
    temp.className = ELEM_TOOL + '-temp';

    // 커스텀 툴바
    if(typeof config.toolbar === 'string'){
      var tplElem = document.querySelector(config.toolbar);
      if(tplElem){
        temp.innerHTML = tplElem.innerHTML;
      }
    }
    toolbar.appendChild(temp);

    // 기본 툴바
    if(config.defaultToolbar && config.defaultToolbar.length){
      var self = document.createElement('div');
      self.className = ELEM_TOOL + '-self';
      
      var icons = {
        filter: { title: '열 필터', icon: 'filter_list', event: 'LAYTABLE_COLS' }
        ,exports: { title: '내보내기', icon: 'download', event: 'LAYTABLE_EXPORT' }
        ,print: { title: '인쇄', icon: 'print', event: 'LAYTABLE_PRINT' }
      };
      
      config.defaultToolbar.forEach(function(item){
        var iconInfo = typeof item === 'string' ? icons[item] : item;
        if(iconInfo){
          var btn = document.createElement('div');
          btn.className = 'cui-inline';
          btn.title = iconInfo.title;
          btn.setAttribute('cui-event', iconInfo.event);
          btn.innerHTML = '<i class="cui-icon">' + iconInfo.icon + '</i>';
          self.appendChild(btn);
        }
      });
      
      toolbar.appendChild(self);
    }

    return toolbar;
  };

  // 헤더 렌더링
  Class.prototype.renderHeader = function(){
    var that = this
    ,config = that.config;

    var table = document.createElement('table');
    table.className = ELEM;
    table.cellSpacing = 0;
    table.cellPadding = 0;

    // colgroup
    var colgroup = document.createElement('colgroup');
    var lastRow = config.cols[config.cols.length - 1] || [];
    lastRow.forEach(function(col, idx){
      var colElem = document.createElement('col');
      colElem.setAttribute('data-key', config.cols.length - 1 + '-' + idx);
      colgroup.appendChild(colElem);
    });
    table.appendChild(colgroup);

    // thead
    var thead = document.createElement('thead');
    config.cols.forEach(function(row, i1){
      var tr = document.createElement('tr');
      
      row.forEach(function(col, i2){
        if(!col) return;
        
        var th = document.createElement('th');
        th.setAttribute('data-field', col.field || '');
        th.setAttribute('data-key', that.index + '-' + i1 + '-' + i2);
        
        if(col.colspan) th.colSpan = col.colspan;
        if(col.rowspan) th.rowSpan = col.rowspan;
        if(col.hide) th.classList.add(HIDE);
        if(col.align) th.style.textAlign = col.align;

        var cell = document.createElement('div');
        cell.className = 'cui-table-cell cuitbl-cell-' + that.index + '-' + i1 + '-' + i2;
        if(col.type && col.type !== 'normal'){
          cell.classList.add('cuitbl-cell-' + col.type);
        }

        // 체크박스
        if(col.type === 'checkbox'){
          cell.innerHTML = '<input type="checkbox" name="cuiTableCheckboxAll" class="cui-table-checkbox-all">';
        }
        // 일반 헤더
        else {
          var title = '<span>' + (col.title || '') + '</span>';
          
          // 정렬
          if(col.sort && !col.colGroup){
            title += '<span class="' + ELEM_SORT + '">'
              + '<i class="cui-icon cui-table-sort-asc" title="오름차순">arrow_drop_up</i>'
              + '<i class="cui-icon cui-table-sort-desc" title="내림차순">arrow_drop_down</i>'
              + '</span>';
            th.classList.add('cui-unselect');
          }
          
          cell.innerHTML = title;
        }

        th.appendChild(cell);
        tr.appendChild(th);
      });
      
      thead.appendChild(tr);
    });
    table.appendChild(thead);

    return table;
  };

  // 바디 렌더링
  Class.prototype.renderBody = function(){
    var that = this
    ,config = that.config;

    var table = document.createElement('table');
    table.className = ELEM;
    table.cellSpacing = 0;
    table.cellPadding = 0;

    // colgroup
    var colgroup = document.createElement('colgroup');
    var lastRow = config.cols[config.cols.length - 1] || [];
    lastRow.forEach(function(col, idx){
      var colElem = document.createElement('col');
      colElem.setAttribute('data-key', config.cols.length - 1 + '-' + idx);
      colgroup.appendChild(colElem);
    });
    table.appendChild(colgroup);

    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    that.layTbody = tbody;

    return table;
  };

  // 스타일 렌더링
  Class.prototype.renderStyle = function(){
    var that = this
    ,config = that.config;

    var style = document.createElement('style');
    var css = '';

    config.cols.forEach(function(row, i1){
      row.forEach(function(col, i2){
        if(!col) return;
        css += '.cuitbl-cell-' + that.index + '-' + i1 + '-' + i2 + '{';
        if(col.width){
          css += 'width:' + col.width + 'px;';
        }
        css += '}';
      });
    });

    style.textContent = css;
    return style;
  };

  // 데이터 가져오기
  Class.prototype.pullData = function(curr){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,request = config.request
    ,response = config.response;

    that.page = curr;
    that.startTime = Date.now();

    // 캐시된 데이터가 있으면 사용 (페이지 변경 시)
    var cachedData = table.cache[that.key];
    if(config.url && cachedData && cachedData.length > 0 && config.page){
      var res = {};
      var startLimit = (curr - 1) * config.limit;
      res[response.dataName] = cachedData.slice(startLimit, startLimit + config.limit);
      res[response.countName] = cachedData.length;
      
      that.renderData(res, curr, cachedData.length);
      that.setColsWidth();
      
      if(typeof config.done === 'function'){
        config.done(res, curr, cachedData.length);
      }
      return;
    }

    // URL 요청
    if(config.url){
      var params = {};
      params[request.pageName] = curr;
      params[request.limitName] = config.limit;
      params = $c.extend({}, params, config.where);

      that.showLoading();

      var xhr = new XMLHttpRequest();
      var url = config.url;
      
      if(config.method.toLowerCase() === 'get'){
        var qs = Object.keys(params).map(function(k){
          return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');
        url += (url.indexOf('?') === -1 ? '?' : '&') + qs;
      }

      xhr.open(config.method.toUpperCase(), url, true);
      
      if(config.method.toLowerCase() === 'post'){
        xhr.setRequestHeader('Content-Type', config.contentType);
      }
      for(var key in config.headers){
        xhr.setRequestHeader(key, config.headers[key]);
      }

      xhr.onload = function(){
        that.hideLoading();

        if(xhr.status >= 200 && xhr.status < 300){
          var res;
          try {
            res = JSON.parse(xhr.responseText);
          } catch(_e){
            that.renderError('데이터 파싱 오류');
            return;
          }

          if(typeof config.parseData === 'function'){
            res = config.parseData(res) || res;
          }

          if(res[response.statusName] === response.statusCode){
            var allData = res[response.dataName] || [];
            var totalCount = res[response.countName] || allData.length;
            
            // 서버가 페이지네이션을 하지 않은 경우 (전체 데이터 반환)
            // 클라이언트 측 페이지네이션 적용
            if(config.page && allData.length > config.limit){
              // 전체 데이터 캐시
              table.cache[that.key] = allData;
              totalCount = allData.length;
              
              // 현재 페이지 데이터만 추출
              var startLimit = (curr - 1) * config.limit;
              var pageData = allData.slice(startLimit, startLimit + config.limit);
              res[response.dataName] = pageData;
              res[response.countName] = totalCount;
            }
            
            that.renderData(res, curr, totalCount);
            that.setColsWidth();
            
            if(typeof config.done === 'function'){
              config.done(res, curr, totalCount);
            }
          } else {
            that.renderError(res[response.msgName] || '데이터 로드 실패');
          }
        } else {
          that.renderError('서버 오류: ' + xhr.status);
          if(typeof config.error === 'function'){
            config.error(xhr, xhr.statusText);
          }
        }
      };

      xhr.onerror = function(){
        that.hideLoading();
        that.renderError('네트워크 오류');
        if(typeof config.error === 'function'){
          config.error(xhr, 'network error');
        }
      };

      if(config.method.toLowerCase() === 'post'){
        xhr.send(JSON.stringify(params));
      } else {
        xhr.send();
      }
    }
    // 로컬 데이터
    else if(Array.isArray(config.data)){
      that.hideLoading();
      
      var localStartLimit = (curr - 1) * config.limit;
      var localRes = {};
      localRes[response.dataName] = config.data.slice(localStartLimit, localStartLimit + config.limit);
      localRes[response.countName] = config.data.length;

      that.renderData(localRes, curr, localRes[response.countName]);
      that.setColsWidth();
      
      if(typeof config.done === 'function'){
        config.done(localRes, curr, localRes[response.countName]);
      }
    }
    // 데이터 없음
    else {
      that.hideLoading();
      that.renderData({ data: [], count: 0 }, 1, 0);
    }
  };

  // 데이터 렌더링
  Class.prototype.renderData = function(res, curr, count){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,response = config.response
    ,data = res[response.dataName] || []
    ,checkName = table.config.checkName
    ,indexName = table.config.indexName;

    // 캐시 저장 (로컬 데이터 또는 첫 로드 시에만)
    if(config.data){
      table.cache[that.key] = config.data;
    }

    // 인덱스 설정
    data.forEach(function(item, idx){
      item[indexName] = idx;
    });

    that.count = count;
    var html = '';

    if(data.length === 0){
      var colspan = 0;
      var lastRow = config.cols[config.cols.length - 1] || [];
      lastRow.forEach(function(col){
        if(!col.colGroup && !col.hide) colspan++;
      });
      html = '<tr><td colspan="' + colspan + '"><div class="' + ELEM_NONE + '">' + config.text.none + '</div></td></tr>';
    } else {
      data.forEach(function(item, idx){
        var trClass = item[checkName] ? CHECKED : '';
        html += '<tr data-index="' + idx + '" class="' + trClass + '">';
        
        var lastRow = config.cols[config.cols.length - 1] || [];
        lastRow.forEach(function(col, colIdx){
          if(!col) return;
          
          var field = col.field || '';
          var content = item[field];
          var align = col.align ? ' style="text-align:' + col.align + '"' : '';
          var hideClass = col.hide ? ' class="' + HIDE + '"' : '';
          var editAttr = col.edit ? ' data-edit="' + col.edit + '"' : '';
          
          html += '<td data-field="' + field + '"' + align + hideClass + editAttr + '>';
          html += '<div class="cui-table-cell cuitbl-cell-' + that.index + '-' + (config.cols.length - 1) + '-' + colIdx;
          if(col.type && col.type !== 'normal'){
            html += ' cuitbl-cell-' + col.type;
          }
          html += '">';

          // 체크박스
          if(col.type === 'checkbox'){
            html += '<input type="checkbox" name="cuiTableCheckbox" class="cui-table-checkbox" ' + (item[checkName] ? 'checked' : '') + '>';
          }
          // 번호
          else if(col.type === 'numbers'){
            var num = idx + config.limit * (curr - 1) + 1;
            html += num;
          }
          // 템플릿
          else if(col.templet){
            if(typeof col.templet === 'function'){
              html += col.templet(item);
            } else {
              var tplElem = document.querySelector(col.templet);
              if(tplElem){
                html += that.parseTpl(tplElem.innerHTML, item);
              }
            }
          }
          // 일반 데이터
          else {
            if(content === undefined || content === null){
              content = '';
            }
            html += content;
          }

          html += '</div></td>';
        });
        
        html += '</tr>';
      });
    }

    that.layTbody.innerHTML = html;

    // 합계행
    if(config.totalRow && data.length > 0){
      that.renderTotalRow(data);
    }

    // 페이지네이션 또는 하단 버튼
    if(config.page || config.pageBtns){
      that.renderPage(curr, count);
    }

    // 이벤트
    that.bindEvents();

    // 초기 정렬
    if(config.initSort && !that.sortKey){
      that.sort(config.initSort.field, config.initSort.type);
    }

  };

  // 합계행 렌더링
  Class.prototype.renderTotalRow = function(data){
    var that = this
    ,config = that.config
    ,lastRow = config.cols[config.cols.length - 1] || [];

    // 기존 합계행 제거
    var existTotal = that.layTbody.querySelector('.cui-table-total');
    if(existTotal) existTotal.remove();

    var tr = document.createElement('tr');
    tr.className = 'cui-table-total';

    lastRow.forEach(function(col, colIdx){
      if(!col) return;

      var td = document.createElement('td');
      td.setAttribute('data-field', col.field || '');
      
      var cell = document.createElement('div');
      cell.className = 'cui-table-cell';

      // 합계 계산
      if(col.totalRow){
        var total = 0;
        var isNumber = true;
        
        data.forEach(function(item){
          var val = item[col.field];
          if(val !== undefined && val !== null && !isNaN(val)){
            total += parseFloat(val);
          } else if(val && isNaN(val)){
            isNumber = false;
          }
        });

        if(typeof col.totalRow === 'string'){
          cell.textContent = col.totalRow;
        } else if(typeof col.totalRow === 'function'){
          cell.textContent = col.totalRow(data, col);
        } else if(isNumber){
          cell.textContent = total;
        }
      } else if(colIdx === 0){
        cell.textContent = '합계';
      }

      td.appendChild(cell);
      tr.appendChild(td);
    });

    that.layTbody.appendChild(tr);
  };

  // 템플릿 파싱
  Class.prototype.parseTpl = function(tpl, data){
    return tpl.replace(/\{\{(.+?)\}\}/g, function(m, key){
      key = key.trim();
      if(key.indexOf('d.') === 0) key = key.substring(2);
      return data[key] !== undefined ? data[key] : '';
    });
  };

  // 페이지네이션 렌더링
  Class.prototype.renderPage = function(curr, count){
    var that = this
    ,config = that.config;

    // 페이지 없이 하단 버튼만 있을 때
    if(!config.page && config.pageBtns){
      var html = '<div class="cui-table-page-btns" style="margin-left:0;">';
      config.pageBtns.forEach(function(btn, idx){
        var text = typeof btn === 'string' ? btn : btn.text;
        var cls = typeof btn === 'object' && btn.class ? ' ' + btn.class : '';
        html += '<button class="cui-btn cui-btn-sm cui-btn-primary' + cls + '" data-btn-idx="' + idx + '">' + text + '</button>';
      });
      html += '</div>';
      that.layPage.innerHTML = html;
      that.bindPageBtns();
      return;
    }

    // page 모듈 사용
    if(window.Catui && Catui.page){
      Catui.page.render({
        elem: that.layPage
        ,count: count
        ,limit: config.limit
        ,limits: config.limits
        ,curr: curr
        ,layout: ['count', 'prev', 'page', 'next', 'limit']
        ,jump: function(obj, first){
          if(!first){
            that.page = obj.curr;
            that.config.limit = obj.limit;
            that.pullData(obj.curr);
          }
        }
      });
      // 하단 버튼 추가
      if(config.pageBtns && config.pageBtns.length){
        var btnsHtml = '<div class="cui-table-page-btns">';
        config.pageBtns.forEach(function(btn, idx){
          var text = typeof btn === 'string' ? btn : btn.text;
          var cls = typeof btn === 'object' && btn.class ? ' ' + btn.class : '';
          btnsHtml += '<button class="cui-btn cui-btn-sm cui-btn-primary' + cls + '" data-btn-idx="' + idx + '">' + text + '</button>';
        });
        btnsHtml += '</div>';
        that.layPage.insertAdjacentHTML('beforeend', btnsHtml);
        that.bindPageBtns();
      }
    } else {
      // 기본 페이지네이션
      var limit = config.limit;
      var pages = Math.ceil(count / limit);

      var pageHtml = '<div class="cui-table-page-info">총 ' + count + '건</div>';
      pageHtml += '<div class="cui-table-page-nav">';
      
      pageHtml += '<a class="cui-table-page-btn' + (curr <= 1 ? ' ' + DISABLED : '') + '" data-page="' + (curr - 1) + '"><i class="cui-icon">chevron_left</i></a>';
      
      var start = Math.max(1, curr - 2);
      var end = Math.min(pages, curr + 2);
      
      if(start > 1){
        pageHtml += '<a class="cui-table-page-num" data-page="1">1</a>';
        if(start > 2) pageHtml += '<span class="cui-table-page-ellipsis">...</span>';
      }
      
      for(var i = start; i <= end; i++){
        pageHtml += '<a class="cui-table-page-num' + (i === curr ? ' ' + THIS : '') + '" data-page="' + i + '">' + i + '</a>';
      }
      
      if(end < pages){
        if(end < pages - 1) pageHtml += '<span class="cui-table-page-ellipsis">...</span>';
        pageHtml += '<a class="cui-table-page-num" data-page="' + pages + '">' + pages + '</a>';
      }
      
      pageHtml += '<a class="cui-table-page-btn' + (curr >= pages ? ' ' + DISABLED : '') + '" data-page="' + (curr + 1) + '"><i class="cui-icon">chevron_right</i></a>';
      pageHtml += '</div>';
      
      pageHtml += '<div class="cui-table-page-limit"><select class="cui-select cui-table-page-select">';
      config.limits.forEach(function(n){
        pageHtml += '<option value="' + n + '"' + (n === limit ? ' selected' : '') + '>' + n + '개/페이지</option>';
      });
      pageHtml += '</select></div>';

      // 하단 버튼
      if(config.pageBtns && config.pageBtns.length){
        pageHtml += '<div class="cui-table-page-btns">';
        config.pageBtns.forEach(function(btn, idx){
          var text = typeof btn === 'string' ? btn : btn.text;
          var cls = typeof btn === 'object' && btn.class ? ' ' + btn.class : '';
          pageHtml += '<button class="cui-btn cui-btn-sm cui-btn-primary' + cls + '" data-btn-idx="' + idx + '">' + text + '</button>';
        });
        pageHtml += '</div>';
      }

      that.layPage.innerHTML = pageHtml;

      // 페이지 클릭
      that.layPage.querySelectorAll('[data-page]').forEach(function(btn){
        btn.addEventListener('click', function(){
          if(btn.classList.contains(DISABLED)) return;
          var p = parseInt(btn.getAttribute('data-page'));
          if(p >= 1 && p <= pages){
            that.page = p;
            that.pullData(p);
          }
        });
      });

      // 페이지당 개수
      var select = that.layPage.querySelector('.cui-table-page-select');
      if(select){
        select.addEventListener('change', function(){
          that.config.limit = parseInt(select.value);
          that.page = 1;
          that.pullData(1);
        });
      }

      // 하단 버튼 클릭
      that.bindPageBtns();
    }
  };

  // 하단 버튼 이벤트 바인딩
  Class.prototype.bindPageBtns = function(){
    var that = this
    ,config = that.config;

    that.layPage.querySelectorAll('[data-btn-idx]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var idx = parseInt(btn.getAttribute('data-btn-idx'));
        var btnConfig = config.pageBtns[idx];
        
        if(typeof btnConfig === 'object' && typeof btnConfig.callback === 'function'){
          btnConfig.callback(that);
        }
        
        if(window.Catui && Catui.event){
          Catui.event(MOD_NAME, 'pageBtn(' + that.key + ')', { 
            index: idx
            ,text: btn.textContent
            ,table: that
          });
        }
      });
    });
  };

  // 열 너비 설정
  Class.prototype.setColsWidth = function(){
    var that = this
    ,config = that.config;

    var containerWidth = that.layView.offsetWidth;
    var totalWidth = 0;
    var autoWidthCols = [];

    // 고정 너비 합계
    var lastRow = config.cols[config.cols.length - 1] || [];
    lastRow.forEach(function(col, idx){
      if(col.hide) return;
      if(col.width){
        totalWidth += col.width;
      } else {
        autoWidthCols.push({ col: col, idx: idx });
      }
    });

    // 자동 너비 분배
    if(autoWidthCols.length > 0){
      var remainWidth = containerWidth - totalWidth - 2;
      var autoWidth = Math.floor(remainWidth / autoWidthCols.length);
      autoWidth = Math.max(autoWidth, config.cellMinWidth);

      autoWidthCols.forEach(function(item){
        item.col.width = autoWidth;
      });

      // 스타일 업데이트
      var style = that.layView.querySelector('style');
      if(style){
        var css = '';
        config.cols.forEach(function(row, i1){
          row.forEach(function(col, i2){
            if(!col) return;
            css += '.cuitbl-cell-' + that.index + '-' + i1 + '-' + i2 + '{';
            if(col.width){
              css += 'width:' + col.width + 'px;';
            }
            css += '}';
          });
        });
        style.textContent = css;
      }
    }

    // colgroup 업데이트
    var updateColgroup = function(table){
      var cols = table.querySelectorAll('colgroup col');
      lastRow.forEach(function(col, idx){
        if(cols[idx]){
          cols[idx].style.width = col.width ? col.width + 'px' : '';
        }
      });
    };

    updateColgroup(that.layHeader.querySelector('table'));
    updateColgroup(that.layBody.querySelector('table'));
  };

  // 이벤트 바인딩
  Class.prototype.bindEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,checkName = table.config.checkName;

    // 행 hover
    that.layTbody.querySelectorAll('tr').forEach(function(tr){
      tr.addEventListener('mouseenter', function(){
        tr.classList.add('cui-table-hover');
      });
      tr.addEventListener('mouseleave', function(){
        tr.classList.remove('cui-table-hover');
      });
    });

    // 셀 오버플로우 효과 (마우스 진입 시 버튼 표시)
    that.layTbody.querySelectorAll('td').forEach(function(td){
      var cell = td.querySelector('.cui-table-cell');
      if(!cell) return;

      td.addEventListener('mouseenter', function(){
        // 오버플로우 체크
        if(cell.scrollWidth > cell.clientWidth){
          if(td.querySelector('.cui-table-grid-down')) return;
          
          var moreBtn = document.createElement('div');
          moreBtn.className = 'cui-table-grid-down';
          moreBtn.innerHTML = '<i class="cui-icon">expand_more</i>';
          td.appendChild(moreBtn);
          
          moreBtn.addEventListener('click', function(e){
            e.stopPropagation();
            that.showCellTips(cell, td);
          });
        }
      });

      td.addEventListener('mouseleave', function(){
        var moreBtn = td.querySelector('.cui-table-grid-down');
        if(moreBtn) moreBtn.remove();
      });
    });

    // 행 클릭 (단일/더블)
    that.layTbody.querySelectorAll('tr').forEach(function(tr){
      // 단일 클릭
      tr.addEventListener('click', function(e){
        if(e.target.type === 'checkbox' || e.target.type === 'radio') return;
        if(e.target.closest('[cui-event]')) return; // tool 버튼 클릭 시 제외
        
        var idx = parseInt(tr.getAttribute('data-index'));
        var currentData = table.cache[that.key] || [];
        if(!currentData[idx]) return;
        
        if(window.Catui && Catui.event){
          Catui.event(MOD_NAME, 'row(' + that.key + ')', that.getCommonMember(idx));
        }
      });
      
      // 더블 클릭
      tr.addEventListener('dblclick', function(e){
        if(e.target.type === 'checkbox' || e.target.type === 'radio') return;
        
        var idx = parseInt(tr.getAttribute('data-index'));
        
        if(window.Catui && Catui.event){
          Catui.event(MOD_NAME, 'rowDouble(' + that.key + ')', that.getCommonMember(idx));
        }
      });
    });

    // 행 도구 버튼 (cui-event)
    that.layTbody.querySelectorAll('[cui-event]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        var tr = btn.closest('tr');
        var idx = parseInt(tr.getAttribute('data-index'));
        var event = btn.getAttribute('cui-event');
        
        if(window.Catui && Catui.event){
          Catui.event(MOD_NAME, 'tool(' + that.key + ')', that.getCommonMember(idx, { event: event }));
        }
      });
    });

    // 체크박스
    that.layTbody.querySelectorAll('.cui-table-checkbox').forEach(function(cb){
      cb.addEventListener('change', function(){
        var tr = cb.closest('tr');
        var idx = parseInt(tr.getAttribute('data-index'));
        var currentData = table.cache[that.key] || [];
        var item = currentData[idx];
        
        if(item){
          item[checkName] = cb.checked;
        }
        tr.classList.toggle(CHECKED, cb.checked);
        
        that.updateCheckAll();
        
        if(window.Catui && Catui.event){
          Catui.event(MOD_NAME, 'checkbox(' + that.key + ')', that.getCommonMember(idx, {
            checked: cb.checked
            ,type: 'one'
          }));
        }
      });
    });

    // 셀 편집 (data-edit 속성이 있는 셀)
    that.layTbody.querySelectorAll('td[data-edit]').forEach(function(td){
      td.addEventListener('click', function(e){
        if(td.querySelector('.cui-table-edit')) return;
        
        var field = td.getAttribute('data-field');
        var tr = td.closest('tr');
        var idx = parseInt(tr.getAttribute('data-index'));
        var editData = table.cache[that.key] || [];
        var item = editData[idx];
        if(!item) return;
        var cell = td.querySelector('.cui-table-cell');
        var oldValue = item[field] || '';
        
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'cui-input cui-table-edit';
        input.value = oldValue;
        input.style.cssText = 'width:100%;height:100%;position:absolute;left:0;top:0;';
        
        td.style.position = 'relative';
        td.appendChild(input);
        input.focus();
        input.select();
        
        var finishEdit = function(){
          var newValue = input.value;
          input.remove();
          
          if(newValue !== oldValue){
            item[field] = newValue;
            cell.textContent = newValue;
            
            if(window.Catui && Catui.event){
              Catui.event(MOD_NAME, 'edit(' + that.key + ')', that.getCommonMember(idx, {
                field: field
                ,value: newValue
                ,oldValue: oldValue
              }));
            }
          }
        };
        
        input.addEventListener('blur', finishEdit);
        input.addEventListener('keydown', function(e){
          if(e.key === 'Enter') finishEdit();
          if(e.key === 'Escape') input.remove();
        });
      });
    });

    // 전체 선택
    var checkAll = that.layHeader.querySelector('.cui-table-checkbox-all');
    if(checkAll){
      checkAll.addEventListener('change', function(){
        var checked = checkAll.checked;
        var allData = table.cache[that.key] || [];
        
        allData.forEach(function(item){
          item[checkName] = checked;
        });
        
        that.layTbody.querySelectorAll('.cui-table-checkbox').forEach(function(cb){
          cb.checked = checked;
          var tr = cb.closest('tr');
          tr.classList.toggle(CHECKED, checked);
        });
        
        if(window.Catui && Catui.event){
          Catui.event(MOD_NAME, 'checkbox(' + that.key + ')', { 
            data: allData
            ,checked: checked
            ,type: 'all'
          });
        }
      });
    }

    // 정렬
    that.layHeader.querySelectorAll('.' + ELEM_SORT).forEach(function(sortWrap){
      var th = sortWrap.closest('th');
      var field = th.getAttribute('data-field');
      
      sortWrap.querySelectorAll('.cui-icon').forEach(function(icon){
        icon.addEventListener('click', function(){
          var type = icon.classList.contains('cui-table-sort-asc') ? 'asc' : 'desc';
          that.sort(field, type);
        });
      });
    });

    // 툴바 이벤트
    var toolSelf = that.layView.querySelector('.' + ELEM_TOOL + '-self');
    if(toolSelf){
      toolSelf.querySelectorAll('[cui-event]').forEach(function(btn){
        btn.addEventListener('click', function(e){
          e.stopPropagation();
          var event = btn.getAttribute('cui-event');
          
          // 기본 툴바 기능
          if(event === 'LAYTABLE_COLS'){
            that.openColsPanel(btn);
          } else if(event === 'LAYTABLE_EXPORT'){
            that.exportData();
          } else if(event === 'LAYTABLE_PRINT'){
            that.printTable();
          }
          
          if(window.Catui && Catui.event){
            Catui.event(MOD_NAME, 'toolbar(' + that.key + ')', { event: event });
          }
        });
      });
    }
  };

  // 열 필터 패널 열기
  Class.prototype.openColsPanel = function(btn){
    var that = this
    ,config = that.config;

    // 기존 패널 제거
    var existPanel = that.layView.querySelector('.cui-table-tool-panel');
    if(existPanel){
      existPanel.remove();
      return;
    }

    var panel = document.createElement('div');
    panel.className = 'cui-table-tool-panel';
    
    var lastRow = config.cols[config.cols.length - 1] || [];
    var html = '<ul>';
    lastRow.forEach(function(col, idx){
      if(col.type && col.type !== 'normal') return;
      var title = col.title || col.field || '';
      var checked = !col.hide ? ' checked' : '';
      html += '<li>';
      html += '<input type="checkbox" data-key="' + idx + '"' + checked + '>';
      html += '<span>' + title + '</span>';
      html += '</li>';
    });
    html += '</ul>';
    panel.innerHTML = html;

    btn.parentNode.appendChild(panel);

    // 체크박스 이벤트
    panel.querySelectorAll('input[type="checkbox"]').forEach(function(cb){
      cb.addEventListener('change', function(){
        var key = parseInt(cb.getAttribute('data-key'));
        var col = lastRow[key];
        if(col){
          col.hide = !cb.checked;
          that.toggleCol(key, cb.checked);
        }
      });
    });

    // 외부 클릭 시 닫기
    setTimeout(function(){
      document.addEventListener('click', function closePanel(e){
        if(!panel.contains(e.target) && !btn.contains(e.target)){
          panel.remove();
          document.removeEventListener('click', closePanel);
        }
      });
    }, 0);
  };

  // 열 표시/숨김
  Class.prototype.toggleCol = function(idx, show){
    var that = this;
    // var selector = 'td[data-field], th[data-field]';
    
    // 해당 열의 모든 셀
    that.layView.querySelectorAll('col[data-key$="-' + idx + '"]').forEach(function(col){
      col.style.display = show ? '' : 'none';
    });
    
    var lastRow = that.config.cols[that.config.cols.length - 1] || [];
    var field = lastRow[idx] ? lastRow[idx].field : null;
    
    if(field){
      that.layView.querySelectorAll('[data-field="' + field + '"]').forEach(function(cell){
        cell.style.display = show ? '' : 'none';
      });
    }
  };

  // 데이터 내보내기
  Class.prototype.exportData = function(customData){
    var that = this
    ,config = that.config
    ,data = customData || table.cache[that.key] || [];

    var csvContent = '';
    var lastRow = config.cols[config.cols.length - 1] || [];
    
    // 헤더
    var headers = [];
    lastRow.forEach(function(col){
      if(col.type && col.type !== 'normal') return;
      if(col.hide) return;
      headers.push(col.title || col.field || '');
    });
    csvContent += headers.join(',') + '\n';
    
    // 데이터
    data.forEach(function(item){
      var row = [];
      lastRow.forEach(function(col){
        if(col.type && col.type !== 'normal') return;
        if(col.hide) return;
        var val = item[col.field];
        if(val === undefined || val === null) val = '';
        // CSV 특수문자 이스케이프
        val = String(val).replace(/"/g, '""');
        if(val.indexOf(',') > -1 || val.indexOf('\n') > -1){
          val = '"' + val + '"';
        }
        row.push(val);
      });
      csvContent += row.join(',') + '\n';
    });

    // 다운로드
    var blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table_data_' + Date.now() + '.csv';
    link.click();
    
    if(window.Catui && Catui.popup){
      Catui.popup.msg('CSV 파일로 내보내기 완료');
    }
  };

  // 테이블 인쇄
  Class.prototype.printTable = function(){
    var that = this;
    
    var printWin = window.open('', '_blank');
    
    // 테이블 HTML 복사 후 아이콘 제거
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = that.layView.querySelector('.cui-table-box').innerHTML;
    
    // 아이콘, 정렬 버튼, 로딩 등 제거
    tempDiv.querySelectorAll('.cui-icon, .cui-table-sort, .cui-table-loading, .cui-table-grid-down').forEach(function(el){
      el.remove();
    });
    
    var tableHtml = tempDiv.innerHTML;
    
    printWin.document.write('<html><head><title>테이블 인쇄</title>');
    printWin.document.write('<style>');
    printWin.document.write('body{font-family:"Malgun Gothic",sans-serif;padding:20px;}');
    printWin.document.write('table{width:100%;border-collapse:collapse;}');
    printWin.document.write('th,td{border:1px solid #ddd;padding:8px;text-align:left;}');
    printWin.document.write('th{background:#f5f5f5;}');
    printWin.document.write('</style></head><body>');
    printWin.document.write(tableHtml);
    printWin.document.write('</body></html>');
    printWin.document.close();
    
    printWin.onload = function(){
      printWin.print();
    };
  };

  // 공통 멤버 객체 생성 (이벤트 콜백용)
  Class.prototype.getCommonMember = function(index, extend){
    var that = this
    ,data = table.cache[that.key] || []
    ,item = data[index] || {}
    ,tr = that.layTbody.querySelector('tr[data-index="' + index + '"]');

    return Object.assign({
      tr: tr
      ,data: Object.assign({}, item)  // 복사본 반환
      ,index: index
      // 행 삭제
      ,del: function(){
        data.splice(index, 1);
        if(tr) tr.remove();
        // 캐시 내 인덱스 재설정
        data.forEach(function(item, i){
          item[table.config.indexName] = i;
        });
        // DOM 인덱스 재설정
        that.layTbody.querySelectorAll('tr:not(.cui-table-total)').forEach(function(row, i){
          row.setAttribute('data-index', i);
        });
      }
      // 행 수정
      ,update: function(fields){
        fields = fields || {};
        for(var key in fields){
          item[key] = fields[key];
          var td = tr ? tr.querySelector('td[data-field="' + key + '"]') : null;
          if(td){
            var cell = td.querySelector('.cui-table-cell');
            if(cell) cell.textContent = fields[key];
          }
        }
      }
      // 선택 상태 설정
      ,setRowChecked: function(checked){
        var checkName = table.config.checkName;
        item[checkName] = checked;
        var cb = tr ? tr.querySelector('.cui-table-checkbox') : null;
        if(cb) cb.checked = checked;
        if(tr) tr.classList.toggle(CHECKED, checked);
        that.updateCheckAll();
      }
    }, extend || {});
  };

  // 전체 선택 상태 업데이트
  Class.prototype.updateCheckAll = function(){
    var that = this
    ,checkName = table.config.checkName
    ,data = table.cache[that.key] || [];

    var checkAll = that.layHeader.querySelector('.cui-table-checkbox-all');
    if(!checkAll) return;

    var allChecked = data.length > 0;
    data.forEach(function(item){
      if(!item[checkName]) allChecked = false;
    });
    
    checkAll.checked = allChecked;
  };

  // 정렬
  Class.prototype.sort = function(field, type){
    var that = this
    ,config = that.config
    ,data = table.cache[that.key] || [];

    that.sortKey = { field: field, type: type };

    // 정렬 아이콘 표시
    that.layHeader.querySelectorAll('.' + ELEM_SORT + ' .cui-icon').forEach(function(icon){
      icon.classList.remove(THIS);
    });
    
    var th = that.layHeader.querySelector('th[data-field="' + field + '"]');
    if(th){
      var icon = th.querySelector('.cui-table-sort-' + type);
      if(icon) icon.classList.add(THIS);
    }

    // 자동 정렬
    if(config.autoSort){
      data.sort(function(a, b){
        var va = a[field], vb = b[field];
        
        // 숫자 비교
        if(!isNaN(va) && !isNaN(vb)){
          return type === 'asc' ? va - vb : vb - va;
        }
        
        // 문자열 비교
        va = String(va || '');
        vb = String(vb || '');
        return type === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });

      // 다시 렌더링
      var res = {};
      res[config.response.dataName] = data;
      res[config.response.countName] = that.count;
      that.renderData(res, that.page, that.count);
    }

    // 이벤트
    if(window.Catui && Catui.event){
      Catui.event(MOD_NAME, 'sort(' + that.key + ')', { field: field, type: type });
    }
  };

  // 셀 전체 내용 팝업
  Class.prototype.showCellTips = function(cell, td){
    var that = this
    ,config = that.config;

    // 기존 팝업 제거
    var existTips = document.querySelector('.cui-table-tips');
    if(existTips) existTips.remove();

    var content = cell.innerHTML;
    var rect = td.getBoundingClientRect();
    var cellHeight = cell.offsetHeight;

    var tips = document.createElement('div');
    tips.className = 'cui-table-tips';
    tips.innerHTML = [
      '<div class="cui-table-tips-main" style="margin-top:-' + (cellHeight + 16) + 'px;">' + content + '</div>',
      '<i class="cui-icon cui-table-tips-close">close</i>'
    ].join('');

    // 위치 설정 (셀 위치 기준)
    var maxWidth = Math.min(500, window.innerWidth / 2);
    tips.style.cssText = 'position:fixed;left:' + rect.left + 'px;top:' + (rect.top + rect.height) + 'px;max-width:' + maxWidth + 'px;z-index:19999999;';

    document.body.appendChild(tips);

    // 닫기 버튼
    tips.querySelector('.cui-table-tips-close').addEventListener('click', function(){
      tips.remove();
    });

    // 외부 클릭 시 닫기
    setTimeout(function(){
      document.addEventListener('click', function closeTips(e){
        if(!tips.contains(e.target)){
          tips.remove();
          document.removeEventListener('click', closeTips);
        }
      });
    }, 0);
  };

  // 로딩 표시
  Class.prototype.showLoading = function(){
    if(this.loading) this.loading.style.display = 'flex';
  };

  Class.prototype.hideLoading = function(){
    if(this.loading) this.loading.style.display = 'none';
  };

  // 오류 표시
  Class.prototype.renderError = function(msg){
    var that = this
    ,config = that.config;

    var colspan = 0;
    var lastRow = config.cols[config.cols.length - 1] || [];
    lastRow.forEach(function(col){
      if(!col.colGroup && !col.hide) colspan++;
    });

    that.layTbody.innerHTML = '<tr><td colspan="' + colspan + '"><div class="' + ELEM_NONE + ' cui-table-error">' + msg + '</div></td></tr>';
  };

  // 리로드
  Class.prototype.reload = function(options, deep){
    var that = this
    ,$c = get$c();

    options = options || {};
    
    // where 조건이 변경되면 캐시 초기화
    if(options.where || options.url){
      delete table.cache[that.key];
    }
    
    // 페이지 초기화 옵션
    if(options.page && options.page.curr){
      that.page = options.page.curr;
    }
    
    if(deep){
      that.config = $c.extend(true, {}, that.config, options);
    } else {
      that.config = $c.extend({}, that.config, options);
    }

    that.render();
  };

  // HTML 테이블 자동 변환 (init)
  table.init = function(filter){
    var $c = get$c();
    if(!$c) return;

    var tables = document.querySelectorAll('table[cui-filter' + (filter ? '="' + filter + '"' : '') + ']');
    
    tables.forEach(function(elem){
      if(elem.getAttribute('cui-rendered')) return;
      elem.setAttribute('cui-rendered', 'true');

      var tableData = elem.getAttribute('cui-data') || '{}';
      
      try {
        var options = new Function('return ' + tableData)();
      } catch(e){
        console.error('table cui-data parse error:', e);
        return;
      }

      options.elem = elem;
      options.cols = [[]];
      options.data = [];

      // 헤더 파싱
      var ths = elem.querySelectorAll('thead th');
      ths.forEach(function(th){
        var colData = th.getAttribute('cui-data') || '{}';
        try {
          var col = new Function('return ' + colData)();
          col.title = col.title || th.textContent.trim();
          options.cols[0].push(col);
        } catch(_e){
          options.cols[0].push({ title: th.textContent.trim() });
        }
      });

      // 바디 파싱
      var trs = elem.querySelectorAll('tbody tr');
      trs.forEach(function(tr){
        var row = {};
        var tds = tr.querySelectorAll('td');
        tds.forEach(function(td, i){
          var field = options.cols[0][i] ? options.cols[0][i].field : 'col' + i;
          if(!options.cols[0][i]) options.cols[0][i] = { field: field };
          if(!options.cols[0][i].field) options.cols[0][i].field = 'col' + i;
          row[options.cols[0][i].field] = td.innerHTML.trim();
        });
        options.data.push(row);
      });

      // 기존 테이블 숨기기
      elem.style.display = 'none';

      // Catui 테이블 렌더링
      table.render(options);
    });
  };

  // 전역 노출
  window.table = table;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = table;
  }

  // DOM 로드 후 자동 초기화
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      table.init();
    });
  } else {
    setTimeout(function(){ table.init(); }, 0);
  }

}(window);
