# Catui 일관성 구현 가이드

> 코드 스타일, API 설계, 네이밍 규칙의 일관성 유지를 위한 가이드라인

---

## 1. 코드 스타일 규칙

### 1.1 기본 문법

```javascript
// ✅ 올바른 예시
;!function(window){
  "use strict";
  
  var MOD_NAME = 'moduleName'
  ,document = window.document
  ,config = {
    option1: 'value1'
    ,option2: 'value2'
  };
  
  // 모듈 코드
  
}(window);

// ❌ 잘못된 예시 (쉼표 위치 불일치)
var config = {
  option1: 'value1',
  option2: 'value2',
};
```

### 1.2 쉼표 스타일 (Comma-First)

Layui 원본 스타일을 유지합니다:

```javascript
// ✅ Comma-First 스타일 (유지)
var $c = function(selector){
  return new Cui(selector);
}

,Cui = function(selector){
  // ...
}

,config = {
  modules: {}
  ,status: {}
  ,timeout: 10
};
```

### 1.3 들여쓰기

- **탭 대신 스페이스 2칸** 사용
- 체이닝 시 추가 들여쓰기

```javascript
$c('.element')
  .addClass('active')
  .css('color', 'red')
  .show();
```

### 1.4 세미콜론

- 모든 문장 끝에 세미콜론 필수
- IIFE 앞에 세미콜론 추가 (`;!function`)

---

## 2. 네이밍 규칙

### 2.1 전역 객체

| 유형 | 규칙 | 예시 |
|------|------|------|
| 전역 객체 | PascalCase | `Catui` |
| DOM 라이브러리 | 기호+소문자 | `$c` |
| 생성자 | PascalCase | `Cui`, `Class` |
| 상수 | UPPER_SNAKE | `MOD_NAME`, `ELEM` |
| 변수/함수 | camelCase | `getPath`, `onCallback` |

### 2.2 CSS 클래스

```css
/* 기본 구조: cui-{컴포넌트}-{요소}-{상태} */

/* 컴포넌트 */
.cui-btn
.cui-form
.cui-table

/* 컴포넌트-요소 */
.cui-btn-primary
.cui-form-item
.cui-table-header

/* 컴포넌트-요소-상태 */
.cui-btn-primary-disabled
.cui-form-item-error
.cui-table-row-selected

/* 유틸리티 클래스 */
.cui-show
.cui-hide
.cui-disabled
.cui-this       /* 현재 선택된 상태 */
.cui-active     /* 활성 상태 */
```

### 2.3 HTML 속성

```html
<!-- 데이터 속성: cui-{속성명} -->
<form class="cui-form" cui-filter="myForm">
  <input cui-verify="required" cui-skin="primary">
  <button cui-submit>제출</button>
</form>

<div cui-options="{key: 'value'}"></div>
```

### 2.4 이벤트명

```javascript
// 형식: {동작}({필터})
Catui.on('submit(myForm)', function(data){});
Catui.on('select(mySelect)', function(data){});

// 내부 이벤트: {모듈}.{동작}
config.event['form.submit']
config.event['table.sort']
```

### 2.5 모듈명

| 원본 | Catui | 설명 |
|------|-------|------|
| `lay` | `$c` | DOM 라이브러리 |
| `layer` | `popup` | 팝업/모달 |
| `laydate` | `date` | 날짜 선택 |
| `laypage` | `page` | 페이지네이션 |
| `laytpl` | `tpl` | 템플릿 엔진 |
| `layedit` | `editor` | 리치 에디터 |

---

## 3. API 설계 원칙

### 3.1 모듈 정의 패턴

```javascript
Catui.define(['dependency1', 'dependency2'], function(exports){
  "use strict";
  
  var $ = Catui.$     // $c 참조
  ,MOD_NAME = 'moduleName'
  
  // 1. 상수 정의
  ,ELEM = '.cui-module'
  ,THIS = 'cui-this'
  ,SHOW = 'cui-show'
  ,HIDE = 'cui-hide'
  ,DISABLED = 'cui-disabled'
  
  // 2. 생성자 정의
  ,Class = function(options){
    var that = this;
    that.config = $.extend({}, that.config, options);
    that.init();
  };
  
  // 3. 기본 설정
  Class.prototype.config = {
    elem: null
    ,id: null
    ,data: []
  };
  
  // 4. 초기화
  Class.prototype.init = function(){
    var that = this
    ,options = that.config;
    // 초기화 로직
  };
  
  // 5. 외부 인터페이스
  var module = {
    config: {}
    ,index: 0
    
    ,set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    }
    
    ,on: function(events, callback){
      return Catui.onevent.call(this, MOD_NAME, events, callback);
    }
    
    ,render: function(options){
      var inst = new Class(options);
      return inst;
    }
  };
  
  // 6. 모듈 내보내기
  exports(MOD_NAME, module);
});
```

