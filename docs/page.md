# Page 모듈

페이지네이션을 렌더링하는 모듈입니다.

## 기본 사용법

```html
<div id="page"></div>

<script>
Catui.use(['page'], function(){
  page.render({
    elem: '#page',
    count: 100,
    jump: function(obj, first){
      if(!first){
        console.log('페이지:', obj.curr);
      }
    }
  });
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `render(options)` | 페이지네이션 렌더링 |

---

## render(options)

페이지네이션을 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `count` | Number | 0 | 전체 항목 수 (필수) |
| `limit` | Number | 10 | 페이지당 항목 수 |
| `limits` | Array | [10,20,30,40,50] | 항목 수 선택 옵션 |
| `curr` | Number | 1 | 현재 페이지 |
| `groups` | Number | 5 | 연속 페이지 수 |
| `prev` | String | '이전' | 이전 버튼 텍스트 |
| `next` | String | '다음' | 다음 버튼 텍스트 |
| `first` | String/Boolean | '첫 페이지' | 첫 페이지 버튼 |
| `last` | String/Boolean | '마지막 페이지' | 마지막 페이지 버튼 |
| `layout` | Array | ['prev','page','next'] | 레이아웃 |
| `theme` | String | - | 테마 색상 |
| `hash` | String/Boolean | false | URL 해시 |

### 콜백

| 콜백 | 설명 |
|------|------|
| `jump(obj, first)` | 페이지 변경 시 |

---

## 레이아웃 (layout)

레이아웃 구성 요소를 지정합니다.

| 요소 | 설명 |
|------|------|
| `count` | 총 항목 수 |
| `prev` | 이전 버튼 |
| `page` | 페이지 번호 |
| `next` | 다음 버튼 |
| `limit` | 항목 수 선택 |
| `refresh` | 새로고침 버튼 |
| `skip` | 페이지 이동 입력 |

### 기본 레이아웃

```javascript
page.render({
  elem: '#page',
  count: 100,
  layout: ['prev', 'page', 'next']
});
```

### 전체 레이아웃

```javascript
page.render({
  elem: '#page',
  count: 100,
  layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
});
```

---

## 페이지 변경 콜백 (jump)

```javascript
page.render({
  elem: '#page',
  count: 100,
  limit: 10,
  curr: 1,
  jump: function(obj, first){
    // obj.curr: 현재 페이지
    // obj.limit: 페이지당 항목 수
    // first: 초기 로드 여부
    
    if(!first){
      // 페이지 변경 시만 데이터 로드
      loadData(obj.curr, obj.limit);
    }
  }
});

function loadData(page, limit){
  $.get('/api/data', { page: page, limit: limit }, function(res){
    // 데이터 렌더링
  });
}
```

---

## URL 해시 연동 (hash)

```javascript
page.render({
  elem: '#page',
  count: 100,
  hash: 'page'  // URL에 #page=2 형태로 추가
});

// hash: true 시 기본 해시명 사용
```

---

## 테마 (theme)

```javascript
// 기본 제공 테마
page.render({
  elem: '#page',
  count: 100,
  theme: '#1677ff'  // 커스텀 색상
});
```

---

## 완전한 예시

### 테이블과 연동

```html
<table id="dataTable">
  <thead>
    <tr>
      <th>번호</th>
      <th>제목</th>
      <th>작성자</th>
      <th>날짜</th>
    </tr>
  </thead>
  <tbody id="dataBody"></tbody>
</table>

<div id="page"></div>

<script>
Catui.use(['page'], function(){
  var pageConfig = {
    elem: '#page',
    count: 0,
    limit: 10,
    curr: 1,
    layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
    jump: function(obj, first){
      loadData(obj.curr, obj.limit);
    }
  };
  
  // 초기 데이터 로드 및 페이지 설정
  $.get('/api/list', { page: 1, limit: 10 }, function(res){
    pageConfig.count = res.total;
    page.render(pageConfig);
    renderTable(res.data);
  });
  
  function loadData(pageNum, limit){
    $.get('/api/list', { page: pageNum, limit: limit }, function(res){
      renderTable(res.data);
    });
  }
  
  function renderTable(data){
    var html = '';
    data.forEach(function(item, index){
      html += '<tr>'
        + '<td>' + item.id + '</td>'
        + '<td>' + item.title + '</td>'
        + '<td>' + item.author + '</td>'
        + '<td>' + item.date + '</td>'
        + '</tr>';
    });
    $('#dataBody').html(html);
  }
});
</script>
```

### AJAX와 연동

```javascript
Catui.use(['page', 'popup'], function(){
  var currentPage = 1;
  var pageSize = 10;
  var totalCount = 0;
  
  // 초기 로드
  fetchData();
  
  function fetchData(){
    popup.load();
    
    $.ajax({
      url: '/api/items',
      data: {
        page: currentPage,
        size: pageSize
      },
      success: function(res){
        popup.closeAll('loading');
        
        totalCount = res.total;
        renderItems(res.list);
        renderPage();
      }
    });
  }
  
  function renderPage(){
    page.render({
      elem: '#pagination',
      count: totalCount,
      limit: pageSize,
      curr: currentPage,
      layout: ['count', 'prev', 'page', 'next', 'limit'],
      limits: [10, 20, 50, 100],
      jump: function(obj, first){
        if(!first){
          currentPage = obj.curr;
          pageSize = obj.limit;
          fetchData();
        }
      }
    });
  }
  
  function renderItems(items){
    // 아이템 렌더링
  }
});
```

---

## 스타일 커스터마이징

```css
/* 페이지 버튼 */
.cui-page a,
.cui-page span {
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
}

/* 현재 페이지 */
.cui-page .cui-this {
  background-color: #1677ff;
  color: #fff;
}

/* 비활성 버튼 */
.cui-page .cui-disabled {
  color: #ccc;
  cursor: not-allowed;
}

/* 페이지 입력 */
.cui-page .cui-page-skip input {
  width: 50px;
  height: 28px;
}
```
