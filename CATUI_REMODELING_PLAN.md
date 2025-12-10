# Catui 리모델링 계획서

> Layui v2.6.8 → Catui v1.0.0  
> jQuery 의존성 제거, 순수 JavaScript 기반 UI 프레임워크

---

## 1. 프로젝트 개요

### 1.1 목표

- **jQuery 의존성 완전 제거**
- **네임스페이스 변경**: `layui` → `catui`
- **CSS 프리픽스 변경**: `.layui-*` → `.cui-*`
- **DOM 라이브러리 변경**: `lay.js` → `cui.js`
- **아이콘 시스템 변경**: layui-icon → Material Icons

### 1.2 기술 스택

| 항목 | 원본 (Layui) | 변경 (Catui) |
|------|-------------|--------------|
| 전역 객체 | `window.layui` | `window.Catui` |
| DOM 라이브러리 | `lay.js` (jQuery 보조) | `$c` (독립) |
| CSS 프리픽스 | `.layui-*` | `.cui-*` |
| 속성 프리픽스 | `lay-*` | `cui-*` |
| 아이콘 폰트 | layui-icon | Material Icons |
| 아이콘 클래스 | `.layui-icon-*` | `.cui-icon-*` |
| 빌드 도구 | Gulp 3.9 | Vite |

---

## 2. 디렉토리 구조

```text
catui_admin/
├── fonts/
│   └── material-icons-v145-latin-regular.woff2  # 아이콘 폰트
│
├── src/                      # 소스 디렉토리
│   ├── catui.js              # 코어 모듈 로더
│   │
│   ├── css/
│   │   ├── catui.css         # 메인 스타일시트
│   │   └── modules/
│   │       ├── date/
│   │       ├── popup/
│   │       └── code/
│   │
│   └── modules/
│       ├── cui.js            # DOM 조작 라이브러리 (핵심)
│       ├── popup.js          # layer → popup
│       ├── date.js           # laydate → date
│       ├── page.js           # laypage → page
│       ├── tpl.js            # laytpl → tpl
│       ├── form.js
│       ├── table.js
│       ├── tree.js
│       ├── upload.js
│       ├── dropdown.js
│       ├── transfer.js
│       ├── element.js
│       ├── carousel.js
│       ├── slider.js
│       ├── rate.js
│       ├── colorpicker.js
│       ├── flow.js
│       ├── editor.js         # layedit → editor
│       ├── util.js
│       └── code.js
│
├── dist/                     # Vite 빌드 결과물
├── examples/                 # 예제 파일
├── docs/                     # 문서
├── vite.config.js            # Vite 설정
├── package.json
└── index.html                # 개발 진입점
```

---

## 3. 네이밍 변환 규칙

### 3.1 전역 객체 및 모듈명

| 원본 | 변경 |
|------|------|
| `layui` | `Catui` |
| `layui.define()` | `Catui.define()` |
| `layui.use()` | `Catui.use()` |
| `layui.$` | `Catui.$` ($c) |
| `lay` | `cui` |

### 3.2 모듈명 변경

| 원본 모듈 | 변경 모듈 | 비고 |
|-----------|-----------|------|
| `lay` | `$c` | DOM 라이브러리 |
| `layer` | `popup` | 팝업/모달 |
| `laydate` | `date` | 날짜 선택기 |
| `laypage` | `page` | 페이지네이션 |
| `laytpl` | `tpl` | 템플릿 엔진 |
| `layedit` | `editor` | 리치 에디터 |
| `jquery` | 삭제 | jQuery 제거 |

### 3.3 CSS 클래스 변환

| 원본 | 변경 |
|------|------|
| `.layui-*` | `.cui-*` |
| `.layui-form` | `.cui-form` |
| `.layui-btn` | `.cui-btn` |
| `.layui-table` | `.cui-table` |
| `.layui-layer-*` | `.cui-popup-*` |
| `.layui-laydate-*` | `.cui-date-*` |

