# PageTabs 모듈

페이지 탭 관리 모듈입니다. Router와 연동하여 SPA에서 다중 탭 인터페이스를 제공합니다.

## 기본 사용법

```html
<!-- 탭 컨테이너 -->
<div id="cuiPagetabs" class="cui-pagetabs" style="display:none;">
  <div class="cui-pagetabs-ctrl">
    <span class="cui-pagetabs-prev"><i class="cui-icon">chevron_left</i></span>
    <span class="cui-pagetabs-next"><i class="cui-icon">chevron_right</i></span>
  </div>
  <div class="cui-pagetabs-wrap">
    <ul class="cui-pagetabs-list"></ul>
  </div>
  <div class="cui-pagetabs-menu">
    <i class="cui-icon">more_vert</i>
    <dl class="cui-pagetabs-dropdown">
      <dd data-action="closeThis">현재 탭 닫기</dd>
      <dd data-action="closeOther">다른 탭 닫기</dd>
      <dd data-action="closeAll">모두 닫기</dd>
    </dl>
  </div>
</div>

<script>
Catui.use(['pagetabs', 'router'], function(){
  // 페이지 탭 초기화
  pagetabs.set({
    homePath: '/pages/home.html'
  }).init();
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `set(options)` | 전역 설정 |
| `init()` | 초기화 |
| `add(options)` | 탭 추가 |
| `active(id)` | 탭 활성화 |
| `remove(id)` | 탭 삭제 |
| `removeThis()` | 현재 탭 삭제 |
| `removeOther()` | 다른 탭 모두 삭제 |
| `removeAll()` | 모든 탭 삭제 (홈 제외) |
| `scroll(direction)` | 탭 스크롤 |
| `has(id)` | 탭 존재 여부 |
| `getActive()` | 현재 활성 탭 ID |
| `get(id)` | 탭 데이터 가져오기 |
| `getAll()` | 모든 탭 ID 목록 |

---

## set(options)

전역 설정을 적용합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `container` | String | '#cuiPagetabs' | 탭 컨테이너 선택자 |
| `listSelector` | String | '.cui-pagetabs-list' | 탭 목록 선택자 |
| `wrapSelector` | String | '.cui-pagetabs-wrap' | 탭 래퍼 선택자 |
| `homeTab` | Boolean | true | 홈 탭 표시 여부 |
| `homeIcon` | String | 'home' | 홈 탭 아이콘 |
| `homePath` | String | '/examples/router/pages/home.html' | 홈 경로 |
| `maxTabs` | Number | 20 | 최대 탭 수 |
| `closeable` | Boolean | true | 탭 닫기 버튼 표시 |
| `onChange` | Function | null | 탭 변경 콜백 |
| `onAdd` | Function | null | 탭 추가 콜백 |
| `onRemove` | Function | null | 탭 삭제 콜백 |

```javascript
pagetabs.set({
  homePath: '/pages/dashboard.html',
  maxTabs: 15,
  onChange: function(tab){
    console.log('탭 변경:', tab.title);
  }
});
```

---

## init()

페이지 탭을 초기화합니다. 홈 탭이 자동으로 추가됩니다.

```javascript
pagetabs.init();
```

---

## add(options)

새 탭을 추가합니다. 이미 존재하는 탭이면 활성화만 수행합니다.

### add 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| `id` | String | 탭 고유 ID (없으면 path 사용) |
| `path` | String | 페이지 경로 |
| `title` | String | 탭 제목 |
| `icon` | String | 탭 아이콘 |
| `closeable` | Boolean | 닫기 버튼 표시 (기본: true) |

```javascript
pagetabs.add({
  id: 'user-list',
  path: '/pages/user/list.html',
  title: '사용자 목록',
  icon: 'person'
});
```

---

## active(id)

지정한 탭을 활성화합니다.

```javascript
pagetabs.active('user-list');
```

---

## remove(id)

지정한 탭을 삭제합니다. closeable이 false인 탭은 삭제되지 않습니다.

```javascript
pagetabs.remove('user-list');
```

---

## removeThis()

현재 활성화된 탭을 삭제합니다.

```javascript
pagetabs.removeThis();
```

---

## removeOther()

현재 탭을 제외한 다른 모든 탭을 삭제합니다.

```javascript
pagetabs.removeOther();
```

---

## removeAll()

홈 탭을 제외한 모든 탭을 삭제합니다.

```javascript
pagetabs.removeAll();
```

---

## scroll(direction)

탭 목록을 스크롤합니다.

```javascript
// 왼쪽으로 스크롤
pagetabs.scroll('left');
pagetabs.scroll(-1);

