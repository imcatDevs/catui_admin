# Transfer 모듈

이중 목록(트랜스퍼) 컴포넌트를 제공하는 모듈입니다.

## 기본 사용법

```html
<div id="transfer"></div>

<script>
Catui.use(['transfer'], function(){
  transfer.render({
    elem: '#transfer',
    data: [
      { value: '1', title: '항목 1' },
      { value: '2', title: '항목 2' },
      { value: '3', title: '항목 3' }
    ]
  });
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `render(options)` | 트랜스퍼 렌더링 (인스턴스 반환) |
| `set(options)` | 전역 설정 |
| `getInst(id)` | 인스턴스 가져오기 |
| `on(events, callback)` | 이벤트 등록 |

### 인스턴스 메서드

| 메서드 | 설명 |
|--------|------|
| `reload(options)` | 리로드 |
| `getData()` | 선택된 데이터 가져오기 |
| `config` | 설정 객체 |

---

## render(options)

트랜스퍼를 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `data` | Array | [] | 데이터 (필수) |
| `id` | String | - | 트랜스퍼 ID |
| `title` | Array | ['목록','선택됨'] | 양쪽 제목 |
| `value` | Array | [] | 선택된 값 |
| `showSearch` | Boolean | false | 검색창 표시 |
| `width` | Number | 200 | 너비 |
| `height` | Number | 340 | 높이 |
| `text` | Object | {} | 텍스트 설정 |
| `parseData` | Function | - | 데이터 파싱 |

### 콜백

| 콜백 | 설명 |
|------|------|
| `onchange(data, index)` | 데이터 변경 |

---

## 데이터 구조

```javascript
var data = [
  { value: '1', title: '항목 1' },
  { value: '2', title: '항목 2', disabled: true },
  { value: '3', title: '항목 3', checked: true }
];
```

| 속성 | 타입 | 설명 |
|------|------|------|
| `value` | String | 값 (필수) |
| `title` | String | 표시 텍스트 (필수) |
| `disabled` | Boolean | 비활성화 |
| `checked` | Boolean | 초기 선택 |

---

## 검색 기능

```javascript
transfer.render({
  elem: '#transfer',
  data: data,
  showSearch: true
});
```

---

## 초기 선택

```javascript
transfer.render({
  elem: '#transfer',
  data: data,
  value: ['1', '3']  // 선택된 항목
});
```

---

## 데이터 파싱

서버 데이터를 변환할 때 사용합니다.

```javascript
transfer.render({
  elem: '#transfer',
  data: serverData,
  parseData: function(res){
    return {
      value: res.id,
      title: res.name,
      disabled: res.status === 0
    };
  }
});
```

---

## API

### getData(id)

선택된 데이터를 가져옵니다.

```javascript
var selected = transfer.getData('myTransfer');
console.log(selected);
// [{ value: '1', title: '항목 1' }, ...]
```

### reload(id, options)

트랜스퍼를 리로드합니다.

```javascript
transfer.reload('myTransfer', {
  data: newData
});
```

---

## 완전한 예시

### 권한 할당

```html
<div id="roleTransfer"></div>
<button class="cui-btn cui-btn-primary" id="saveRoles">저장</button>

<script>
Catui.use(['transfer', 'popup'], function(){
  transfer.render({
    elem: '#roleTransfer',
    id: 'roleTransfer',
    title: ['전체 권한', '할당된 권한'],
    data: [
      { value: 'user_view', title: '사용자 조회' },
      { value: 'user_edit', title: '사용자 수정' },
      { value: 'user_delete', title: '사용자 삭제' },
      { value: 'role_view', title: '권한 조회' },
      { value: 'role_edit', title: '권한 수정' },
      { value: 'menu_view', title: '메뉴 조회' },
      { value: 'menu_edit', title: '메뉴 수정' }
    ],
    value: ['user_view'],  // 기존 할당된 권한
    showSearch: true,
    onchange: function(data, index){
      console.log('선택 변경:', data);
    }
  });
  
  $c('#saveRoles').on('click', function(){
    var selected = transfer.getData('roleTransfer');
    var values = selected.map(function(item){
      return item.value;
    });
    
    $.post('/api/saveRoles', { roles: values }, function(res){
      popup.msg('저장되었습니다.');
    });
  });
});
</script>
```

### 부서 이동

```html
<div id="deptTransfer"></div>

<script>
$.get('/api/departments', function(departments){
  transfer.render({
    elem: '#deptTransfer',
    title: ['전체 부서', '선택된 부서'],
    data: departments,
    parseData: function(item){
      return {
        value: item.deptId,
        title: item.deptName
      };
    },
    showSearch: true,
    width: 250,
    height: 400
  });
});
</script>
```