### 3.4 HTML 속성 변환

| 원본 | 변경 |
|------|------|
| `lay-filter` | `cui-filter` |
| `lay-verify` | `cui-verify` |
| `lay-submit` | `cui-submit` |
| `lay-skin` | `cui-skin` |
| `lay-options` | `cui-options` |

### 3.5 아이콘 변환

| 원본 | 변경 |
|------|------|
| `<i class="layui-icon layui-icon-close">` | `<i class="cui-icon cui-icon-close"></i>` |
| `<i class="layui-icon">&#x1006;</i>` | `<i class="cui-icon cui-icon-close"></i>` |

---

## 4. 작업 단계 (Phase)

### Phase 0: 프로젝트 초기화 (Day 1)

- [ ] `src/` 디렉토리 구조 생성
- [ ] Vite 프로젝트 설정 (`vite.config.js`, `package.json`)
- [ ] Material Icons CSS 설정 (`.cui-icon-*` 클래스 생성)
- [ ] 개발 서버 및 빌드 스크립트 구성

### Phase 1: 코어 시스템 (Day 1-2)

#### 1.1 catui.js (코어 로더)

- [ ] `layui.js` → `catui.js` 복사 및 변환
- [ ] 전역 객체명 변경: `layui` → `catui`
- [ ] 내장 모듈 목록 업데이트
- [ ] `jquery` 모듈 제거
- [ ] jQuery 자동 감지 로직 제거

#### 1.2 cui.js (DOM 라이브러리) - 핵심 작업

- [ ] `lay.js` 기반 확장
- [ ] jQuery 대체 기능 구현:

  ```javascript
  // 필수 구현 목록
  $c.ajax()           // AJAX 요청
  $c.extend()         // 깊은 복사 개선
  $c.proxy()          // 컨텍스트 바인딩
  $c.parseJSON()      // JSON 파싱
  $c.param()          // 객체 → 쿼리스트링
  
  // Cui.prototype 확장
  .parent() / .parents() / .closest()
  .prev() / .next() / .siblings() / .children()
  .clone()
  .trigger()
  .data()
  .serialize()
  .offset() / .scrollTop() / .scrollLeft()
  .outerWidth() / .outerHeight()
  .show() / .hide() / .toggle()
  .fadeIn() / .fadeOut()
  .slideDown() / .slideUp()
  .animate()
  ```

### Phase 2: 독립 모듈 마이그레이션 (Day 2-3)

> 즉시 변환 가능 (jQuery 미사용)

#### 2.1 tpl.js

- [ ] `laytpl.js` → `tpl.js` 복사
- [ ] 네임스페이스 변경만 필요

#### 2.2 page.js

- [ ] `laypage.js` → `page.js` 복사
- [ ] 네임스페이스 변경만 필요

#### 2.3 date.js

- [ ] `laydate.js` → `date.js` 복사
- [ ] `lay.extend()` → `$c.extend()` 변경
- [ ] CSS 클래스명 변경

### Phase 3: 핵심 모듈 마이그레이션 (Day 3-5)

> jQuery 의존성 제거 필요

#### 3.1 popup.js (layer → popup)

- [ ] `$` → `$c` 전환
- [ ] `$.extend()` → `$c.extend()` 변환
- [ ] DOM 선택/조작 메소드 전환
- [ ] 이벤트 바인딩 전환
- [ ] CSS 클래스명 변경

#### 3.2 form.js

- [ ] 동일 패턴 적용
- [ ] 폼 검증 로직 유지

#### 3.3 element.js

- [ ] 탭, 네비게이션, 프로그레스 바
- [ ] 이벤트 위임 로직 전환

### Phase 4: 복잡 모듈 마이그레이션 (Day 5-8)

#### 3.4 table.js (가장 복잡)

- [ ] 68KB 규모 리팩토링
- [ ] 16개 `$.extend()` 호출 전환
- [ ] AJAX 데이터 로드 전환
- [ ] 이벤트 시스템 전환

