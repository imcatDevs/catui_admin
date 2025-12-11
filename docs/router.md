# Router 모듈

SPA(Single Page Application) 라우팅을 제공하는 모듈입니다.

## 기본 사용법

```html
<!-- 네비게이션 -->
<nav>
  <a cui-href="/pages/home.html">홈</a>
  <a cui-href="/pages/about.html">소개</a>
  <a cui-href="/pages/contact.html">연락처</a>
</nav>

<!-- 컨텐츠 영역 -->
<div cui-target-content>
  <!-- 여기에 페이지가 로드됩니다 -->
</div>

<script>
Catui.use(['router'], function(){
  // router는 자동 초기화됩니다
  // 추가 설정이 필요하면:
  router.set({
    cache: true,
    transition: true
  });
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `set(options)` | 전역 설정 |
| `go(path)` | 라우트 이동 |
| `back()` | 뒤로 가기 |
| `forward()` | 앞으로 가기 |
| `reload()` | 현재 페이지 새로고침 |
| `current()` | 현재 라우트 정보 |
| `clearCache(path)` | 캐시 클리어 |
| `preload(paths)` | 페이지 프리로드 |
| `on(events, callback)` | 이벤트 등록 |
| `addInterval(fn, delay)` | setInterval 등록 (자동 정리) |
| `addTimeout(fn, delay)` | setTimeout 등록 (자동 정리) |
| `bindEvent(elem, type, handler)` | 이벤트 리스너 등록 (자동 정리) |
| `addCleanup(fn)` | 커스텀 정리 함수 등록 |

---

## 속성

### cui-href

링크 요소에 사용합니다. 클릭 시 해당 페이지를 로드합니다.

```html
<a cui-href="/pages/home.html">홈</a>
<button cui-href="/pages/form.html">폼 페이지</button>
<div cui-href="/pages/list.html">클릭하면 이동</div>
```

### cui-target-content

페이지가 렌더링될 컨테이너를 지정합니다.

```html
<div cui-target-content>
  <!-- 로드된 페이지 내용 -->
</div>
```

### cui-target

특정 컨테이너를 지정할 때 사용합니다.

```html
<a cui-href="/sidebar.html" cui-target="#sidebar">사이드바 로드</a>

<div id="sidebar" cui-target-content></div>
<div id="main" cui-target-content></div>
```

---

## set(options)

라우터 설정을 변경합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `silentMode` | Boolean | true | URL 변경 없이 페이지만 로드 |
| `hashbang` | Boolean | false | hash 모드 (#/) 사용 |
| `cache` | Boolean | true | 페이지 캐싱 |
| `transition` | Boolean | true | 트랜지션 효과 |
| `activeClass` | String | 'cui-router-active' | 활성 링크 클래스 |
| `loadingClass` | String | 'cui-router-loading' | 로딩 클래스 |
| `beforeEach` | Function | null | 라우트 전 훅 |
| `afterEach` | Function | null | 라우트 후 훅 |
| `onError` | Function | null | 에러 핸들러 |

```javascript
router.set({
  cache: true,
  transition: true,
  
  // 라우트 전 체크
  beforeEach: function(to){
    console.log('이동:', to.path);
    
    // 로그인 체크
    if(to.path.indexOf('/admin') === 0 && !isLogin){
      return '/login.html';  // 리다이렉트
    }
    
    return true;  // 진행
  },
  
  // 라우트 후
  afterEach: function(route){
    console.log('로드 완료:', route.path);
  },
  
  // 에러 처리
  onError: function(xhr, status, path){
    if(xhr.status === 404){
      router.go('/404.html');
    }
  }
});
```

---

## go(path)

프로그래밍 방식으로 라우트를 이동합니다.

```javascript
// 페이지 이동
router.go('/pages/detail.html');

// 쿼리스트링 포함
router.go('/pages/search.html?keyword=catui&page=1');
```

---

## current()

현재 라우트 정보를 반환합니다.

```javascript
var route = router.current();
console.log(route.path);   // "/pages/home.html"
console.log(route.query);  // { page: "1" }
```

---

## 캐시 관리

```javascript
// 특정 페이지 캐시 삭제
router.clearCache('/pages/home.html');

// 전체 캐시 삭제
router.clearCache();

// 페이지 프리로드
router.preload([
  '/pages/home.html',
  '/pages/about.html'
]);
```

---

## 페이지별 모듈 로드

라우터로 로드된 페이지에서 `Catui.use`를 사용하여 필요한 모듈만 로드합니다.

### 장점

- **초기 로딩 최적화** - 필요한 모듈만 로드
- **명확한 의존성** - 각 페이지에서 사용하는 모듈 명시
- **유연한 구성** - 페이지별로 다른 모듈 조합 가능

### 로드된 페이지 예시 (pages/form.html)

```html
<h2>폼 페이지</h2>

