/*!
 * Catui date - 날짜/시간 선택 컴포넌트
 * Based on laydate.js, jQuery-free
 * MIT Licensed
 */

!function(window, document){
  "use strict";

  var MOD_NAME = 'date'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 날짜 인덱스
  ,index = 0

  // 인스턴스 저장
  ,instances = {}

  // 상수
  ,_ELEM = '.cui-date'
  ,THIS = 'cui-this'
  ,_SHOW = 'cui-show'
  ,DISABLED = 'cui-date-disabled'
  ,ELEM_STATIC = 'cui-date-static'

  // 날짜 형식 문자
  ,_dateType = 'yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s';

  // 날짜 선택기 인터페이스
  var date = {
    v: '1.0.0'
    ,config: {}
    ,index: 0

    // 전역 설정
    ,set: function(options){
      var $c = get$c();
      this.config = $c.extend({}, this.config, options);
      return this;
    }

    // 렌더
    ,render: function(options){
      var inst = new Class(options);
      return inst && inst.index ? instances[inst.index] : inst;
    }

    // 인스턴스 가져오기
    ,getInst: function(id){
      return instances[id];
    }

    // 모두 닫기
    ,closeAll: function(){
      for(var id in instances){
        if(instances[id] && instances[id].remove){
          instances[id].remove();
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
    that.config = $c.extend({}, that.defaults, date.config, options);
    
    // ID 초기화
    var config = that.config;
    config.id = config.id || that.index;
    
    instances[that.index] = that;
    that.init();
  };

  // 윤년 체크
  Class.isLeapYear = function(year){
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  // 기본 설정
  Class.prototype.defaults = {
    type: 'date'          // year, month, date, time, datetime
    ,range: false         // 범위 선택
    ,format: 'yyyy-MM-dd' // 날짜 형식
    ,value: null          // 기본값
    ,isInitValue: true    // 초기값 자동 설정
    ,min: '1900-1-1'      // 최소 날짜
    ,max: '2099-12-31'    // 최대 날짜
    ,trigger: 'click'     // 트리거 이벤트
    ,show: false          // 바로 표시
    ,showBottom: true     // 하단 버튼 표시
    ,btns: ['clear', 'now', 'confirm']
    ,theme: 'default'
    ,position: null       // fixed, absolute, static
    ,calendar: false      // 공휴일 표시
    ,mark: {}             // 날짜 마크
    ,zIndex: 19920504
    ,done: null           // 완료 콜백
    ,change: null         // 변경 콜백
    ,ready: null          // 준비 콜백
  };

  // 언어 설정
  Class.prototype.lang = function(){
    return {
      weeks: ['일', '월', '화', '수', '목', '금', '토']
      ,time: ['시', '분', '초']
      ,timeTips: '시간 선택'
      ,startTime: '시작 시간'
      ,endTime: '종료 시간'
      ,dateTips: '날짜로 돌아가기'
      ,month: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
      ,tools: {
        confirm: '확인'
        ,clear: '초기화'
        ,now: '현재'
      }
      ,timeout: '종료 시간이 시작 시간보다 빠릅니다'
      ,invalidDate: '유효하지 않은 날짜입니다'
      ,preview: '선택된 날짜'
    };
  };

  // 초기화
  Class.prototype.init = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,isStatic = config.position === 'static';

    // 기본 형식 설정
    var format = {
      year: 'yyyy'
      ,month: 'yyyy-MM'
      ,date: 'yyyy-MM-dd'
      ,time: 'HH:mm:ss'
      ,datetime: 'yyyy-MM-dd HH:mm:ss'
    };

    config.elem = $c(config.elem);
    if(!config.elem[0]) return;

    // 범위 분리자
    that.rangeStr = config.range ? (typeof config.range === 'string' ? config.range : ' ~ ') : '';

    // 형식 자동 설정
    if(config.format === 'yyyy-MM-dd'){
      config.format = format[config.type] || format.date;
    }

    // 최소/최대 날짜 파싱
    ['min', 'max'].forEach(function(item){
      var ymd = [], hms = [];
      if(typeof config[item] === 'number'){
        var day = config[item]
        ,time = new Date().getTime()
        ,STAMP = 86400000
        ,thisDate = new Date(day ? (day < STAMP ? time + day*STAMP : day) : time);
        ymd = [thisDate.getFullYear(), thisDate.getMonth() + 1, thisDate.getDate()];
        day < STAMP || (hms = [thisDate.getHours(), thisDate.getMinutes(), thisDate.getSeconds()]);
      } else {
        ymd = (config[item].match(/\d+-\d+-\d+/) || [''])[0].split('-');
        hms = (config[item].match(/\d+:\d+:\d+/) || [''])[0].split(':');
      }
      config[item] = {
        year: ymd[0] | 0 || new Date().getFullYear()
        ,month: ymd[1] ? (ymd[1] | 0) - 1 : new Date().getMonth()
        ,date: ymd[2] | 0 || new Date().getDate()
        ,hours: hms[0] | 0
        ,minutes: hms[1] | 0
        ,seconds: hms[2] | 0
      };
    });

    that.elemID = 'cui-date-' + that.index;

    // 이벤트 바인딩
    if(!config.elem[0]._bindDate){
      config.elem[0]._bindDate = true;
      that.bindEvents();
    }

    // 바로 표시
    if(config.show || isStatic){
      that.render();
    }

    // 초기값 설정
    if(config.value && config.isInitValue){
      if(config.value instanceof Date){
        that.setValue(that.formatDate(config.value));
      } else {
        that.setValue(config.value);
      }
    }
  };

  // 이벤트 바인딩
  Class.prototype.bindEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    config.elem.on(config.trigger, function(e){
      if(that.isOpen) return;
      that.render();
      e.stopPropagation();
    });
  };

  // 날짜 포맷
  Class.prototype.formatDate = function(dateObj, format){
    var that = this
    ,config = that.config;
    
    format = format || config.format;
    
    if(!dateObj) return '';
    
    var d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    
    var map = {
      'yyyy': d.getFullYear()
      ,'MM': ('0' + (d.getMonth() + 1)).slice(-2)
      ,'M': d.getMonth() + 1
      ,'dd': ('0' + d.getDate()).slice(-2)
      ,'d': d.getDate()
      ,'HH': ('0' + d.getHours()).slice(-2)
      ,'H': d.getHours()
      ,'mm': ('0' + d.getMinutes()).slice(-2)
      ,'m': d.getMinutes()
      ,'ss': ('0' + d.getSeconds()).slice(-2)
      ,'s': d.getSeconds()
    };
    
    return format.replace(/yyyy|MM|M|dd|d|HH|H|mm|m|ss|s/g, function(match){
      return map[match];
    });
  };

  // 문자열 → Date 파싱
  Class.prototype.parseDate = function(str){
    if(!str) return new Date();
    if(str instanceof Date) return str;
    
    var parts = str.match(/\d+/g) || [];
    return new Date(
      parts[0] || new Date().getFullYear()
      ,(parts[1] || 1) - 1
      ,parts[2] || 1
      ,parts[3] || 0
      ,parts[4] || 0
      ,parts[5] || 0
    );
  };

  // 값 설정
  Class.prototype.setValue = function(value){
    var that = this
    ,config = that.config
    ,elem = config.elem[0];

    if(elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA'){
      elem.value = value;
    } else {
      elem.innerHTML = value;
    }
    
    that.currentValue = value;
  };

  // 값 가져오기
  Class.prototype.getValue = function(){
    var that = this
    ,config = that.config
    ,elem = config.elem[0];

    if(elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA'){
      return elem.value;
    }
    return elem.innerHTML;
  };

  // 달력 패널 HTML 생성
  Class.prototype.buildPanel = function(panelIndex){
    var that = this
    ,lang = that.lang()
    ,config = that.config;

    var html = '<div class="cui-date-panel" data-index="' + panelIndex + '">';
    
    // 헤더
    html += '<div class="cui-date-header">'
      + '<i class="cui-icon cui-date-prev-y" title="이전 년">keyboard_double_arrow_left</i>'
      + '<i class="cui-icon cui-date-prev-m" title="이전 월">chevron_left</i>'
      + '<div class="cui-date-ym">'
      + '<span class="cui-date-y"></span>'
      + '<span class="cui-date-m"></span>'
      + '</div>'
      + '<i class="cui-icon cui-date-next-m" title="다음 월">chevron_right</i>'
      + '<i class="cui-icon cui-date-next-y" title="다음 년">keyboard_double_arrow_right</i>'
      + '</div>';

    // 콘텐츠
    html += '<div class="cui-date-content">';
    html += '<table class="cui-date-table"><thead><tr>';
    lang.weeks.forEach(function(w){
      html += '<th>' + w + '</th>';
    });
    html += '</tr></thead><tbody></tbody></table>';
    html += '</div>';

    html += '</div>';
    return html;
  };

  // 렌더링
  Class.prototype.render = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,lang = that.lang()
    ,isStatic = config.position === 'static'
    ,isRange = config.range;

    // 현재 날짜 설정
    var currentValue = that.getValue();
    
    // 범위 선택 시 시작/종료 날짜 파싱
    if(isRange && currentValue && currentValue.indexOf(that.rangeStr) > -1){
      var rangeValues = currentValue.split(that.rangeStr);
      that.rangeDate = [
        rangeValues[0] ? that.parseDate(rangeValues[0]) : null,
        rangeValues[1] ? that.parseDate(rangeValues[1]) : null
      ];
    } else {
      that.rangeDate = [null, null];
    }

    that.dateTime = that.parseDate(currentValue);
    that.startDate = {
      year: that.dateTime.getFullYear()
      ,month: that.dateTime.getMonth()
      ,date: that.dateTime.getDate()
      ,hours: that.dateTime.getHours()
      ,minutes: that.dateTime.getMinutes()
      ,seconds: that.dateTime.getSeconds()
    };

    // 범위 선택: 두 번째 패널 날짜 (다음 달)
    if(isRange){
      var nextMonth = that.startDate.month + 1;
      var nextYear = that.startDate.year;
      if(nextMonth > 11){
        nextMonth = 0;
        nextYear++;
      }
      that.endDate = {
        year: nextYear
        ,month: nextMonth
        ,date: 1
      };
      that.rangeState = 0; // 0: 시작일 선택, 1: 종료일 선택
    }

    // 기존 제거
    that.remove();

    // 컨테이너 생성
    var elem = that.elem = document.createElement('div');
    elem.id = that.elemID;
    elem.className = 'cui-date' + (isStatic ? ' ' + ELEM_STATIC : '') 
      + (isRange ? ' cui-date-range' : '')
      + (config.theme !== 'default' ? ' cui-date-theme-' + config.theme : '');
    
    if(config.zIndex) elem.style.zIndex = config.zIndex;

    // HTML 생성
    var html = '';

    if(isRange){
      // 범위 선택: 두 개의 패널
      html += '<div class="cui-date-main">';
      html += that.buildPanel(0);
      html += that.buildPanel(1);
      html += '</div>';
    } else {
      // 단일 선택
      html += that.buildPanel(0);
    }

    // 시간 선택 (time, datetime)
    if(config.type === 'time' || config.type === 'datetime'){
      html += '<div class="cui-date-time">'
        + '<div class="cui-date-time-header">' + lang.timeTips + '</div>'
        + '<div class="cui-date-time-content">'
        + '<input type="text" class="cui-date-time-input cui-date-hour" maxlength="2" placeholder="00">:'
        + '<input type="text" class="cui-date-time-input cui-date-minute" maxlength="2" placeholder="00">:'
        + '<input type="text" class="cui-date-time-input cui-date-second" maxlength="2" placeholder="00">'
        + '</div></div>';
    }

    // 하단 버튼
    if(config.showBottom){
      html += '<div class="cui-date-footer">';
      if(config.type === 'datetime'){
        html += '<span class="cui-date-btn-time">' + lang.timeTips + '</span>';
      }
      if(isRange){
        html += '<span class="cui-date-range-text"></span>';
      }
      html += '<div class="cui-date-btns">';
      config.btns.forEach(function(btn){
        if(isRange && btn === 'now') return;
        html += '<span class="cui-date-btn cui-date-btn-' + btn + '">' + lang.tools[btn] + '</span>';
      });
      html += '</div></div>';
    }

    elem.innerHTML = html;

    // DOM에 추가
    if(isStatic){
      config.elem[0].appendChild(elem);
    } else {
      document.body.appendChild(elem);
      that.position();
    }

    that.isOpen = true;
    that.calendar();
    that.bindCalendarEvents();

    // ready 콜백
    if(typeof config.ready === 'function'){
      config.ready(that.startDate);
    }
  };

  // 위치 계산
  Class.prototype.position = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,elem = that.elem
    ,target = config.elem[0];

    var rect = target.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    var top = rect.bottom + scrollTop + 5;
    var left = rect.left + scrollLeft;

    // 화면 밖 체크
    var winH = window.innerHeight;
    var elemH = elem.offsetHeight;
    if(rect.bottom + elemH > winH && rect.top > elemH){
      top = rect.top + scrollTop - elemH - 5;
    }

    elem.style.position = config.position || 'absolute';
    elem.style.top = top + 'px';
    elem.style.left = left + 'px';
  };

  // 달력 그리기
  Class.prototype.calendar = function(panelIndex){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,lang = that.lang()
    ,isRange = config.range;

    // 범위 선택: 두 패널 모두 업데이트
    if(isRange && panelIndex === undefined){
      that.calendar(0);
      that.calendar(1);
      that.updateRangeText();
      return;
    }

    var dateObj = panelIndex === 1 ? that.endDate : that.startDate;
    var year = dateObj.year;
    var month = dateObj.month;
    
    var panel = isRange 
      ? $c(that.elem).find('.cui-date-panel[data-index="' + panelIndex + '"]')
      : $c(that.elem).find('.cui-date-panel');

    // 헤더 업데이트
    panel.find('.cui-date-y').html(year + '년');
    panel.find('.cui-date-m').html(lang.month[month]);

    // 시간 업데이트 (단일 선택 시)
    if(!isRange && (config.type === 'time' || config.type === 'datetime')){
      $c(that.elem).find('.cui-date-hour').val(('0' + that.startDate.hours).slice(-2));
      $c(that.elem).find('.cui-date-minute').val(('0' + that.startDate.minutes).slice(-2));
      $c(that.elem).find('.cui-date-second').val(('0' + that.startDate.seconds).slice(-2));
    }

    // 타입별 처리 (단일 선택 시)
    if(!isRange){
      if(config.type === 'year'){
        that.renderYearList();
        return;
      }
      if(config.type === 'month'){
        that.renderMonthList();
        return;
      }
      if(config.type === 'time'){
        $c(that.elem).find('.cui-date-content').css('display', 'none');
        $c(that.elem).find('.cui-date-time').addClass('cui-date-time-only');
        return;
      }
    }

    // 달력 그리기
    var firstDay = new Date(year, month, 1).getDay();
    var lastDate = new Date(year, month + 1, 0).getDate();
    var prevLastDate = new Date(year, month, 0).getDate();
    
    var today = new Date();
    var todayStr = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();

    var tbody = panel.find('.cui-date-table tbody');
    var html = '';
    var day = 1;
    var nextDay = 1;

    for(var i = 0; i < 6; i++){
      html += '<tr>';
      for(var j = 0; j < 7; j++){
        var cls = '';
        var dateStr = '';
        var num = 0;
        var cellYear = year, cellMonth = month;
        
        if(i === 0 && j < firstDay){
          // 이전 달
          num = prevLastDate - firstDay + j + 1;
          cls = 'cui-date-prev';
          cellYear = month === 0 ? year - 1 : year;
          cellMonth = month === 0 ? 11 : month - 1;
        } else if(day > lastDate){
          // 다음 달
          num = nextDay++;
          cls = 'cui-date-next';
          cellYear = month === 11 ? year + 1 : year;
          cellMonth = month === 11 ? 0 : month + 1;
        } else {
          // 이번 달
          num = day++;
          
          // 오늘
          var cellStr = year + '-' + month + '-' + num;
          if(cellStr === todayStr){
            cls = 'cui-date-now';
          }
        }

        dateStr = cellYear + '-' + cellMonth + '-' + num;
        var cellDate = new Date(cellYear, cellMonth, num);

        // 범위 선택 시 하이라이트
        if(isRange && that.rangeDate[0] && that.rangeDate[1]){
          var start = that.rangeDate[0].getTime();
          var end = that.rangeDate[1].getTime();
          var current = cellDate.getTime();
          
          if(current === start){
            cls += ' cui-date-range-start';
          } else if(current === end){
            cls += ' cui-date-range-end';
          } else if(current > start && current < end){
            cls += ' cui-date-range-in';
          }
        } else if(isRange && that.rangeDate[0]){
          if(cellDate.getTime() === that.rangeDate[0].getTime()){
            cls += ' cui-date-range-start';
          }
        }

        // 단일 선택: 선택된 날짜
        if(!isRange){
          var selectedDate = that.dateTime;
          if(selectedDate && cellYear === selectedDate.getFullYear() && cellMonth === selectedDate.getMonth() && num === selectedDate.getDate()){
            cls += ' ' + THIS;
          }
        }

        // 범위 체크
        if(that.isDisabled(cellYear, cellMonth, num, cls)){
          cls += ' ' + DISABLED;
        }

        // 마크
        var markKey = '0-' + (cellMonth + 1) + '-' + num;
        var mark = config.mark[markKey];

        html += '<td class="' + cls.trim() + '" data-date="' + dateStr + '">'
          + num
          + (mark ? '<span class="cui-date-mark">' + mark + '</span>' : '')
          + '</td>';
      }
      html += '</tr>';
      
      if(day > lastDate && nextDay > 7) break;
    }

    tbody.html(html);
  };

  // 범위 텍스트 업데이트
  Class.prototype.updateRangeText = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config;

    if(!config.range) return;

    var text = '';
    if(that.rangeDate[0]){
      text = that.formatDate(that.rangeDate[0]);
    }
    if(that.rangeDate[1]){
      text += that.rangeStr + that.formatDate(that.rangeDate[1]);
    }
    $c(that.elem).find('.cui-date-range-text').html(text);
  };

  // 비활성 날짜 체크
  Class.prototype.isDisabled = function(year, month, day, cls){
    var that = this
    ,config = that.config
    ,min = config.min
    ,max = config.max;

    var d = new Date(year, month, day);
    var minD = new Date(min.year, min.month, min.date);
    var maxD = new Date(max.year, max.month, max.date);

    return d < minD || d > maxD;
  };

  // 년도 리스트
  Class.prototype.renderYearList = function(){
    var that = this
    ,$c = get$c()
    ,startDate = that.startDate;

    var year = startDate.year;
    var startYear = Math.floor(year / 10) * 10;
    
    $c(that.elem).find('.cui-date-y').html(startYear + ' - ' + (startYear + 9));
    $c(that.elem).find('.cui-date-m').html('');

    var html = '<ul class="cui-date-list">';
    for(var i = startYear - 1; i <= startYear + 10; i++){
      var cls = i === year ? THIS : '';
      if(i < startYear || i > startYear + 9) cls += ' cui-date-other';
      html += '<li class="' + cls + '" data-year="' + i + '">' + i + '</li>';
    }
    html += '</ul>';

    $c(that.elem).find('.cui-date-content').html(html);
    $c(that.elem).addClass('cui-date-list-mode');
  };

  // 월 리스트
  Class.prototype.renderMonthList = function(){
    var that = this
    ,$c = get$c()
    ,lang = that.lang()
    ,startDate = that.startDate;

    $c(that.elem).find('.cui-date-y').html(startDate.year + '년');
    $c(that.elem).find('.cui-date-m').html('');

    var html = '<ul class="cui-date-list">';
    for(var i = 0; i < 12; i++){
      var cls = i === startDate.month ? THIS : '';
      html += '<li class="' + cls + '" data-month="' + i + '">' + lang.month[i] + '</li>';
    }
    html += '</ul>';

    $c(that.elem).find('.cui-date-content').html(html);
    $c(that.elem).addClass('cui-date-list-mode');
  };

  // 캘린더 이벤트
  Class.prototype.bindCalendarEvents = function(){
    var that = this
    ,$c = get$c()
    ,config = that.config
    ,elem = $c(that.elem)
    ,isRange = config.range;

    // 범위 선택: 패널별 이전/다음 년/월 이벤트
    if(isRange){
      // 첫 번째 패널
      elem.find('.cui-date-panel[data-index="0"] .cui-date-prev-y').on('click', function(){
        that.startDate.year--;
        that.syncEndDate();
        that.calendar();
      });
      elem.find('.cui-date-panel[data-index="0"] .cui-date-next-y').on('click', function(){
        that.startDate.year++;
        that.syncEndDate();
        that.calendar();
      });
      elem.find('.cui-date-panel[data-index="0"] .cui-date-prev-m').on('click', function(){
        if(that.startDate.month === 0){
          that.startDate.year--;
          that.startDate.month = 11;
        } else {
          that.startDate.month--;
        }
        that.syncEndDate();
        that.calendar();
      });
      elem.find('.cui-date-panel[data-index="0"] .cui-date-next-m').on('click', function(){
        if(that.startDate.month === 11){
          that.startDate.year++;
          that.startDate.month = 0;
        } else {
          that.startDate.month++;
        }
        that.syncEndDate();
        that.calendar();
      });

      // 두 번째 패널
      elem.find('.cui-date-panel[data-index="1"] .cui-date-prev-y').on('click', function(){
        that.endDate.year--;
        that.calendar();
      });
      elem.find('.cui-date-panel[data-index="1"] .cui-date-next-y').on('click', function(){
        that.endDate.year++;
        that.calendar();
      });
      elem.find('.cui-date-panel[data-index="1"] .cui-date-prev-m').on('click', function(){
        if(that.endDate.month === 0){
          that.endDate.year--;
          that.endDate.month = 11;
        } else {
          that.endDate.month--;
        }
        that.calendar();
      });
      elem.find('.cui-date-panel[data-index="1"] .cui-date-next-m').on('click', function(){
        if(that.endDate.month === 11){
          that.endDate.year++;
          that.endDate.month = 0;
        } else {
          that.endDate.month++;
        }
        that.calendar();
      });
    } else {
      // 단일 선택: 이전/다음 년
      elem.find('.cui-date-prev-y').on('click', function(){
        if(config.type === 'year'){
          that.startDate.year -= 10;
        } else {
          that.startDate.year--;
        }
        that.calendar();
      });

      elem.find('.cui-date-next-y').on('click', function(){
        if(config.type === 'year'){
          that.startDate.year += 10;
        } else {
          that.startDate.year++;
        }
        that.calendar();
      });

      // 이전/다음 월
      elem.find('.cui-date-prev-m').on('click', function(){
        if(that.startDate.month === 0){
          that.startDate.year--;
          that.startDate.month = 11;
        } else {
          that.startDate.month--;
        }
        that.calendar();
      });

      elem.find('.cui-date-next-m').on('click', function(){
        if(that.startDate.month === 11){
          that.startDate.year++;
          that.startDate.month = 0;
        } else {
          that.startDate.month++;
        }
        that.calendar();
      });
    }

    // 날짜 선택
    elem.on('click', '.cui-date-table td', function(){
      var td = $c(this);
      if(td.hasClass(DISABLED)) return;

      var dateStr = td.attr('data-date');
      var parts = dateStr.split('-');
      var clickedDate = new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));

      // 범위 선택
      if(isRange){
        if(that.rangeState === 0){
          // 시작일 선택
          that.rangeDate = [clickedDate, null];
          that.rangeState = 1;
        } else {
          // 종료일 선택
          if(clickedDate < that.rangeDate[0]){
            // 종료일이 시작일보다 앞이면 스왑
            that.rangeDate = [clickedDate, that.rangeDate[0]];
          } else {
            that.rangeDate[1] = clickedDate;
          }
          that.rangeState = 0;
        }
        
        that.calendar();
        
        // change 콜백
        if(typeof config.change === 'function' && that.rangeDate[0] && that.rangeDate[1]){
          var value = that.formatDate(that.rangeDate[0]) + that.rangeStr + that.formatDate(that.rangeDate[1]);
          config.change(value, that.rangeDate);
        }
        return;
      }

      // 단일 선택
      that.startDate.year = parseInt(parts[0]);
      that.startDate.month = parseInt(parts[1]);
      that.startDate.date = parseInt(parts[2]);
      
      that.dateTime = new Date(that.startDate.year, that.startDate.month, that.startDate.date,
        that.startDate.hours, that.startDate.minutes, that.startDate.seconds);

      // change 콜백
      if(typeof config.change === 'function'){
        config.change(that.formatDate(that.dateTime), that.dateTime);
      }

      // 즉시 확인 (datetime 제외)
      if(config.type !== 'datetime'){
        that.confirm();
      } else {
        that.calendar();
      }
    });

    // 년 선택
    elem.on('click', '.cui-date-list li[data-year]', function(){
      var year = parseInt($c(this).attr('data-year'));
      that.startDate.year = year;
      
      if(config.type === 'year'){
        that.dateTime = new Date(year, 0, 1);
        that.confirm();
      } else {
        elem.removeClass('cui-date-list-mode');
        that.calendar();
      }
    });

    // 월 선택
    elem.on('click', '.cui-date-list li[data-month]', function(){
      var month = parseInt($c(this).attr('data-month'));
      that.startDate.month = month;
      
      if(config.type === 'month'){
        that.dateTime = new Date(that.startDate.year, month, 1);
        that.confirm();
      } else {
        elem.removeClass('cui-date-list-mode');
        that.calendar();
      }
    });

    // 년/월 클릭 시 리스트 모드 (단일 선택만)
    if(!isRange){
      elem.find('.cui-date-y').on('click', function(){
        that.renderYearList();
      });

      elem.find('.cui-date-m').on('click', function(){
        that.renderMonthList();
      });
    }

    // 시간 입력
    elem.find('.cui-date-time-input').on('input', function(){
      var input = $c(this);
      var val = parseInt(input.val()) || 0;
      
      if(input.hasClass('cui-date-hour')){
        that.startDate.hours = Math.min(23, Math.max(0, val));
      } else if(input.hasClass('cui-date-minute')){
        that.startDate.minutes = Math.min(59, Math.max(0, val));
      } else if(input.hasClass('cui-date-second')){
        that.startDate.seconds = Math.min(59, Math.max(0, val));
      }
    });

    // 버튼들
    elem.find('.cui-date-btn-clear').on('click', function(){
      that.setValue('');
      if(isRange){
        that.rangeDate = [null, null];
        that.rangeState = 0;
      }
      if(typeof config.done === 'function'){
        config.done('', isRange ? [null, null] : null);
      }
      that.remove();
    });

    elem.find('.cui-date-btn-now').on('click', function(){
      var now = new Date();
      that.dateTime = now;
      that.startDate = {
        year: now.getFullYear()
        ,month: now.getMonth()
        ,date: now.getDate()
        ,hours: now.getHours()
        ,minutes: now.getMinutes()
        ,seconds: now.getSeconds()
      };
      that.confirm();
    });

    elem.find('.cui-date-btn-confirm').on('click', function(){
      that.confirm();
    });

    // 외부 클릭 시 닫기
    if(config.position !== 'static'){
      setTimeout(function(){
        var docClickHandler = function(e){
          if(!that.elem || !that.isOpen) return;
          // that.elem은 달력 DOM 요소
          var dateElem = that.elem;
          var triggerElem = config.elem[0];
          if(!dateElem.contains(e.target) && !triggerElem.contains(e.target)){
            that.remove();
          }
        };
        document.addEventListener('click', docClickHandler);
        that._docClickHandler = docClickHandler;
      }, 100);
    }
  };

  // endDate 동기화 (첫 번째 패널 기준 다음 달)
  Class.prototype.syncEndDate = function(){
    var that = this;
    var nextMonth = that.startDate.month + 1;
    var nextYear = that.startDate.year;
    if(nextMonth > 11){
      nextMonth = 0;
      nextYear++;
    }
    that.endDate = {
      year: nextYear
      ,month: nextMonth
      ,date: 1
    };
  };

  // 확인
  Class.prototype.confirm = function(){
    var that = this
    ,config = that.config
    ,isRange = config.range;

    // 범위 선택
    if(isRange){
      if(!that.rangeDate[0] || !that.rangeDate[1]){
        // 아직 두 날짜 모두 선택되지 않음
        return;
      }
      var value = that.formatDate(that.rangeDate[0]) + that.rangeStr + that.formatDate(that.rangeDate[1]);
      that.setValue(value);
      
      if(typeof config.done === 'function'){
        config.done(value, that.rangeDate);
      }
      
      if(config.position !== 'static'){
        that.remove();
      }
      return;
    }

    // 시간 업데이트
    if(config.type === 'time' || config.type === 'datetime'){
      var $c = get$c();
      that.startDate.hours = parseInt($c(that.elem).find('.cui-date-hour').val()) || 0;
      that.startDate.minutes = parseInt($c(that.elem).find('.cui-date-minute').val()) || 0;
      that.startDate.seconds = parseInt($c(that.elem).find('.cui-date-second').val()) || 0;
    }

    that.dateTime = new Date(
      that.startDate.year
      ,that.startDate.month
      ,that.startDate.date || 1
      ,that.startDate.hours || 0
      ,that.startDate.minutes || 0
      ,that.startDate.seconds || 0
    );

    var formattedValue = that.formatDate(that.dateTime);
    that.setValue(formattedValue);

    // done 콜백
    if(typeof config.done === 'function'){
      config.done(formattedValue, that.dateTime);
    }

    if(config.position !== 'static'){
      that.remove();
    }
  };

  // 제거
  Class.prototype.remove = function(){
    var that = this;

    if(that.elem && that.elem.parentNode){
      that.elem.parentNode.removeChild(that.elem);
    }
    that.isOpen = false;

    // 외부 클릭 이벤트 제거
    if(that._docClickHandler){
      document.removeEventListener('click', that._docClickHandler);
      that._docClickHandler = null;
    }
  };

  // 전역 노출
  window.date = date;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = date;
  }

}(window, document);