#### 3.5 tree.js

- [ ] 재귀 렌더링 로직 유지
- [ ] DOM 조작 전환

#### 3.6 upload.js

- [ ] `$c.ajax()` 활용
- [ ] FormData 처리 유지

#### 3.7 dropdown.js

- [ ] 이벤트 위임 전환
- [ ] 위치 계산 로직 유지

### Phase 5: 기타 모듈 마이그레이션 (Day 8-10)

- [ ] carousel.js
- [ ] slider.js
- [ ] rate.js
- [ ] colorpicker.js
- [ ] transfer.js
- [ ] editor.js
- [ ] flow.js
- [ ] util.js
- [ ] code.js

### Phase 6: CSS 마이그레이션 (Day 10-12)

#### 6.1 catui.css

- [ ] 모든 `.layui-` → `.cui-` 치환
- [ ] 아이콘 폰트 정의 제거 (Material Icons 사용)
- [ ] 아이콘 참조 클래스 제거

#### 6.2 아이콘 시스템

- [ ] Material Icons 폰트 정의 추가
- [ ] `.cui-icon` 기본 스타일 정의
- [ ] `.cui-icon-*` 개별 아이콘 클래스 생성
- [ ] 아이콘 매핑 테이블 작성

#### 6.3 모듈별 CSS

- [ ] date/default/date.css
- [ ] popup/default/popup.css
- [ ] code/code.css

### Phase 7: 테스트 및 문서화 (Day 12-14)

- [ ] 각 모듈별 단위 테스트
- [ ] 예제 파일 업데이트
- [ ] API 문서 작성
- [ ] 마이그레이션 가이드 작성

---

## 5. cui.js 상세 설계

### 5.1 기본 구조

```javascript
;!function(window){
  "use strict";
  
  var document = window.document
  ,MOD_NAME = '$c'
  
  // DOM 선택기
  ,$c = function(selector){
    return new Cui(selector);
  }
  
  // DOM 생성자
  ,Cui = function(selector){
    // 문자열: CSS 선택자
    // 객체: DOM 요소
    // 함수: DOMContentLoaded
  };
  
  Cui.prototype = [];
  Cui.prototype.constructor = Cui;
  
  // ... 메소드 정의
  
  window.$c = $c;
  
  if(window.Catui && Catui.define){
    Catui.define(function(exports){
      exports(MOD_NAME, $c);
    });
  }
}(window);
```

### 5.2 AJAX 구현

```javascript
$c.ajax = function(options){
  options = $c.extend({
    type: 'GET',
    url: '',
    data: null,
    dataType: 'json',
    contentType: 'application/x-www-form-urlencoded',
    headers: {},
    success: function(){},
    error: function(){},
    complete: function(){}
  }, options);
  
  var xhr = new XMLHttpRequest();
  
  xhr.open(options.type, options.url, true);
  
  // 헤더 설정
  for(var key in options.headers){
    xhr.setRequestHeader(key, options.headers[key]);
  }
  
  if(options.contentType){
    xhr.setRequestHeader('Content-Type', options.contentType);
  }
  
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      options.complete(xhr);
      if(xhr.status >= 200 && xhr.status < 300){
        var response = xhr.responseText;
        if(options.dataType === 'json'){
          try{ response = JSON.parse(response); }catch(e){}
        }
        options.success(response, xhr);
      } else {
        options.error(xhr);
      }
    }
  };
  
  // 데이터 처리
  var sendData = null;
  if(options.data){
    if(options.data instanceof FormData){
      sendData = options.data;
    } else if(typeof options.data === 'object'){
      sendData = $c.param(options.data);
    } else {
      sendData = options.data;
    }
  }
  
  xhr.send(sendData);
  return xhr;
};
```

### 5.3 확장 메소드 구현 우선순위