### 3.2 메소드 체이닝

모든 setter 메소드는 `this`를 반환합니다:

```javascript
// ✅ 올바른 구현
Cui.prototype.addClass = function(className){
  return this.each(function(index, item){
    // 로직
  });
};

Cui.prototype.css = function(key, value){
  var that = this;
  // getter인 경우 값 반환
  if(typeof key === 'string' && value === undefined){
    return that[0] ? that[0].style[key] : undefined;
  }
  // setter인 경우 this 반환
  return that.each(function(index, item){
    item.style[key] = value;
  });
};
```

### 3.3 옵션 패턴

```javascript
// 기본값 병합 패턴
Class.prototype.config = {
  elem: null           // 필수 옵션
  ,id: null            // 선택 옵션 (자동 생성)
  ,data: []            // 배열 기본값
  ,done: function(){}  // 콜백 기본값
};

var options = $.extend({}, that.config, userOptions);

// 옵션 검증
if(!options.elem){
  return hint.error('elem is required');
}
```

### 3.4 이벤트 핸들링

```javascript
// 1. 이벤트 등록
module.on = function(events, callback){
  return Catui.onevent.call(this, MOD_NAME, events, callback);
};

// 2. 이벤트 실행
Catui.event.call(this, MOD_NAME, 'eventName(filter)', {
  elem: elem
  ,data: data
  ,index: index
});

// 3. 사용자 측 사용
Catui.use('form', function(){
  var form = Catui.form;
  
  form.on('submit(myForm)', function(data){
    console.log(data.field);
    return false; // 기본 동작 방지
  });
});
```

---

## 4. $c (DOM 라이브러리) API 일관성

### 4.1 선택자 메소드

```javascript
// 모든 선택자 메소드는 동일한 패턴
$c(selector)           // CSS 선택자 또는 DOM 요소
$c(function(){})       // DOMContentLoaded

// 요소 탐색 (모두 Cui 객체 반환)
.find(selector)         // 하위 요소 검색
.parent()               // 직계 부모
.parents(selector)      // 모든 조상 (필터 가능)
.closest(selector)      // 가장 가까운 조상
.children(selector)     // 직계 자식
.siblings(selector)     // 형제 요소
.prev()                 // 이전 형제
.next()                 // 다음 형제
.eq(index)              // 인덱스로 선택
.first()                // 첫 번째 요소
.last()                 // 마지막 요소
```

### 4.2 DOM 조작 메소드

```javascript
// Getter/Setter 패턴 일관성
.html()                 // getter: innerHTML 반환
.html(content)          // setter: innerHTML 설정, this 반환

.val()                  // getter
.val(value)             // setter

.attr(key)              // getter
.attr(key, value)       // setter
.attr({key: value})     // 객체로 복수 설정

.css(key)               // getter
.css(key, value)        // setter
.css({key: value})      // 객체로 복수 설정

.data(key)              // getter
.data(key, value)       // setter
```

### 4.3 클래스 조작

```javascript
// 모두 this 반환 (체이닝 가능)
.addClass(className)
.removeClass(className)
.toggleClass(className)
.hasClass(className)    // 예외: boolean 반환
```

### 4.4 이벤트 메소드

```javascript
// 기본 이벤트
.on(eventName, handler)
.on(eventName, selector, handler)  // 이벤트 위임
.off(eventName, handler)
.trigger(eventName, data)

// 이벤트 위임 구현
Cui.prototype.on = function(eventName, selectorOrHandler, handler){
  var selector, fn;
  
  if(typeof selectorOrHandler === 'function'){
    fn = selectorOrHandler;
    selector = null;
  } else {
    selector = selectorOrHandler;
    fn = handler;
  }
  
  return this.each(function(index, elem){
    elem.addEventListener(eventName, function(e){
      if(selector){
        var target = e.target.closest(selector);
        if(target && elem.contains(target)){
          fn.call(target, e);
        }
      } else {
        fn.call(elem, e);
      }
    }, false);
  });
};
```

### 4.5 유틸리티 메소드

