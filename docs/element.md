# Element 모듈

탭, 네비게이션, 진행바, 패널 등 기본 UI 요소를 관리하는 모듈입니다.

## 기본 사용법

```html
<script>
Catui.use(['element'], function(){
  // element는 자동으로 초기화됨
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `render(type, filter)` | 요소 렌더링 |
| `tabChange(filter, layid)` | 탭 전환 |
| `tabAdd(filter, options)` | 탭 추가 |
| `tabDelete(filter, layid)` | 탭 삭제 |
| `progress(filter, percent)` | 진행바 값 설정 |
| `on(events, callback)` | 이벤트 등록 |

---

## 탭 (Tab)

### 탭 HTML 구조

```html
<div class="cui-tab" cui-filter="demo">
  <ul class="cui-tab-title">
    <li class="cui-this" cui-id="tab1">탭1</li>
    <li cui-id="tab2">탭2</li>
    <li cui-id="tab3">탭3</li>
  </ul>
  <div class="cui-tab-content">
    <div class="cui-tab-item cui-show">탭1 내용</div>
    <div class="cui-tab-item">탭2 내용</div>
    <div class="cui-tab-item">탭3 내용</div>
  </div>
</div>
```

### 탭 스타일

```html
<!-- 기본 탭 -->
<div class="cui-tab">...</div>

<!-- 간결한 탭 -->
<div class="cui-tab cui-tab-brief">...</div>

<!-- 카드 탭 -->
<div class="cui-tab cui-tab-card">...</div>
```

### tabChange - 탭 전환

```javascript
element.tabChange('demo', 'tab2');
```

### tabAdd - 탭 추가

```javascript
element.tabAdd('demo', {
  title: '새 탭',
  content: '새 탭 내용',
  id: 'newTab'  // cui-id 값
});
```

### tabDelete - 탭 삭제

```javascript
element.tabDelete('demo', 'tab2');
```

### 탭 이벤트

```javascript
// 탭 전환
element.on('tab(demo)', function(data){
  console.log(data.index);  // 탭 인덱스
  console.log(data.elem);   // 탭 요소
});

// 탭 삭제
element.on('tabDelete(demo)', function(data){
  console.log('삭제됨:', data.index);
});
```

---

## 진행바 (Progress)

### 진행바 HTML 구조

```html
<!-- 기본 -->
<div class="cui-progress" cui-filter="demo">
  <div class="cui-progress-bar" cui-percent="50%"></div>
</div>

<!-- 텍스트 표시 -->
<div class="cui-progress" cui-filter="demo" cui-showpercent="true">
  <div class="cui-progress-bar" cui-percent="70%">
    <span class="cui-progress-text">70%</span>
  </div>
</div>

<!-- 큰 사이즈 -->
<div class="cui-progress cui-progress-big">
  <div class="cui-progress-bar" cui-percent="80%"></div>
</div>
```

### progress - 값 설정

```javascript
element.progress('demo', '75%');

// 동적 업데이트
var percent = 0;
var timer = setInterval(function(){
  percent += 10;
  element.progress('demo', percent + '%');
  if(percent >= 100){
    clearInterval(timer);
  }
}, 500);
```

### 색상

```html
<div class="cui-progress">
  <div class="cui-progress-bar cui-bg-green" cui-percent="60%"></div>
</div>

<div class="cui-progress">
  <div class="cui-progress-bar cui-bg-orange" cui-percent="40%"></div>
</div>

<div class="cui-progress">
  <div class="cui-progress-bar cui-bg-red" cui-percent="20%"></div>
</div>
```

---

## 네비게이션 (Nav)

### 수평 네비게이션

```html
<ul class="cui-nav" cui-filter="demo">
  <li class="cui-nav-item cui-this"><a href="/">홈</a></li>
  <li class="cui-nav-item"><a href="/about">소개</a></li>
  <li class="cui-nav-item">
    <a href="javascript:;">제품</a>
    <dl class="cui-nav-child">
      <dd><a href="/product/1">제품1</a></dd>
      <dd><a href="/product/2">제품2</a></dd>
    </dl>
  </li>
  <li class="cui-nav-item"><a href="/contact">연락처</a></li>
</ul>
```

### 수직 네비게이션

```html
<ul class="cui-nav cui-nav-tree" cui-filter="demo">
  <li class="cui-nav-item cui-nav-itemed">
    <a href="javascript:;">시스템 관리</a>
    <dl class="cui-nav-child">
      <dd><a href="/system/user">사용자 관리</a></dd>
      <dd><a href="/system/role">권한 관리</a></dd>
    </dl>
  </li>
  <li class="cui-nav-item">
    <a href="javascript:;">콘텐츠 관리</a>
    <dl class="cui-nav-child">
      <dd><a href="/content/article">게시글 관리</a></dd>
      <dd><a href="/content/file">파일 관리</a></dd>
    </dl>
  </li>