| 우선순위 | 메소드 | 사용 빈도 |
|----------|--------|-----------|
| 1 | `.parent()` / `.closest()` | 매우 높음 |
| 2 | `.siblings()` / `.prev()` / `.next()` | 높음 |
| 3 | `.data()` | 높음 |
| 4 | `.trigger()` | 높음 |
| 5 | `.offset()` / `.scrollTop()` | 중간 |
| 6 | `.outerWidth()` / `.outerHeight()` | 중간 |
| 7 | `.serialize()` | 중간 |
| 8 | `.animate()` | 낮음 (CSS 전환 사용) |

---

## 6. Vite 빌드 설정

### 6.1 package.json

```json
{
  "name": "catui",
  "version": "1.0.0",
  "description": "Modern modular Front-End UI library",
  "type": "module",
  "main": "dist/catui.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

### 6.2 vite.config.js

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'fonts',
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/catui.js'),
      name: 'catui',
      fileName: (format) => `catui.${format}.js`
    },
    rollupOptions: {
      output: {
        assetFileNames: 'css/[name].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

### 6.3 빌드 결과물

```text
dist/
├── catui.es.js       # ES 모듈 버전
├── catui.umd.js      # UMD 버전 (브라우저 직접 사용)
├── css/
│   └── catui.css     # 번들된 CSS
└── fonts/            # 아이콘 폰트
```

---

## 7. 아이콘 매핑 가이드

### 7.1 아이콘 사용법

```html
<!-- 기본 사용 -->
<i class="cui-icon cui-icon-home"></i>
<i class="cui-icon cui-icon-close"></i>
<i class="cui-icon cui-icon-search"></i>

<!-- 크기 조절 -->
<i class="cui-icon cui-icon-home cui-icon-sm"></i>   <!-- 18px -->
<i class="cui-icon cui-icon-home"></i>               <!-- 24px (기본) -->
<i class="cui-icon cui-icon-home cui-icon-lg"></i>   <!-- 36px -->
<i class="cui-icon cui-icon-home cui-icon-xl"></i>   <!-- 48px -->
```

### 7.2 주요 아이콘 매핑

| Layui 아이콘 | Catui 아이콘 | Material Icons 리거처 |
|--------------|--------------|----------------------|
| `layui-icon-close` | `cui-icon-close` | `close` |
| `layui-icon-ok` | `cui-icon-ok` | `check` |
| `layui-icon-search` | `cui-icon-search` | `search` |
| `layui-icon-down` | `cui-icon-down` | `expand_more` |
| `layui-icon-up` | `cui-icon-up` | `expand_less` |
| `layui-icon-left` | `cui-icon-left` | `chevron_left` |
| `layui-icon-right` | `cui-icon-right` | `chevron_right` |
| `layui-icon-edit` | `cui-icon-edit` | `edit` |
| `layui-icon-delete` | `cui-icon-delete` | `delete` |
| `layui-icon-add-circle` | `cui-icon-add-circle` | `add_circle` |
| `layui-icon-user` | `cui-icon-user` | `person` |
| `layui-icon-home` | `cui-icon-home` | `home` |
| `layui-icon-set` | `cui-icon-set` | `settings` |
| `layui-icon-loading` | `cui-icon-loading` | `refresh` |
| `layui-icon-date` | `cui-icon-date` | `calendar_today` |
| `layui-icon-time` | `cui-icon-time` | `schedule` |
| `layui-icon-upload` | `cui-icon-upload` | `upload` |
| `layui-icon-download-circle` | `cui-icon-download` | `download` |
| `layui-icon-file` | `cui-icon-file` | `description` |
| `layui-icon-picture` | `cui-icon-picture` | `image` |
| `layui-icon-video` | `cui-icon-video` | `videocam` |

---

## 8. 일정 요약

| Phase | 작업 내용 | 예상 기간 |
|-------|----------|-----------|
| 0 | 프로젝트 초기화 | 0.5일 |
| 1 | 코어 시스템 (catui.js, cui.js) | 1.5일 |
| 2 | 독립 모듈 (tpl, page, date) | 1일 |
| 3 | 핵심 모듈 (popup, form, element) | 2일 |
| 4 | 복잡 모듈 (table, tree, upload 등) | 3일 |
| 5 | 기타 모듈 | 2일 |
| 6 | CSS 마이그레이션 | 2일 |
| 7 | 테스트 및 문서화 | 2일 |
| **총계** | | **14일** |

---

## 9. 체크리스트

### 시작 전 확인

- [x] 원본 layui-master 분석 완료
- [x] fonts 폴더 확인 (Material Icons)
- [x] 네이밍 규칙 확정 (`.cui-*`)
- [x] 리모델링 계획 수립

### 진행 중 체크

- [ ] Phase 0 완료
- [ ] Phase 1 완료
- [ ] Phase 2 완료
- [ ] Phase 3 완료
- [ ] Phase 4 완료
- [ ] Phase 5 완료
- [ ] Phase 6 완료
- [ ] Phase 7 완료

---

## 10. 문제점 및 주의사항

### 10.1 고위험 jQuery 의존성

#### AJAX 호출 ($.ajax)

| 모듈 | 사용 위치 | 위험도 | 대응 방안 |
|------|----------|--------|----------|
| `table.js` | 데이터 로드 | 🔴 높음 | `cui.ajax()` 구현 필수 |
| `upload.js` | 파일 업로드, 진행률 | 🔴 높음 | XMLHttpRequest + progress 이벤트 |

**주의:** `$.ajaxSettings.xhr()` 사용 부분은 직접 `new XMLHttpRequest()` 로 대체 필요

#### .data() 메소드 (72회 사용)

| 모듈 | 사용 횟수 | 위험도 |
|------|----------|--------|
| `table.js` | 32회 | 🔴 매우 높음 |
| `dropdown.js` | 10회 | 🟠 높음 |
| `slider.js` | 7회 | 🟠 높음 |
| `layer.js` | 5회 | 🟠 높음 |
| `transfer.js` | 5회 | 🟠 높음 |

**대응:** `cui.data()` 구현 시 WeakMap 기반 데이터 저장소 필요

```javascript
// cui.js 내부 데이터 저장소
var dataStore = new WeakMap();

