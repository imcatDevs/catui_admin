# Dropdown 모듈

드롭다운 메뉴를 제공하는 모듈입니다.

## 기본 사용법

```html
<button class="cui-btn" id="dropdownBtn">드롭다운</button>

<script>
Catui.use(['dropdown'], function(){
  dropdown.render({
    elem: '#dropdownBtn',
    data: [
      { title: '메뉴 1', id: 1 },
      { title: '메뉴 2', id: 2 },
      { title: '메뉴 3', id: 3 }
    ],
    click: function(data){
      console.log(data);
    }
  });
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `render(options)` | 드롭다운 렌더링 |
| `reload(id, options)` | 드롭다운 리로드 |

---

## render(options)

드롭다운을 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `data` | Array | [] | 메뉴 데이터 |
| `id` | String | - | 드롭다운 ID |
| `trigger` | String | 'click' | 트리거 (click/hover) |
| `align` | String | 'left' | 정렬 (left/center/right) |
| `isAllowSpread` | Boolean | true | 하위 메뉴 펼침 허용 |
| `isSpreadItem` | Boolean | true | 초기 펼침 |
| `delay` | Number | 300 | hover 지연 (ms) |
| `className` | String | - | 추가 클래스 |
| `style` | String | - | 추가 스타일 |
| `show` | Boolean | false | 기본 표시 |

### 콜백

| 콜백 | 설명 |
|------|------|
| `click(data, othis)` | 메뉴 클릭 |
| `ready(elem, obj)` | 렌더링 완료 |

---

## 데이터 구조

```javascript
var menuData = [
  { title: '메뉴 1', id: 1 },
  { title: '메뉴 2', id: 2, disabled: true },  // 비활성화
  { type: '-' },  // 구분선
  { title: '메뉴 3', id: 3, href: '/link' },  // 링크
  { 
    title: '서브메뉴',
    id: 4,
    child: [  // 하위 메뉴
      { title: '서브 1', id: 41 },
      { title: '서브 2', id: 42 }
    ]
  }
];
```

### 데이터 속성

| 속성 | 타입 | 설명 |
|------|------|------|
| `title` | String | 메뉴 텍스트 |
| `id` | Any | 고유 식별자 |
| `href` | String | 링크 URL |
| `target` | String | 링크 타겟 |
| `disabled` | Boolean | 비활성화 |
| `child` | Array | 하위 메뉴 |
| `type` | String | '-': 구분선 |
| `templet` | String | 커스텀 템플릿 |

---

## 트리거 (trigger)

```javascript
// 클릭 트리거 (기본)
dropdown.render({
  elem: '#btn1',
  trigger: 'click',
  data: menuData
});

// 호버 트리거
dropdown.render({
  elem: '#btn2',
  trigger: 'hover',
  delay: 200,  // hover 지연 시간
  data: menuData
});
```

---

## 정렬 (align)

```javascript
// 왼쪽 정렬 (기본)
dropdown.render({
  elem: '#btn',
  align: 'left',
  data: menuData
});

// 중앙 정렬
dropdown.render({
  elem: '#btn',
  align: 'center',
  data: menuData
});

// 오른쪽 정렬
dropdown.render({
  elem: '#btn',
  align: 'right',
  data: menuData
});
```

---

## 계층 메뉴

```javascript
dropdown.render({
  elem: '#btn',
  data: [
    {
      title: '파일',
      id: 'file',
      child: [
        { title: '새로 만들기', id: 'new' },
        { title: '열기', id: 'open' },
        { title: '저장', id: 'save' },
        { type: '-' },
        { title: '종료', id: 'exit' }
      ]
    },
    {
      title: '편집',
      id: 'edit',
      child: [
        { title: '실행 취소', id: 'undo' },
        { title: '다시 실행', id: 'redo' },
        { type: '-' },
        { title: '잘라내기', id: 'cut' },
        { title: '복사', id: 'copy' },
        { title: '붙여넣기', id: 'paste' }
      ]
    }
  ],
  click: function(data){
    console.log('선택:', data.id);
  }
});
```

---

## 커스텀 템플릿

```javascript
dropdown.render({
  elem: '#btn',
  data: [
    {
      title: '사용자 1',
      id: 1,
      avatar: '/img/avatar1.jpg',
      templet: '<img src="{{ d.avatar }}" style="width:20px;border-radius:50%;margin-right:8px;">{{ d.title }}'
    },
    {
      title: '사용자 2',
      id: 2,
      avatar: '/img/avatar2.jpg',
      templet: '<img src="{{ d.avatar }}" style="width:20px;border-radius:50%;margin-right:8px;">{{ d.title }}'
    }
  ]
});
```

---

## 리로드

```javascript
var dd = dropdown.render({
  elem: '#btn',
  id: 'myDropdown',
  data: menuData
});

// 데이터 변경 후 리로드
dropdown.reload('myDropdown', {
  data: newMenuData
});
```

---

## 완전한 예시

### 컨텍스트 메뉴

```html
<div id="contextArea" style="width:300px;height:200px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;">
  우클릭하세요
</div>

<script>
Catui.use(['dropdown', 'popup'], function(){
  dropdown.render({
    elem: '#contextArea',
    trigger: 'contextmenu',
    align: 'right',
    data: [
      { title: '새로 만들기', id: 'new', child: [
        { title: '폴더', id: 'folder' },
        { title: '파일', id: 'file' }
      ]},
      { type: '-' },
      { title: '새로고침', id: 'refresh' },
      { type: '-' },
      { title: '속성', id: 'properties' }
    ],
    click: function(data){
      popup.msg('선택: ' + data.title);
    }
  });
});
</script>
```

### 프로필 드롭다운

```html
<button class="cui-btn" id="profileBtn">
  <i class="cui-icon">person</i> 사용자명 <i class="cui-icon">expand_more</i>
</button>

<script>
dropdown.render({
  elem: '#profileBtn',
  data: [
    { title: '<i class="cui-icon">person</i> 내 정보', id: 'profile' },
    { title: '<i class="cui-icon">settings</i> 설정', id: 'settings' },
    { type: '-' },
    { title: '<i class="cui-icon">logout</i> 로그아웃', id: 'logout' }
  ],
  click: function(data){
    if(data.id === 'logout'){
      popup.confirm('로그아웃 하시겠습니까?', function(index){
        // 로그아웃 처리
        popup.close(index);
      });
    } else {
      location.href = '/' + data.id;
    }
  }
});
</script>
```

### 테이블 작업 드롭다운

```javascript
// 테이블 열에서 사용
{
  title: '작업',
  templet: function(d){
    return '<button class="cui-btn cui-btn-xs" id="action' + d.id + '">작업 <i class="cui-icon">expand_more</i></button>';
  }
}

// 테이블 렌더링 후 드롭다운 연결
table.on('done(demo)', function(){
  table.getData('demo').forEach(function(item){
    dropdown.render({
      elem: '#action' + item.id,
      data: [
        { title: '보기', id: 'view' },
        { title: '수정', id: 'edit' },
        { type: '-' },
        { title: '삭제', id: 'delete' }
      ],
      click: function(data){
        if(data.id === 'delete'){
          // 삭제 처리
        }
      }
    });
  });
});
```