</ul>
```

### 사이드 네비게이션

```html
<div class="cui-side cui-bg-black">
  <ul class="cui-nav cui-nav-tree cui-nav-side" cui-filter="side">
    <li class="cui-nav-item">
      <a href="javascript:;"><i class="cui-icon">home</i> 대시보드</a>
    </li>
    <li class="cui-nav-item cui-nav-itemed">
      <a href="javascript:;"><i class="cui-icon">settings</i> 설정</a>
      <dl class="cui-nav-child">
        <dd><a href="/settings/basic">기본 설정</a></dd>
        <dd><a href="/settings/security">보안 설정</a></dd>
      </dl>
    </li>
  </ul>
</div>
```

### 네비게이션 이벤트

```javascript
element.on('nav(demo)', function(elem){
  console.log(elem);  // 클릭된 요소
});
```

---

## 패널 (Collapse)

### 패널 HTML 구조

```html
<div class="cui-collapse" cui-filter="demo">
  <div class="cui-colla-item">
    <h2 class="cui-colla-title">패널 1</h2>
    <div class="cui-colla-content">
      <p>패널 1 내용</p>
    </div>
  </div>
  <div class="cui-colla-item">
    <h2 class="cui-colla-title">패널 2</h2>
    <div class="cui-colla-content">
      <p>패널 2 내용</p>
    </div>
  </div>
</div>

<!-- 아코디언 -->
<div class="cui-collapse" cui-filter="demo" cui-accordion>
  ...
</div>
```

### 패널 이벤트

```javascript
element.on('collapse(demo)', function(data){
  console.log(data.show);     // 열림 여부
  console.log(data.title);    // 제목 요소
  console.log(data.content);  // 내용 요소
});
```

---

## 브레드크럼 (Breadcrumb)

```html
<span class="cui-breadcrumb" cui-separator="/">
  <a href="/">홈</a>
  <a href="/category">카테고리</a>
  <a><cite>현재 페이지</cite></a>
</span>

<!-- 커스텀 구분자 -->
<span class="cui-breadcrumb" cui-separator=">">
  <a href="/">홈</a>
  <a href="/category">카테고리</a>
  <a><cite>현재 페이지</cite></a>
</span>
```

---

## 타임라인 (Timeline)

```html
<ul class="cui-timeline">
  <li class="cui-timeline-item">
    <i class="cui-icon cui-timeline-axis">adjust</i>
    <div class="cui-timeline-content cui-text">
      <h3 class="cui-timeline-title">2024년 1월 15일</h3>
      <p>프로젝트 시작</p>
    </div>
  </li>
  <li class="cui-timeline-item">
    <i class="cui-icon cui-timeline-axis">adjust</i>
    <div class="cui-timeline-content cui-text">
      <h3 class="cui-timeline-title">2024년 2월 1일</h3>
      <p>1차 개발 완료</p>
    </div>
  </li>
  <li class="cui-timeline-item">
    <i class="cui-icon cui-timeline-axis">adjust</i>
    <div class="cui-timeline-content cui-text">
      <h3 class="cui-timeline-title">2024년 3월 1일</h3>
      <p>서비스 런칭</p>
    </div>
  </li>
</ul>
```

---

## render(type, filter)

동적으로 추가된 요소를 렌더링합니다.

```javascript
// 전체 렌더링
element.render();

// 특정 타입만 렌더링
element.render('tab');
element.render('nav');
element.render('progress');
element.render('collapse');
element.render('breadcrumb');

// 특정 필터만 렌더링
element.render('tab', 'demo');
```

---

## 완전한 예시

```html
<div class="cui-tab cui-tab-brief" cui-filter="mainTab">
  <ul class="cui-tab-title">
    <li class="cui-this" cui-id="home">
      <i class="cui-icon">home</i> 홈
    </li>
    <li cui-id="user">
      <i class="cui-icon">person</i> 사용자
    </li>
    <li cui-id="settings">
      <i class="cui-icon">settings</i> 설정
    </li>
  </ul>
  <div class="cui-tab-content">
    <div class="cui-tab-item cui-show">
      <h3>홈 탭 내용</h3>
      <p>환영합니다!</p>
    </div>
    <div class="cui-tab-item">
      <h3>사용자 탭 내용</h3>
      <p>사용자 목록이 표시됩니다.</p>
    </div>
    <div class="cui-tab-item">
      <h3>설정 탭 내용</h3>
      <p>설정을 변경할 수 있습니다.</p>
    </div>
  </div>
</div>

<button class="cui-btn" id="addTab">탭 추가</button>
<button class="cui-btn" id="delTab">탭 삭제</button>

<script>
Catui.use(['element'], function(){
  // 탭 이벤트
  element.on('tab(mainTab)', function(data){
    console.log('탭 전환:', data.index);
  });
  
  // 탭 추가
  var tabIndex = 0;
  $c('#addTab').on('click', function(){
    tabIndex++;
    element.tabAdd('mainTab', {
      title: '새 탭 ' + tabIndex,
      content: '새 탭 ' + tabIndex + ' 내용',
      id: 'new' + tabIndex
    });
    element.tabChange('mainTab', 'new' + tabIndex);
  });
  
  // 마지막 탭 삭제
  $c('#delTab').on('click', function(){
    if(tabIndex > 0){
      element.tabDelete('mainTab', 'new' + tabIndex);
      tabIndex--;
    }
  });
});
</script>
```