```javascript
// 정적 메소드 ($c.xxx)
$c.extend(target, ...sources)  // 깊은 복사
$c.each(collection, callback)  // 이터레이션
$c.ajax(options)               // AJAX 요청
$c.param(object)               // 객체 → 쿼리스트링
$c.parseJSON(string)           // JSON 파싱

// 인스턴스 메소드 반환값 규칙
// - 조회: 값 반환
// - 설정: this 반환 (체이닝)
// - 확인: boolean 반환
```

---

## 5. 에러 처리 일관성

### 5.1 에러 출력

```javascript
// 힌트 객체 사용
var hint = Catui.hint();

// 경고 (개발 중 정보)
hint.error('Module not found: ' + name);

// 콘솔 출력 형식
// "Catui error hint: Module not found: xxx"
```

### 5.2 에러 처리 패턴

```javascript
// 1. 필수 옵션 검증
if(!options.elem){
  return hint.error('elem is required');
}

// 2. 타입 검증
if(typeof callback !== 'function'){
  return hint.error('callback must be a function');
}

// 3. 요소 존재 검증
var elem = $(options.elem);
if(!elem[0]){
  return hint.error('Element not found: ' + options.elem);
}
```

---

## 6. CSS 스타일 일관성

### 6.1 변수 네이밍 (CSS Custom Properties)

```css
:root {
  /* 색상 */
  --cui-primary: #16baaa;
  --cui-success: #16b777;
  --cui-warning: #ffb800;
  --cui-danger: #ff5722;
  --cui-info: #31bdec;
  
  /* 텍스트 */
  --cui-text-primary: rgba(0, 0, 0, 0.85);
  --cui-text-secondary: rgba(0, 0, 0, 0.65);
  --cui-text-disabled: rgba(0, 0, 0, 0.25);
  
  /* 배경 */
  --cui-bg-base: #fff;
  --cui-bg-gray: #fafafa;
  --cui-bg-hover: rgba(0, 0, 0, 0.03);
  
  /* 테두리 */
  --cui-border-color: #e6e6e6;
  --cui-border-radius: 2px;
  
  /* 그림자 */
  --cui-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.08);
  --cui-shadow-md: 0 3px 6px rgba(0, 0, 0, 0.12);
  --cui-shadow-lg: 0 6px 16px rgba(0, 0, 0, 0.12);
  
  /* 간격 */
  --cui-spacing-xs: 4px;
  --cui-spacing-sm: 8px;
  --cui-spacing-md: 16px;
  --cui-spacing-lg: 24px;
  
  /* 전환 */
  --cui-transition: 0.2s ease;
}
```

### 6.2 컴포넌트 스타일 구조

```css
/* 1. 기본 스타일 */
.cui-btn {
  display: inline-block;
  padding: 0 15px;
  height: 38px;
  line-height: 38px;
  border: 1px solid var(--cui-border-color);
  border-radius: var(--cui-border-radius);
  background: var(--cui-bg-base);
  color: var(--cui-text-primary);
  cursor: pointer;
  transition: var(--cui-transition);
}

/* 2. 변형 (Variants) */
.cui-btn-primary {
  background: var(--cui-primary);
  border-color: var(--cui-primary);
  color: #fff;
}

/* 3. 크기 */
.cui-btn-lg { height: 44px; line-height: 44px; }
.cui-btn-sm { height: 30px; line-height: 30px; }
.cui-btn-xs { height: 24px; line-height: 24px; }

/* 4. 상태 */
.cui-btn:hover { opacity: 0.8; }
.cui-btn:active { opacity: 1; }
.cui-btn.cui-disabled { 
  opacity: 0.6; 
  cursor: not-allowed; 
}
```

---

## 7. 아이콘 사용 일관성

### 7.1 아이콘 클래스 구조

```css
/* 기본 아이콘 스타일 */
.cui-icon {
  font-family: 'Material Icons';
  font-size: 24px;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  display: inline-block;
  vertical-align: middle;
  -webkit-font-smoothing: antialiased;
}

/* 크기 변형 */
.cui-icon-xs { font-size: 14px; }
.cui-icon-sm { font-size: 18px; }
.cui-icon-lg { font-size: 36px; }
.cui-icon-xl { font-size: 48px; }

/* 개별 아이콘 (리거처 매핑) */
.cui-icon-close::before { content: 'close'; }
.cui-icon-ok::before { content: 'check'; }
.cui-icon-search::before { content: 'search'; }
.cui-icon-loading::before { content: 'refresh'; }
```

### 7.2 아이콘 사용 패턴

