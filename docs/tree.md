# Tree 모듈

트리 구조를 렌더링하고 관리하는 모듈입니다.

## 기본 사용법

```html
<div id="tree"></div>

<script>
Catui.use(['tree'], function(){
  tree.render({
    elem: '#tree',
    data: [
      { id: 1, title: '부모 노드', children: [
        { id: 2, title: '자식 노드 1' },
        { id: 3, title: '자식 노드 2' }
      ]}
    ]
  });
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `render(options)` | 트리 렌더링 |
| `reload(id, options)` | 트리 리로드 |
| `getChecked(id)` | 체크된 노드 가져오기 |
| `setChecked(id, nodeId)` | 노드 체크 설정 |
| `getInst(id)` | 인스턴스 가져오기 |
| `on(events, callback)` | 이벤트 등록 |

---

## render(options)

트리를 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `id` | String | - | 트리 ID |
| `data` | Array | [] | 트리 데이터 |
| `showCheckbox` | Boolean | false | 체크박스 표시 |
| `showLine` | Boolean | true | 연결선 표시 |
| `accordion` | Boolean | false | 아코디언 모드 |
| `onlyIconControl` | Boolean | false | 아이콘으로만 펼침/접기 |
| `isJump` | Boolean | false | 링크 새창 열기 |
| `edit` | Array/Boolean | false | 편집 버튼 |
| `text` | Object | {} | 텍스트 설정 |

### 콜백

| 콜백 | 설명 |
|------|------|
| `click(obj)` | 노드 클릭 |
| `oncheck(obj)` | 체크박스 변경 |
| `operate(obj)` | 편집 버튼 클릭 |

### 예시

```javascript
tree.render({
  elem: '#tree',
  id: 'demoTree',
  data: treeData,
  showCheckbox: true,
  showLine: true,
  accordion: true,
  click: function(obj){
    console.log('클릭:', obj.data);
  },
  oncheck: function(obj){
    console.log('체크:', obj.data, obj.checked);
  }
});
```

---

## 데이터 구조

```javascript
var treeData = [
  {
    id: 1,
    title: '노드명',
    spread: true,       // 펼침 여부
    checked: false,     // 체크 여부
    disabled: false,    // 비활성화
    href: '/link',      // 링크 URL
    target: '_blank',   // 링크 타겟
    children: [         // 자식 노드
      {
        id: 2,
        title: '자식 노드 1'
      },
      {
        id: 3,
        title: '자식 노드 2',
        children: [
          { id: 4, title: '손자 노드' }
        ]
      }
    ]
  },
  {
    id: 5,
    title: '노드 2'
  }
];
```

---

## reload(id, options)

트리를 리로드합니다.

```javascript
// 전체 리로드
tree.reload('demoTree');

// 새 데이터로 리로드
tree.reload('demoTree', {
  data: newTreeData
});
```

---

## getChecked(id)

체크된 노드들을 가져옵니다.

```javascript
var checkedNodes = tree.getChecked('demoTree');

console.log(checkedNodes);
// [{ id: 1, title: '노드1', ... }, { id: 2, title: '노드2', ... }]
```

---

## setChecked(id, nodeId)

특정 노드를 체크합니다.

```javascript
// 단일 노드 체크
tree.setChecked('demoTree', 3);

// 여러 노드 체크
tree.setChecked('demoTree', [1, 3, 5]);
```

---

## 이벤트

### click - 노드 클릭

```javascript
tree.on('click(demoFilter)', function(obj){
  console.log(obj.data);   // 노드 데이터
  console.log(obj.elem);   // 노드 요소
  console.log(obj.state);  // 펼침 상태 ('open', 'close', 'normal')
});
```

### checkbox - 체크박스 변경

```javascript
tree.on('checkbox(demoFilter)', function(obj){
  console.log(obj.data);     // 노드 데이터
  console.log(obj.checked);  // 체크 상태
  console.log(obj.elem);     // 노드 요소
});
```

### operate - 편집 버튼 클릭

```javascript
tree.on('operate(demoFilter)', function(obj){
  console.log(obj.data);  // 노드 데이터
  console.log(obj.type);  // 버튼 타입: 'add', 'update', 'del'
  console.log(obj.elem);  // 노드 요소
  
  if(obj.type === 'add'){
    // 자식 노드 추가
  } else if(obj.type === 'update'){
    // 노드 수정
  } else if(obj.type === 'del'){
    // 노드 삭제
  }
});
```

---

## 편집 모드

```javascript
tree.render({
  elem: '#tree',
  id: 'editTree',
  data: treeData,
  edit: ['add', 'update', 'del'],  // 또는 true (모두 표시)
  operate: function(obj){
    var type = obj.type;
    var data = obj.data;
    
    if(type === 'add'){
      popup.prompt({ title: '노드 추가' }, function(value, index){
        // 노드 추가 처리
        popup.close(index);
        tree.reload('editTree');
      });
    }
    
    if(type === 'update'){
      popup.prompt({ 
        title: '노드 수정',
        value: data.title
      }, function(value, index){
        // 노드 수정 처리
        popup.close(index);
        tree.reload('editTree');
      });
    }
    
    if(type === 'del'){
      popup.confirm('삭제하시겠습니까?', function(index){
        // 노드 삭제 처리
        popup.close(index);
        tree.reload('editTree');
      });
    }
  }
});
```

---

## 연결선 표시

```javascript
tree.render({
  elem: '#tree',
  data: treeData,
  showLine: true  // 연결선 표시
});
```

```css
/* 연결선 스타일 커스터마이징 */
.cui-tree-line .cui-tree-entry:before {
  border-left-color: #ccc;
}