Cui.prototype.data = function(key, value){
  var elem = this[0];
  if(!elem) return;
  
  var store = dataStore.get(elem) || {};
  
  if(value === undefined){
    return key ? store[key] : store;
  }
  
  store[key] = value;
  dataStore.set(elem, store);
  return this;
};
```

#### .parents() 메소드 (37회 사용)

| 모듈 | 사용 횟수 |
|------|----------|
| `tree.js` | 8회 |
| `table.js` | 7회 |
| `element.js` | 6회 |
| `layer.js` | 4회 |
| `dropdown.js` | 3회 |
| `form.js` | 3회 |

**주의:** `.parents()` vs `.closest()` 차이점 명확히 구현

#### .trigger() 메소드 (12회 사용)

- `upload.js` - 6회 (파일 선택 트리거)
- `table.js` - 2회
- 기타 - 4회

**주의:** 커스텀 이벤트 트리거 시 `CustomEvent` API 사용

### 10.2 IE 호환 코드 제거 대상

| 파일 | 코드 패턴 | 제거 대상 |
|------|----------|----------|
| `layui.js` | `attachEvent` | 2개소 |
| `lay.js` | `attachEvent`, `detachEvent` | 1개소 |
| `laypage.js` | `attachEvent` | 1개소 |
| `layer.js` | `layer.ie == 6` 체크 | 다수 |

### 10.3 모듈별 복잡도 분석

| 모듈 | 크기 | jQuery 메소드 | 복잡도 | 예상 작업 시간 |
|------|------|--------------|--------|---------------|
| `table.js` | 68KB | $.extend(16), .data(32), .parents(7), $.ajax(1) | 🔴🔴🔴 | 8시간 |
| `layer.js` | 42KB | $.extend(11), .data(5), .parents(4) | 🔴🔴 | 6시간 |
| `tree.js` | 28KB | $.extend(5), .parents(8), .data(2) | 🔴🔴 | 4시간 |
| `form.js` | 26KB | $.extend(2), .parents(3), .trigger(1) | 🟠 | 3시간 |
| `upload.js` | 16KB | $.ajax(2), .trigger(6) | 🟠 | 3시간 |
| `dropdown.js` | 16KB | $.extend(4), .data(10), .parents(3) | 🟠 | 3시간 |
| 기타 모듈 | - | - | 🟢 | 각 1-2시간 |

### 10.4 주요 위험 요소

#### 1. 이벤트 위임 패턴

```javascript
// 기존 jQuery 패턴
$(document).on('click', '.cui-btn', fn);