```html
<!-- 기본 사용 -->
<i class="cui-icon cui-icon-close"></i>

<!-- 버튼 내 아이콘 -->
<button class="cui-btn">
  <i class="cui-icon cui-icon-search cui-icon-sm"></i> 검색
</button>

<!-- 로딩 아이콘 (애니메이션) -->
<i class="cui-icon cui-icon-loading cui-anim cui-anim-rotate cui-anim-loop"></i>
```

---

## 8. 파일 구조 일관성

### 8.1 모듈 파일 구조

```javascript
/*!
 * Catui {모듈명}
 * {모듈 설명}
 * MIT Licensed
 */

;!function(window, undefined){
  "use strict";
  
  // 1. 의존성 체크
  var isCatui = window.catui && catui.define;
  
  // 2. 모듈 정의
  var module = {
    v: '1.0.0'
    // ...
  };
  
  // 3. 내보내기
  if(isCatui){
    Catui.define(['$c'], function(exports){
      var $ = catui.$;
      // 모듈 구현
      exports('moduleName', module);
    });
  } else {
    // 독립 실행 모드
    window.moduleName = module;
  }
  
}(window);
```

### 8.2 CSS 파일 구조

```css
/**
 * Catui {컴포넌트}
 * MIT Licensed
 */

/* === 변수 === */
/* (CSS Custom Properties) */

/* === 기본 스타일 === */
.cui-component { }

/* === 요소 === */
.cui-component-header { }
.cui-component-body { }
.cui-component-footer { }

/* === 변형 === */
.cui-component-primary { }
.cui-component-danger { }

/* === 크기 === */
.cui-component-sm { }
.cui-component-lg { }

/* === 상태 === */
.cui-component:hover { }
.cui-component.cui-active { }
.cui-component.cui-disabled { }

/* === 반응형 === */
@media (max-width: 768px) {
  .cui-component { }
}
```

---

## 9. 테스트 일관성

### 9.1 단위 테스트 패턴

```javascript
describe('cui.js', function(){
  
  describe('선택자', function(){
    it('CSS 선택자로 요소 선택', function(){
      var elem = cui('.test-element');
      expect(elem.length).to.equal(1);
    });
    
    it('DOM 요소 직접 전달', function(){
      var dom = document.querySelector('.test-element');
      var elem = cui(dom);
      expect(elem[0]).to.equal(dom);
    });
  });
  
  describe('DOM 조작', function(){
    it('addClass/removeClass', function(){
      var elem = cui('.test-element');
      elem.addClass('active');
      expect(elem.hasClass('active')).to.be.true;
      elem.removeClass('active');
      expect(elem.hasClass('active')).to.be.false;
    });
  });
  
});
```

### 9.2 테스트 파일 명명

```text
test/
├── cui.test.js          # cui.js 단위 테스트
├── catui.test.js        # 코어 테스트
├── modules/
│   ├── popup.test.js
│   ├── form.test.js
│   ├── table.test.js
│   └── ...
└── integration/
    ├── form-popup.test.js
    └── table-page.test.js
```

---

## 10. 문서화 일관성

### 10.1 JSDoc 주석

```javascript
/**
 * DOM 요소에 클래스 추가
 * @param {string} className - 추가할 클래스명 (공백으로 다중 가능)
 * @returns {Cui} 체이닝을 위한 Cui 인스턴스
 * @example
 * $c('.elem').addClass('active');
 * $c('.elem').addClass('class1 class2');
 */
Cui.prototype.addClass = function(className){
  // ...
};

/**
 * AJAX 요청
 * @param {Object} options - 요청 옵션
 * @param {string} options.url - 요청 URL
 * @param {string} [options.type='GET'] - HTTP 메소드
 * @param {Object|string} [options.data] - 요청 데이터
 * @param {Function} [options.success] - 성공 콜백
 * @param {Function} [options.error] - 에러 콜백
 * @returns {XMLHttpRequest} XHR 객체
 */
cui.ajax = function(options){
  // ...
};
```

### 10.2 README 구조

```markdown
# 모듈명

> 간단한 설명

## 설치/사용

## 기본 사용법

## API

### 메소드

### 옵션

### 이벤트

## 예제

## 변경 이력
```

---

## 11. 체크리스트

### 코드 리뷰 체크리스트

- [ ] 네이밍 규칙 준수 (camelCase, cui-* 등)
- [ ] Comma-First 스타일 유지
- [ ] 모든 setter가 this 반환 (체이닝)
- [ ] 에러 처리 패턴 준수
- [ ] JSDoc 주석 작성
- [ ] IE 호환 코드 제거 확인
- [ ] CSS 변수 사용
- [ ] 테스트 코드 작성

---

*작성일: 2025-12-07*  
*버전: 1.0*
