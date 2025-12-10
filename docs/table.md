# Table 모듈

데이터 테이블을 렌더링하고 관리하는 모듈입니다.

## 기본 사용법

```html
<table id="demo" cui-filter="test"></table>

<script>
Catui.use(['table'], function(){
  table.render({
    elem: '#demo',
    url: '/api/data',
    cols: [[
      { field: 'id', title: 'ID', width: 80 },
      { field: 'name', title: '이름', width: 150 },
      { field: 'status', title: '상태' }
    ]]
  });
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `render(options)` | 테이블 렌더링 |
| `reload(id, options, deep)` | 테이블 리로드 |
| `checkStatus(id)` | 체크된 행 가져오기 |
| `getData(id)` | 전체 데이터 가져오기 |
| `setRowChecked(id, opts)` | 행 체크 설정 |
| `resize(id)` | 크기 재조정 |
| `exportFile(id, data, type)` | 파일 내보내기 |
| `destroy(id)` | 인스턴스 정리 |
| `on(events, callback)` | 이벤트 등록 |

---

## render(options)

테이블을 렌더링합니다.

### 기본 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `id` | String | - | 테이블 ID |
| `url` | String | - | 데이터 URL |
| `data` | Array | - | 직접 데이터 |
| `cols` | Array | - | 열 정의 (필수) |
| `page` | Boolean/Object | false | 페이지네이션 |
| `limit` | Number | 10 | 페이지당 개수 |
| `limits` | Array | [10,20,30,50,100] | 개수 선택 옵션 |
| `where` | Object | {} | 요청 파라미터 |
| `method` | String | 'get' | 요청 방식 |
| `height` | Number/String | - | 테이블 높이 |
| `width` | Number | - | 테이블 너비 |
| `skin` | String | - | 스킨 (line, row, nob) |
| `even` | Boolean | false | 줄무늬 배경 |
| `toolbar` | String/Boolean | false | 툴바 |
| `defaultToolbar` | Array | ['filter','exports','print'] | 기본 툴바 |
| `title` | String | 'table' | 내보내기 파일명 |
| `loading` | Boolean | true | 로딩 표시 |
| `text` | Object | {} | 텍스트 설정 |

### 열(cols) 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| `field` | String | 필드명 |
| `title` | String | 열 제목 |
| `width` | Number/String | 너비 |
| `minWidth` | Number | 최소 너비 |
| `type` | String | 특수 열 (checkbox, radio, numbers) |
| `fixed` | String | 고정 (left, right) |
| `hide` | Boolean | 숨김 |
| `sort` | Boolean | 정렬 |
| `align` | String | 정렬 (left, center, right) |
| `style` | String | 스타일 |
| `templet` | String/Function | 템플릿 |
| `toolbar` | String | 도구 버튼 템플릿 |
| `edit` | String | 편집 (text) |
| `event` | String | 이벤트명 |

### 콜백

| 콜백 | 설명 |
|------|------|
| `done(res, curr, count)` | 렌더링 완료 |
| `parseData(res)` | 데이터 파싱 |
| `request` | 요청 파라미터명 설정 |
| `response` | 응답 필드명 설정 |

### 예시

```javascript
table.render({
  elem: '#demo',
  url: '/api/users',
  id: 'userTable',
  toolbar: '#toolbarTpl',
  page: true,
  limit: 20,
  cols: [[
    { type: 'checkbox', fixed: 'left' },
    { field: 'id', title: 'ID', width: 80, sort: true },
    { field: 'username', title: '사용자명', width: 150 },
    { field: 'email', title: '이메일', width: 200 },
    { field: 'status', title: '상태', width: 100, templet: function(d){
      return d.status === 1 ? '<span class="green">활성</span>' : '<span class="red">비활성</span>';
    }},
    { field: 'createTime', title: '생성일', width: 180 },
    { title: '작업', width: 150, toolbar: '#barTpl', fixed: 'right' }
  ]],
  done: function(res, curr, count){
    console.log('총 ' + count + '건');
  }
});
```

---

## reload(id, options, deep)

테이블을 리로드합니다.

```javascript
// 기본 리로드
table.reload('userTable');

// 조건 변경 리로드
table.reload('userTable', {
  where: {
    keyword: '검색어',
    status: 1
  },
  page: { curr: 1 }
});

// 딥 리로드 (모든 옵션 재설정)
table.reload('userTable', { url: '/api/newData' }, true);
```

---

## checkStatus(id)

체크된 행들의 정보를 가져옵니다.

```javascript
var status = table.checkStatus('userTable');

console.log(status.data);    // 체크된 행 데이터 배열
console.log(status.isAll);   // 전체 선택 여부
```

---

## getData(id)

테이블의 전체 데이터를 가져옵니다.

```javascript
var allData = table.getData('userTable');
console.log(allData);
```

---

## setRowChecked(id, opts)

특정 행의 체크 상태를 설정합니다.

```javascript
// 특정 인덱스 체크
table.setRowChecked('userTable', {
  index: 0,
  checked: true
});

// 전체 체크
table.setRowChecked('userTable', {
  index: 'all',
  checked: true
});
```

---

## exportFile(id, data, type)

테이블 데이터를 파일로 내보냅니다.

```javascript
// 현재 테이블 데이터 내보내기
table.exportFile('userTable');