.cui-tree-line .cui-tree-entry:after {
  border-top-color: #ccc;
}
```

---

## 아코디언 모드

한 번에 하나의 노드만 펼칠 수 있습니다.

```javascript
tree.render({
  elem: '#tree',
  data: treeData,
  accordion: true
});
```

---

## 체크박스 연동

부모-자식 간 체크 연동을 처리합니다.

```javascript
tree.render({
  elem: '#tree',
  data: treeData,
  showCheckbox: true,
  oncheck: function(obj){
    // 체크된 모든 노드 ID
    var checkedIds = tree.getChecked('demoTree').map(function(item){
      return item.id;
    });
    
    console.log('선택된 ID:', checkedIds);
  }
});
```

---

## 비동기 데이터 로드

```javascript
// 초기 로드
$.get('/api/tree', function(data){
  tree.render({
    elem: '#tree',
    id: 'asyncTree',
    data: data
  });
});

// 동적 자식 노드 로드
tree.on('click(asyncFilter)', function(obj){
  if(!obj.data.children && !obj.data.loaded){
    $.get('/api/tree/children', { parentId: obj.data.id }, function(children){
      obj.data.children = children;
      obj.data.loaded = true;
      tree.reload('asyncTree');
    });
  }
});
```

---

## 노드 검색

```javascript
function searchTree(keyword){
  var results = [];
  
  function search(nodes){
    nodes.forEach(function(node){
      if(node.title.indexOf(keyword) > -1){
        results.push(node);
      }
      if(node.children){
        search(node.children);
      }
    });
  }
  
  search(treeData);
  return results;
}

// 검색 결과 하이라이트
$('#searchInput').on('input', function(){
  var keyword = $(this).val();
  var results = searchTree(keyword);
  
  // 결과 노드들 펼치기 및 하이라이트
  results.forEach(function(node){
    $('[data-id="' + node.id + '"]').addClass('highlight');
  });
});
```

---

## 완전한 예시

```html
<div class="cui-form-item">
  <input type="text" id="treeSearch" class="cui-input" placeholder="검색...">
</div>
<div id="tree"></div>

<script>
Catui.use(['tree', 'popup'], function(){
  var treeData = [
    {
      id: 1,
      title: '시스템 관리',
      spread: true,
      children: [
        { id: 11, title: '사용자 관리' },
        { id: 12, title: '권한 관리' },
        { id: 13, title: '메뉴 관리' }
      ]
    },
    {
      id: 2,
      title: '콘텐츠 관리',
      children: [
        { id: 21, title: '게시판 관리' },
        { id: 22, title: '파일 관리' }
      ]
    }
  ];
  
  tree.render({
    elem: '#tree',
    id: 'menuTree',
    data: treeData,
    showCheckbox: true,
    showLine: true,
    edit: ['add', 'update', 'del'],
    click: function(obj){
      console.log('선택:', obj.data.title);
    },
    oncheck: function(obj){
      var checked = tree.getChecked('menuTree');
      console.log('체크된 노드:', checked.length + '개');
    },
    operate: function(obj){
      if(obj.type === 'del'){
        popup.confirm('정말 삭제하시겠습니까?', function(index){
          popup.msg('삭제되었습니다.');
          popup.close(index);
        });
      }
    }
  });
});
</script>
```