<form class="cui-form" cui-filter="pageForm">
  <div class="cui-form-item">
    <label class="cui-form-label">이름</label>
    <input type="text" name="name" class="cui-input">
  </div>
  <div class="cui-form-item">
    <label class="cui-form-label">날짜</label>
    <input type="text" id="date1" class="cui-input">
  </div>
  <div class="cui-form-item">
    <label class="cui-form-label">상태</label>
    <select name="status">
      <option value="1">활성</option>
      <option value="0">비활성</option>
    </select>
  </div>
</form>

<script>
// 이 페이지에서 필요한 모듈 로드
Catui.use(['form', 'date', 'popup'], function(){
  // 폼 렌더링
  form.render();
  
  // 날짜 선택기 렌더링
  date.render({ elem: '#date1' });
  
  // 폼 제출 이벤트
  form.on('submit(pageForm)', function(data){
    console.log(data.field);
    popup.msg('제출 완료!', { icon: 1 });
    return false;
  });
});
</script>
```

---

## 인스턴스 관리 (메모리 누수 방지)

SPA에서 페이지 이동 시 기존 페이지의 `setInterval`, `setTimeout`, 이벤트 리스너가 정리되지 않으면 메모리 누수가 발생합니다. 라우터의 인스턴스 관리 API를 사용하면 페이지 이동 시 자동으로 정리됩니다.

### 사용 예시

```javascript
// 페이지 스크립트에서
Catui.use(['router'], function(){
  
  // setInterval 등록 (페이지 이동 시 자동 정리)
  router.addInterval(function(){
    console.log('1초마다 실행');
  }, 1000);
  
  // setTimeout 등록 (페이지 이동 시 자동 정리)
  router.addTimeout(function(){
    console.log('5초 후 실행');
  }, 5000);
  
  // 이벤트 리스너 등록 (페이지 이동 시 자동 정리)
  router.bindEvent('#myButton', 'click', function(){
    console.log('버튼 클릭');
  });
  
  // 커스텀 정리 함수 등록
  router.addCleanup(function(){
    console.log('페이지 정리 작업');
    // WebSocket 연결 해제, 외부 라이브러리 정리 등
  });
});
```

### 이벤트

#### cui:routedestroy

페이지가 정리되기 전에 발생합니다.

```javascript
document.addEventListener('cui:routedestroy', function(e){
  console.log('페이지 정리:', e.detail.route.path);
});
```

#### cui:routerender

페이지 렌더링 완료 시 발생합니다.

```javascript
document.addEventListener('cui:routerender', function(e){
  console.log('렌더링 완료');
  console.log('컨테이너:', e.detail.container);
  console.log('라우트:', e.detail.route);
  
  // 추가 초기화 로직
  initCustomComponents(e.detail.container);
});
```

---

## 완전한 예시

### 메인 레이아웃 (index.html)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/dist/catui.css">
</head>
<body>
  <div class="cui-layout-admin">
    <!-- 사이드바 -->
    <aside class="cui-layout-side">
      <ul class="cui-nav">
        <li><a cui-href="/pages/dashboard.html">대시보드</a></li>
        <li><a cui-href="/pages/users.html">사용자 관리</a></li>
        <li><a cui-href="/pages/settings.html">설정</a></li>
      </ul>
    </aside>
    
    <!-- 메인 컨텐츠 -->
    <main class="cui-layout-body">
      <div cui-target-content>
        <!-- 페이지 로드 영역 -->
        <p>메뉴를 선택하세요</p>
      </div>
    </main>
  </div>

  <script src="/dist/catui.js"></script>
  <script>
    Catui.use(['router', 'form', 'table', 'popup'], function(){
      // 라우터 설정
      router.set({
        cache: true,
        beforeEach: function(to){
          // 로딩 표시
          popup.load();
          return true;
        },
        afterEach: function(route){
          popup.closeAll('loading');
        }
      });
      
      // 초기 페이지 로드
      if(!location.hash){
        router.go('/pages/dashboard.html');
      }
    });
  </script>
</body>
</html>
```

### 서브 페이지 (pages/users.html)

```html
<div class="cui-card">
  <div class="cui-card-header">
    <h3>사용자 목록</h3>
  </div>
  <div class="cui-card-body">
    <table id="userTable"></table>
  </div>
</div>

<script>
// 페이지 로드 시 자동 실행
table.render({
  elem: '#userTable',
  url: '/api/users',
  cols: [[
    { type: 'checkbox' },
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: '이름' },
    { field: 'email', title: '이메일' }
  ]],
  page: true
});

// 행 클릭 이벤트
table.on('row(userTable)', function(obj){
  router.go('/pages/user-detail.html?id=' + obj.data.id);
});
</script>
```

---

## CSS 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-router-active` | 현재 활성 링크 |
| `.cui-router-loading` | 로딩 중인 컨테이너 |
| `.cui-router-error` | 에러 메시지 |

### 커스텀 스타일

```css
/* 활성 링크 스타일 */
.cui-router-active {
  color: var(--cui-primary);
  font-weight: bold;
}

/* 로딩 스타일 */
.cui-router-loading {
  opacity: 0.5;
  pointer-events: none;
}

/* 에러 스타일 */
.cui-router-error {
  padding: 40px;
  text-align: center;
  color: var(--cui-danger);
}
```