// 커스텀 데이터 내보내기
table.exportFile('userTable', [
  ['ID', '이름', '이메일'],
  [1, '홍길동', 'hong@test.com'],
  [2, '김철수', 'kim@test.com']
], 'csv');
```

---

## 이벤트

### 행 클릭

```javascript
table.on('row(test)', function(obj){
  console.log(obj.data);   // 행 데이터
  console.log(obj.tr);     // tr 요소
  
  obj.tr.addClass('selected');
});
```

### 행 더블클릭

```javascript
table.on('rowDouble(test)', function(obj){
  popup.open({
    title: '상세보기',
    content: JSON.stringify(obj.data)
  });
});
```

### 체크박스

```javascript
table.on('checkbox(test)', function(obj){
  console.log(obj.checked);  // 체크 상태
  console.log(obj.data);     // 체크된 데이터
  console.log(obj.type);     // one 또는 all
});
```

### 도구 버튼

```javascript
// HTML
<script type="text/html" id="barTpl">
  <a class="cui-btn cui-btn-xs" cui-event="edit">수정</a>
  <a class="cui-btn cui-btn-xs cui-btn-danger" cui-event="del">삭제</a>
</script>

// JS
table.on('tool(test)', function(obj){
  var data = obj.data;
  var event = obj.event;
  
  if(event === 'edit'){
    // 수정 처리
  } else if(event === 'del'){
    popup.confirm('삭제하시겠습니까?', function(index){
      obj.del();  // 행 삭제
      popup.close(index);
    });
  }
});
```

### 툴바 버튼

```javascript
// HTML
<script type="text/html" id="toolbarTpl">
  <div class="cui-btn-container">
    <button class="cui-btn cui-btn-sm" cui-event="add">추가</button>
    <button class="cui-btn cui-btn-sm cui-btn-danger" cui-event="batchDel">일괄삭제</button>
  </div>
</script>

// JS
table.on('toolbar(test)', function(obj){
  if(obj.event === 'add'){
    // 추가 처리
  } else if(obj.event === 'batchDel'){
    var checked = table.checkStatus('userTable').data;
    if(checked.length === 0){
      popup.msg('선택된 항목이 없습니다.');
      return;
    }
    // 삭제 처리
  }
});
```

### 셀 편집

```javascript
table.on('edit(test)', function(obj){
  console.log(obj.field);  // 필드명
  console.log(obj.value);  // 수정된 값
  console.log(obj.data);   // 행 데이터
  
  // 서버 저장 처리
});
```

### 정렬

```javascript
table.on('sort(test)', function(obj){
  console.log(obj.field);  // 정렬 필드
  console.log(obj.type);   // asc, desc, null
  
  // 서버 정렬
  table.reload('userTable', {
    initSort: obj,
    where: {
      orderField: obj.field,
      orderType: obj.type
    }
  });
});
```

---

## 템플릿

### 문자열 템플릿

```javascript
{ 
  field: 'status', 
  title: '상태',
  templet: '<div>{{= d.status === 1 ? "활성" : "비활성" }}</div>'
}
```

### 함수 템플릿

```javascript
{ 
  field: 'avatar', 
  title: '프로필',
  templet: function(d){
    return '<img src="' + d.avatar + '" width="30">';
  }
}
```

### ID 템플릿

```html
<script type="text/html" id="statusTpl">
  {{# if(d.status === 1){ }}
    <span class="cui-badge cui-bg-green">활성</span>
  {{# } else { }}
    <span class="cui-badge cui-bg-gray">비활성</span>
  {{# } }}
</script>

<script>
{ field: 'status', title: '상태', templet: '#statusTpl' }
</script>
```

---

## 스킨

```javascript
table.render({
  elem: '#demo',
  skin: 'line',  // line: 행 구분선, row: 열 구분선, nob: 구분선 없음
  even: true,    // 줄무늬 배경
  size: 'sm'     // sm: 작게, lg: 크게
});
```

---

## 고정 열

```javascript
cols: [[
  { type: 'checkbox', fixed: 'left' },
  { field: 'id', title: 'ID', fixed: 'left' },
  { field: 'name', title: '이름' },
  { field: 'email', title: '이메일' },
  // ... 많은 열
  { title: '작업', toolbar: '#barTpl', fixed: 'right' }
]]
```

---

## 다중 헤더

```javascript
cols: [
  [
    { field: 'id', title: 'ID', rowspan: 2 },
    { title: '기본정보', colspan: 2, align: 'center' },
    { title: '기타', colspan: 2, align: 'center' }
  ],
  [
    { field: 'name', title: '이름' },
    { field: 'email', title: '이메일' },
    { field: 'status', title: '상태' },
    { field: 'createTime', title: '생성일' }
  ]
]
```

---

## 응답 데이터 형식

### 기본 형식

```json
{
  "code": 0,
  "msg": "",
  "count": 100,
  "data": [
    { "id": 1, "name": "홍길동" },
    { "id": 2, "name": "김철수" }
  ]
}
```

### 커스텀 형식

```javascript
table.render({
  elem: '#demo',
  url: '/api/data',
  parseData: function(res){
    return {
      code: res.status,
      msg: res.message,
      count: res.total,
      data: res.list
    };
  },
  response: {
    statusCode: 200
  }
});
```