// cui.js 구현 필요
cui(document).on('click', function(e){
  if(e.target.matches('.cui-btn')){
    fn.call(e.target, e);
  }
});
```

**해결:** `matches()` 또는 `closest()` 활용한 이벤트 위임 헬퍼 구현

#### 2. 체이닝 패턴 유지

```javascript
// 모든 메소드가 this 반환해야 함
cui('.elem').addClass('active').css('color', 'red').show();
```

#### 3. 애니메이션 처리

- `.animate()` 사용: `util.js` (2회)
- **대안:** CSS Transitions + `transitionend` 이벤트

```javascript
Cui.prototype.fadeIn = function(duration, callback){
  return this.each(function(i, elem){
    elem.style.opacity = 0;
    elem.style.display = '';
    elem.style.transition = 'opacity ' + (duration || 300) + 'ms';
    
    setTimeout(function(){
      elem.style.opacity = 1;
    }, 10);
    
    if(callback){
      setTimeout(callback, duration || 300);
    }
  });
};
```

#### 4. 폼 직렬화

```javascript
// .serialize() 구현 필요
Cui.prototype.serialize = function(){
  var form = this[0];
  if(!form || form.tagName !== 'FORM') return '';
  return new URLSearchParams(new FormData(form)).toString();
};
```

### 10.5 테스트 체크포인트

#### Phase 1 완료 후 필수 테스트

- [ ] `$c('selector')` 선택 동작
- [ ] `.addClass()` / `.removeClass()` / `.hasClass()`
- [ ] `.on()` / `.off()` 이벤트 바인딩
- [ ] `.parent()` / `.parents()` / `.closest()` 탐색
- [ ] `.data()` 데이터 저장/조회
- [ ] `$c.ajax()` GET/POST 요청
- [ ] `$c.extend()` 깊은 복사

#### Phase 3 완료 후 필수 테스트

- [ ] `popup.open()` / `popup.close()` 기본 동작
- [ ] `popup.msg()` / `popup.alert()` / `popup.confirm()`
- [ ] `form.render()` 폼 요소 렌더링
- [ ] `form.on('submit')` 이벤트 동작
- [ ] `element.tab()` 탭 전환

#### Phase 4 완료 후 필수 테스트

- [ ] `table.render()` 정적 데이터
- [ ] `table.render()` AJAX 데이터 로드
- [ ] 테이블 정렬, 페이지네이션
- [ ] `tree.render()` 트리 구조 렌더링
- [ ] `upload.render()` 파일 선택 및 업로드

### 10.6 롤백 전략

1. **Git 브랜치 전략**
   - `main` - 원본 layui 유지
   - `develop` - catui 개발
   - `feature/*` - 각 모듈별 브랜치

2. **점진적 마이그레이션**
   - 각 Phase 완료 시 태그 생성
   - 문제 발생 시 이전 태그로 롤백

3. **병렬 테스트**
   - 기존 layui 예제와 동일한 catui 예제 작성
   - 동작 비교 테스트

---

## 11. 참고 사항

### 11.1 호환성 목표

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- IE 미지원 (선택적)

### 11.2 제거 항목

- `jquery.js` 모듈 완전 삭제
- IE8/9 호환 코드 제거 (attachEvent 등)
- layui-icon 폰트 파일 제거

### 11.3 유지 항목

- 자체 모듈 시스템 (`Catui.define`, `Catui.use`)
- 이벤트 시스템 (`Catui.event`, `Catui.onevent`)
- 스토리지 유틸리티 (`Catui.data`, `Catui.sessionData`)

---

## 12. 완료 현황

### 12.1 완료된 모듈 (2025-01-08 기준)

| 모듈 | 파일 | 상태 | 비고 |
|------|------|------|------|
| Core | `catui.js` | ✅ 완료 | 모듈 로더 |
| DOM | `cui.js` | ✅ 완료 | jQuery-free DOM 라이브러리 |
| Popup | `popup.js` | ✅ 완료 | 팝업/모달/토스트 |
| Page | `page.js` | ✅ 완료 | 페이지네이션 |
| Date | `date.js` | ✅ 완료 | 날짜 선택기 |
| Template | `tpl.js` | ✅ 완료 | 템플릿 엔진 |
| Form | `form.js` | ✅ 완료 | 폼 요소 렌더링 |
| Element | `element.js` | ✅ 완료 | 탭/아코디언/네비 |
| Dropdown | `dropdown.js` | ✅ 완료 | 드롭다운 메뉴 |
| Upload | `upload.js` | ✅ 완료 | 파일 업로드 |
| Tree | `tree.js` | ✅ 완료 | 트리 컴포넌트 |
| Table | `table.js` | ✅ 완료 | 데이터 테이블 |
| Rate | `rate.js` | ✅ 완료 | 별점 평가 |
| Slider | `slider.js` | ✅ 완료 | 슬라이더 |
| Carousel | `carousel.js` | ✅ 완료 | 캐러셀/슬라이드 |
| Colorpicker | `colorpicker.js` | ✅ 완료 | 색상 선택기 |
| Transfer | `transfer.js` | ✅ 완료 | 이전 선택 |
| Util | `util.js` | ✅ 완료 | 유틸리티 함수 |

### 12.2 CSS 파일

| 파일 | 상태 | 비고 |
|------|------|------|
| `variables.css` | ✅ 완료 | CSS 변수 정의 |
| `reset.css` | ✅ 완료 | 리셋 스타일 |
| `icon.css` | ✅ 완료 | Material Icons |
| `button.css` | ✅ 완료 | 버튼 스타일 |
| `input.css` | ✅ 완료 | 입력 필드 스타일 |
| `page.css` | ✅ 완료 | 페이지네이션 |
| `popup.css` | ✅ 완료 | 팝업/모달 |
| `form.css` | ✅ 완료 | 폼 요소 |
| `element.css` | ✅ 완료 | 탭/아코디언 |
| `date.css` | ✅ 완료 | 날짜 선택기 |
| `dropdown.css` | ✅ 완료 | 드롭다운 |
| `tree.css` | ✅ 완료 | 트리 |
| `table.css` | ✅ 완료 | 데이터 테이블 |
| `colorpicker.css` | ✅ 완료 | 색상 선택기 |
| `transfer.css` | ✅ 완료 | 이전 선택 |
| `misc.css` | ✅ 완료 | Rate/Slider/Carousel/Fixbar/Upload |

### 12.3 추가 구현 모듈

| 모듈 | 상태 | 비고 |
|------|------|------|
| Flow | ✅ 완료 | 무한 스크롤 |
| Editor | ✅ 완료 | 리치 에디터 (WYSIWYG) |
| Code | ✅ 완료 | 코드 하이라이팅 |

---

*작성일: 2025-12-07*  
*최종 업데이트: 2025-01-08*  
*버전: 1.0*