// 오른쪽으로 스크롤
pagetabs.scroll('right');
pagetabs.scroll(1);
```

---

## has(id)

탭 존재 여부를 확인합니다.

```javascript
if(pagetabs.has('user-list')){
  console.log('탭이 존재합니다');
}
```

---

## getActive()

현재 활성화된 탭의 ID를 반환합니다.

```javascript
var activeId = pagetabs.getActive();
console.log(activeId);  // 'user-list'
```

---

## get(id)

지정한 탭의 데이터를 반환합니다.

```javascript
var tab = pagetabs.get('user-list');
console.log(tab);
// { id: 'user-list', path: '/pages/user/list.html', title: '사용자 목록', ... }
```

---

## getAll()

모든 탭의 ID 목록을 배열로 반환합니다.

```javascript
var allTabs = pagetabs.getAll();
console.log(allTabs);  // ['home', 'user-list', 'settings']
```

---

## Router 연동

Router와 함께 사용하면 페이지 이동 시 자동으로 탭이 관리됩니다.

```javascript
Catui.use(['router', 'pagetabs'], function(){
  // 페이지 탭 초기화
  pagetabs.set({
    homePath: '/pages/home.html'
  }).init();

  // 라우터 설정 - pageTabs 옵션 활성화
  router.set({
    pageTabs: true,
    afterEach: function(route){
      console.log('페이지 로드 완료:', route.path);
    }
  });

  // 메뉴 클릭 시 탭 자동 추가/활성화
  // cui-href 속성이 있는 링크 클릭 시 router가 자동으로 pagetabs.add() 호출
});
```

### 탭 클릭 시 동작

탭을 클릭하면:

1. 해당 경로의 캐시가 삭제됨 (`router.clearCache(path)`)
2. 페이지가 리로드됨 (`router.go(path)`)

이를 통해 항상 최신 데이터를 표시합니다.

---

## CSS 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-pagetabs` | 컨테이너 |
| `.cui-pagetabs-list` | 탭 목록 (ul) |
| `.cui-pagetabs-item` | 탭 항목 (li) |
| `.cui-pagetabs-active` | 활성 탭 |
| `.cui-pagetabs-home` | 홈 탭 |
| `.cui-pagetabs-close` | 닫기 버튼 |
| `.cui-pagetabs-wrap` | 스크롤 영역 |
| `.cui-pagetabs-prev` | 이전 버튼 |
| `.cui-pagetabs-next` | 다음 버튼 |

### 커스텀 스타일링

```css
/* 활성 탭 스타일 */
.cui-pagetabs-active {
  background: var(--cui-primary);
  color: #fff;
}

/* 홈 탭 아이콘 색상 */
.cui-pagetabs-home .cui-icon {
  color: var(--cui-primary);
}

/* 탭 높이 조정 */
.cui-pagetabs-item {
  height: 32px;
  line-height: 32px;
}
```

---

## 완성된 예제

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/dist/catui.css">
</head>
<body>
  <div class="cui-layout-admin">
    <!-- 헤더 -->
    <header class="cui-header">
      <div class="cui-logo">Catui Admin</div>
    </header>

    <!-- 사이드바 -->
    <aside class="cui-side">
      <ul class="cui-nav cui-nav-tree">
        <li><a cui-href="/pages/home.html">홈</a></li>
        <li><a cui-href="/pages/users.html">사용자</a></li>
        <li><a cui-href="/pages/settings.html">설정</a></li>
      </ul>
    </aside>

    <!-- 페이지 탭 -->
    <div id="cuiPagetabs" class="cui-pagetabs" style="display:none;">
      <div class="cui-pagetabs-ctrl">
        <span class="cui-pagetabs-prev"><i class="cui-icon">chevron_left</i></span>
        <span class="cui-pagetabs-next"><i class="cui-icon">chevron_right</i></span>
      </div>
      <div class="cui-pagetabs-wrap">
        <ul class="cui-pagetabs-list"></ul>
      </div>
      <div class="cui-pagetabs-menu">
        <i class="cui-icon">more_vert</i>
        <dl class="cui-pagetabs-dropdown">
          <dd data-action="closeThis">현재 탭 닫기</dd>
          <dd data-action="closeOther">다른 탭 닫기</dd>
          <dd data-action="closeAll">모두 닫기</dd>
        </dl>
      </div>
    </div>

    <!-- 콘텐츠 영역 -->
    <main class="cui-body">
      <div cui-target-content></div>
    </main>
  </div>

  <script src="/dist/catui.js"></script>
  <script>
    Catui.use(['router', 'pagetabs', 'element'], function(){
      // 페이지 탭 초기화
      pagetabs.set({
        homePath: '/pages/home.html',
        maxTabs: 10,
        onChange: function(tab){
          console.log('탭 변경:', tab.path);
        }
      }).init();

      // 라우터 설정
      router.set({
        pageTabs: true,
        cache: true,
        afterEach: function(route){
          element.render();
        }
      });

      // 초기 페이지 로드
      router.go('/pages/home.html');
    });
  </script>
</body>
</html>
```
