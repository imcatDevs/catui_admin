# Catui 프로젝트 상세 구현 현황

> 최종 업데이트: 2024-12-10

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [모듈 현황](#모듈-현황)
3. [수정된 버그](#수정된-버그)
4. [일관성 수정](#일관성-수정)
5. [아키텍처](#아키텍처)
6. [API 레퍼런스](#api-레퍼런스)

---

## 프로젝트 개요

### 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | Vanilla JavaScript (jQuery-free) |
| 빌드 시스템 | Gulp |
| CSS | CSS Variables, Modular Components |
| 아이콘 | Material Icons |
| 폰트 | Noto Sans KR |

### 디렉토리 구조

```text
catui_admin/
├── src/
│   ├── catui.js              # 코어 모듈 로더
│   ├── modules/              # JS 모듈 (21개)
│   │   ├── cui.js            # DOM 라이브러리
│   │   ├── table.js          # 데이터 테이블
│   │   ├── tree.js           # 트리 뷰
│   │   ├── form.js           # 폼 컴포넌트
│   │   ├── popup.js          # 팝업/레이어
│   │   ├── date.js           # 날짜 선택기
│   │   ├── page.js           # 페이지네이션
│   │   ├── dropdown.js       # 드롭다운 메뉴
│   │   ├── element.js        # 탭/아코디언/네비게이션
│   │   ├── upload.js         # 파일 업로드
│   │   ├── carousel.js       # 캐러셀/슬라이더
│   │   ├── slider.js         # 범위 슬라이더
│   │   ├── rate.js           # 평점
│   │   ├── colorpicker.js    # 색상 선택기
│   │   ├── transfer.js       # 트랜스퍼 컴포넌트
│   │   ├── editor.js         # 리치 에디터
│   │   ├── theme.js          # 테마 관리
│   │   ├── flow.js           # 무한 스크롤
│   │   ├── code.js           # 코드 하이라이터
│   │   ├── tpl.js            # 템플릿 엔진
│   │   └── util.js           # 유틸리티
│   └── css/
│       ├── base/             # 기본 스타일
│       │   ├── variables.css # CSS 변수
│       │   ├── reset.css     # 리셋
│       │   └── icon.css      # 아이콘
│       └── components/       # 컴포넌트 스타일
├── dist/                     # 빌드 결과물
├── tests/                    # 테스트 페이지
├── gulpfile.js               # Gulp 설정
└── package.json
```

---

## 모듈 현황

### 전체 모듈 (21개)

| 모듈 | 버전 | MOD_NAME | get$c | on() | Catui 등록 | 이벤트 |
|------|------|----------|-------|------|------------|--------|
| cui.js | 1.0 | $c | - | - | ✅ | - |
| table.js | 1.0 | table | ✅ | ✅ | ✅ | row, checkbox, tool, edit, sort |
| tree.js | 1.0 | tree | ✅ | ✅ | ✅ | click, checkbox, operate |
| form.js | 1.0 | form | ✅ | ✅ | ✅ | submit, switch, checkbox, radio |
| element.js | 1.0 | element | ✅ | ✅ | ✅ | tab, nav, collapse |
| popup.js | 2.0 | popup | ✅ | ✅ | ✅ | - |
| dropdown.js | 1.0 | dropdown | ✅ | ✅ | ✅ | click, menu |
| date.js | 1.0 | date | ✅ | ✅ | ✅ | - |
| page.js | 1.1 | page | ✅ | ✅ | ✅ | - |
| carousel.js | 1.0 | carousel | ✅ | ✅ | ✅ | change |
| upload.js | 1.0 | upload | ✅ | ✅ | ✅ | - |
| slider.js | 1.0 | slider | ✅ | ✅ | ✅ | - |
| rate.js | 1.0 | rate | ✅ | ✅ | ✅ | - |
| transfer.js | 1.0 | transfer | ✅ | ✅ | ✅ | - |
| colorpicker.js | 1.0 | colorpicker | ✅ | ✅ | ✅ | - |
| theme.js | 1.0 | theme | ✅ | ✅ | ✅ | change |
| editor.js | 1.0 | editor | ✅ | ✅ | ✅ | - |
| flow.js | 1.0 | flow | ✅ | ✅ | ✅ | - |
| code.js | 1.0 | code | ✅ | ✅ | ✅ | - |
| tpl.js | 1.0 | tpl | ❌ | ❌ | ✅ | - |
| util.js | 1.0 | util | ✅ | ❌ | ✅ | - |

### 모듈 분류

#### 핵심 모듈

- **cui.js**: jQuery-free DOM 조작 라이브러리 (`$c`)
- **catui.js**: 모듈 로더 및 이벤트 시스템

#### UI 컴포넌트

- **table.js**: 데이터 테이블 (정렬, 필터, 페이지네이션, 편집)
- **tree.js**: 트리 뷰 (체크박스, 편집, 아코디언)
- **form.js**: 폼 요소 (체크박스, 라디오, 스위치, 검증)
- **popup.js**: 팝업/레이어 (알림, 확인, 드로어, 사진 뷰어)
- **element.js**: 탭, 네비게이션, 아코디언

#### 입력 컴포넌트

- **date.js**: 날짜/시간 선택기 (범위 선택 지원)
- **slider.js**: 범위 슬라이더 (수직/수평)
- **rate.js**: 별점 컴포넌트
- **colorpicker.js**: 색상 선택기 (HEX, RGB, HSV)
- **upload.js**: 파일 업로드 (드래그&드롭)
- **editor.js**: WYSIWYG 에디터

#### 기타 컴포넌트

- **dropdown.js**: 드롭다운 메뉴 (컨텍스트 메뉴)
- **page.js**: 페이지네이션
- **carousel.js**: 이미지 슬라이더
- **transfer.js**: 트랜스퍼 (이중 목록)
- **flow.js**: 무한 스크롤/워터폴
- **theme.js**: 테마 관리자

#### 유틸리티

- **code.js**: 코드 하이라이터
- **tpl.js**: 템플릿 엔진
- **util.js**: 유틸리티 함수

---

## 수정된 버그

### 버그 수정 목록 (11건)

#### 1. cui.js - off() 메서드 미구현 (심각)

**문제**: `off()` 메서드가 실제로 이벤트를 제거하지 않음

**수정**:

```javascript
// WeakMap을 사용한 이벤트 핸들러 저장소
var eventStore = new WeakMap();

Cui.prototype.on = function(events, selectorOrHandler, handler){
  // 핸들러를 eventStore에 저장
  // 네임스페이스 지원 (예: 'click.menu')
};

Cui.prototype.off = function(events){
  // eventStore에서 핸들러를 찾아 제거
};
```

#### 2. cui.js - ajax JSON contentType 처리

**문제**: `contentType: 'application/json'`일 때 데이터가 쿼리스트링으로 변환됨

**수정**:

```javascript
if(options.contentType.indexOf('application/json') !== -1){
  sendData = JSON.stringify(options.data);
} else {
  sendData = $c.param(options.data);
}
```

#### 3. upload.js - allDone 콜백 미호출

**문제**: `config.multiple`이 false일 때 `allDone` 콜백이 호출되지 않음

**수정**: `config.multiple` 조건 제거

#### 4. date.js - 외부 클릭 이벤트 정리 안됨

**문제**: `$c(document).off('click.date...')`가 제대로 동작하지 않음

**수정**: `document.addEventListener/removeEventListener` 직접 사용

#### 5. table.js - del() 인덱스 동기화

**문제**: 행 삭제 후 캐시 데이터의 `indexName`이 업데이트되지 않음

**수정**:

```javascript
del: function(){
  data.splice(index, 1);
  if(tr) tr.remove();
  // 캐시 내 인덱스 재설정
  data.forEach(function(item, i){
    item[table.config.indexName] = i;
  });
  // DOM 인덱스 재설정
  that.layTbody.querySelectorAll('tr:not(.cui-table-total)').forEach(...);
}
```

#### 6. table.js - cols 빈 배열 체크

**문제**: `config.cols`가 비어있으면 forEach 에러

**수정**:

```javascript
if(!config.cols || !config.cols.length){
  config.cols = [[]];
  return;
}
```

#### 7. slider.js - Division by Zero

**문제**: `config.max - config.min`이 0이면 나눗셈 에러

**수정**:

```javascript
var range = config.max - config.min;
if(range === 0) range = 1;
```

#### 8. popup.js - shadeo undefined 체크

**문제**: `that.shadeo[0]`에서 shadeo가 undefined일 수 있음

**수정**:

```javascript
if(config.shadeClose && that.shadeo && that.shadeo[0])
```

#### 9. colorpicker.js - document 이벤트 최적화

**문제**: 6개의 document 이벤트가 개별 등록됨 (메모리 누수 가능)

**수정**: 2개의 핸들러로 통합, 참조 저장

#### 10. form.js - validate 포커스 버그

**문제**: 모든 오류 필드에 포커스가 이동함

**수정**: 첫 번째 오류 필드에만 포커스

#### 11. popup.js - moveEnd 콜백 누락

**문제**: 드래그 종료 시 `moveEnd` 콜백이 호출되지 않음

**수정**: `onMouseUp`에서 콜백 호출 추가

---

## 일관성 수정

### on() 메서드 추가 (12개 모듈)

모든 UI 모듈에 일관된 `on()` 메서드 패턴 적용:

```javascript
,on: function(events, callback){
  if(window.Catui && Catui.onevent){
    return Catui.onevent.call(this, MOD_NAME, events, callback);
  }
  return this;
}
```

**추가된 모듈**:
- theme.js
- slider.js
- rate.js
- transfer.js
- colorpicker.js
- editor.js
- flow.js
- code.js
- popup.js
- date.js
- page.js

---

## 아키텍처

### 모듈 공통 구현 패턴

```javascript
;!function(window, undefined){
  "use strict";
  
  var MOD_NAME = 'moduleName'
  ,get$c = function(){ return window.$c; }
  ,index = 0
  ,instances = {};  // 또는 module.that = {}

  var module = {
    config: {},
    index: 0,
    
    set: function(options){
      this.config = $c.extend({}, this.config, options);
      return this;
    },
    
    render: function(options){
      var inst = new Class(options);
      return inst.thisModule();
    },
    
    getInst: function(id){
      return instances[id];
    },
    
    on: function(events, callback){
      if(window.Catui && Catui.onevent){
        return Catui.onevent.call(this, MOD_NAME, events, callback);
      }
      return this;
    }
  };

  var Class = function(options){
    var that = this;
    var $c = get$c();
    
    if(!$c){
      setTimeout(function(){ new Class(options); }, 50);
      return;
    }
    
    that.index = ++index;
    that.config = $c.extend({}, that.defaults, module.config, options);
    that.config.id = that.config.id || that.index;
    
    instances[that.config.id] = that;
    that.render();
  };

  Class.prototype.defaults = { /* 기본 설정 */ };
  Class.prototype.render = function(){ /* 렌더링 */ };
  Class.prototype.thisModule = function(){
    return { config: this.config, reload: ... };
  };

  // 전역 노출
  window.moduleName = module;
  if(window.Catui) window.Catui[MOD_NAME] = module;
}(window);
```

### 이벤트 발생 패턴

```javascript
if(window.Catui && Catui.event){
  Catui.event(MOD_NAME, 'eventName(' + that.key + ')', {
    elem: element,
    data: data
  });
}
```

### 이벤트 수신 패턴

```javascript
Catui.use(['table'], function(){
  table.on('row(myTable)', function(obj){
    console.log(obj.data);
  });
});
```

### 속성 체계

| 접두사 | 용도 | 예시 |
|--------|------|------|
| `cui-filter` | 이벤트 필터 | `cui-filter="myForm"` |
| `cui-skin` | 스킨 타입 | `cui-skin="switch"` |
| `cui-text` | 텍스트 설정 | `cui-text="ON\|OFF"` |
| `cui-verify` | 검증 규칙 | `cui-verify="required"` |
| `cui-ignore` | 렌더링 제외 | `cui-ignore` |
| `cui-rendered` | 렌더링 완료 | (내부용) |

---

## API 레퍼런스

### cui.js ($c)

```javascript
// DOM 선택
$c('#id')
$c('.class')
$c('div')
$c(element)
$c(function(){ /* DOM Ready */ })

// DOM 조작
.html(content)
.text(content)
.val(value)
.attr(name, value)
.css(property, value)
.addClass(className)
.removeClass(className)
.toggleClass(className)
.hasClass(className)

// DOM 탐색
.find(selector)
.closest(selector)
.parent()
.children(selector)
.siblings()
.eq(index)
.first()
.last()

// DOM 삽입
.append(content)
.prepend(content)
.after(content)
.before(content)
.remove()
.empty()

// 이벤트
.on(events, handler)
.on(events, selector, handler)
.off(events)
.trigger(eventName)

// 유틸리티
$c.extend(target, source)
$c.each(obj, callback)
$c.ajax(options)
$c.param(obj)
```

### table.js

```javascript
// 렌더링
table.render({
  elem: '#table',
  cols: [[
    { type: 'checkbox' },
    { field: 'id', title: 'ID', sort: true },
    { field: 'name', title: '이름', edit: 'text' },
    { title: '작업', toolbar: '#barTpl' }
  ]],
  data: [],
  url: '/api/data',
  page: true
});

// API
table.reload(id, options)
table.checkStatus(id)
table.getData(id)
table.exportFile(id, data, 'csv')
table.setRowChecked(id, index, checked)

// 이벤트
table.on('row(filter)', fn)
table.on('checkbox(filter)', fn)
table.on('tool(filter)', fn)
table.on('edit(filter)', fn)
table.on('sort(filter)', fn)
```

### popup.js

```javascript
// 기본 팝업
popup.open({
  title: '제목',
  content: '내용',
  area: ['500px', '300px'],
  btn: ['확인', '취소'],
  yes: function(index){ popup.close(index); }
});

// 간편 메서드
popup.alert('알림')
popup.confirm('확인?', { icon: 3 }, yesCallback)
popup.msg('메시지', { icon: 1 })
popup.load(1)
popup.tips('툴팁', '#elem')
popup.prompt({ title: '입력' }, callback)
popup.toast({ content: '토스트' })
popup.drawer({ direction: 'r', content: '...' })

// API
popup.close(index)
popup.closeAll()
popup.full(index)
popup.min(index)
popup.restore(index)
```

### form.js

```javascript
// 렌더링
form.render()
form.render('checkbox')
form.render('select', 'myForm')

// API
form.val(filter, data)
form.getValue(filter)
form.verify({ ruleName: [regex, 'message'] })
form.validate(filter)
form.reset(filter)

// 이벤트
form.on('submit(filter)', function(data){
  console.log(data.field);
  return false;
});
```

### date.js

```javascript
// 렌더링
date.render({
  elem: '#date',
  type: 'datetime',
  range: true,
  format: 'yyyy-MM-dd HH:mm:ss',
  done: function(value, date){ }
});

// API
date.getValue(id)
date.setValue(id, value)
date.closeAll()
```

---

## 빌드 명령어

```bash
# 전체 빌드
npm run build

# 개발 서버
npm run dev

# 서버만 실행
npm run serve
```

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2024-12-10 | 1.0.0 | 초기 문서 작성 |
| 2024-12-10 | 1.0.1 | 버그 수정 11건, 일관성 수정 12건 |
