# Popup 모듈

팝업, 모달, 레이어, 알림 등 다양한 형태의 팝업을 제공하는 모듈입니다.

## 기본 사용법

```javascript
Catui.use(['popup'], function(){
  popup.open({
    title: '제목',
    content: '내용입니다.'
  });
});
```

---

## API 목록

| API | 설명 |
|-----|------|
| `open(options)` | 기본 팝업 열기 |
| `close(index)` | 특정 팝업 닫기 |
| `closeAll(type)` | 모든 팝업 닫기 |
| `alert(content, options, callback)` | 알림창 |
| `confirm(content, options, yes, cancel)` | 확인창 |
| `msg(content, options, callback)` | 메시지 |
| `load(icon, options)` | 로딩 |
| `tips(content, follow, options)` | 툴팁 |
| `prompt(options, yes)` | 입력창 |
| `photos(options)` | 사진 뷰어 |
| `toast(options)` | 토스트 메시지 |
| `notice(options)` | 공지 (하루 안보기) |
| `tab(options)` | 탭 레이어 |
| `drawer(options)` | 슬라이드 오버레이 |
| `style(index, css)` | 동적 스타일 변경 |
| `full(index)` | 전체화면 |
| `min(index)` | 최소화 |
| `restore(index)` | 복원 |
| `setTop(layero)` | 최상위로 |
| `iframeSrc(index, url)` | iframe URL 변경 |
| `closeLast()` | 마지막 팝업 닫기 |
| `title(title, idx)` | 제목 변경 |
| `content(content, idx)` | 내용 변경 |
| `getPopup(idx)` | 팝업 인스턴스 가져오기 |
| `getChildFrame(selector, idx)` | iframe 내부 요소 가져오기 |
| `getFrameIndex(win)` | iframe window의 팝업 인덱스 |
| `iframeAuto(idx)` | iframe 높이 자동 조절 |

---

## open(options)

기본 팝업을 엽니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `type` | Number | 0 | 0: dialog, 1: page, 2: iframe, 3: loading, 4: tips |
| `title` | String/Boolean | '알림' | 제목 (false: 제목 없음) |
| `content` | String/DOM | '' | 내용 |
| `area` | String/Array | 'auto' | 크기 `'300px'` 또는 `['300px', '200px']` |
| `offset` | String/Array | 'auto' | 위치 `'100px'`, `'t'`, `'r'`, `'b'`, `'l'`, `[100, 200]` |
| `shade` | Number/Array/Boolean | 0.3 | 배경 투명도 `[0.3, '#000', '0.3s']` |
| `shadeClose` | Boolean | false | 배경 클릭 시 닫기 |
| `btn` | Array | - | 버튼 `['확인', '취소']` |
| `btnAlign` | String | 'r' | 버튼 정렬 `'l'`, `'c'`, `'r'` |
| `closeBtn` | Number/Boolean | 1 | 닫기 버튼 |
| `anim` | Number/String | 0 | 애니메이션 |
| `skin` | String | '' | 스킨 클래스 |
| `move` | Boolean | true | 드래그 이동 |
| `resize` | Boolean | false | 크기 조절 |
| `fixed` | Boolean | true | 고정 위치 |
| `maxmin` | Boolean | false | 최대화/최소화 버튼 |
| `scrollbar` | Boolean | true | 스크롤바 표시 |
| `time` | Number | 0 | 자동 닫기 (ms) |
| `id` | String | '' | 중복 방지 ID |
| `zIndex` | Number | 10000 | z-index |

### 콜백

| 콜백 | 설명 |
|------|------|
| `success(layero, index)` | 팝업 생성 후 |
| `yes(index, layero)` | 확인 버튼 클릭 |
| `cancel(index, layero)` | 닫기 버튼 클릭 |
| `end()` | 팝업 완전히 닫힌 후 |
| `beforeEnd(index)` | 닫기 전 (false/Promise 반환 시 닫기 취소) |
| `full(layero)` | 전체화면 후 |
| `min(layero)` | 최소화 후 |
| `restore(layero)` | 복원 후 |
| `moveEnd(layero)` | 이동 완료 |
| `resizing(layero)` | 리사이즈 중 |

### 예시

```javascript
// 기본 팝업
popup.open({
  title: '제목',
  content: '내용입니다.',
  btn: ['확인', '취소'],
  yes: function(index){
    popup.close(index);
  }
});

// iframe 팝업
popup.open({
  type: 2,
  title: '외부 페이지',
  content: 'https://example.com',
  area: ['800px', '600px']
});

// 제목 없는 팝업
popup.open({
  title: false,
  content: '제목 없는 팝업',
  shadeClose: true
});

// 크기 조절 가능 팝업
popup.open({
  title: '리사이즈 팝업',
  content: '크기를 조절할 수 있습니다.',
  area: ['400px', '300px'],
  resize: true,
  maxmin: true
});
```

---

## alert(content, options, callback)

알림창을 표시합니다.

```javascript
// 기본
popup.alert('알림 메시지입니다.');

// 옵션과 콜백
popup.alert('저장되었습니다.', { icon: 1, title: '성공' }, function(){
  console.log('닫힘');
});
```

### 아이콘 타입

| 값 | 설명 |
|----|------|
| 0 | 성공 (체크) |
| 1 | 실패 (X) |
| 2 | 경고 (!) |
| 3 | 정보 (i) |
| 4 | 잠금 |
| 5 | 슬픔 |
| 6 | 기쁨 |

---

## confirm(content, options, yes, cancel)

확인창을 표시합니다.

```javascript
popup.confirm('삭제하시겠습니까?', { icon: 2, title: '확인' }, 
  function(index){
    // 확인 클릭
    popup.msg('삭제되었습니다.');
    popup.close(index);
  },
  function(index){
    // 취소 클릭
    popup.close(index);
  }
);
```

---

## msg(content, options, callback)

간단한 메시지를 표시합니다. 자동으로 닫힙니다.

```javascript
// 기본 (3초 후 닫힘)
popup.msg('저장되었습니다.');

// 아이콘과 함께
popup.msg('성공!', { icon: 1, time: 2000 });

// 콜백
popup.msg('처리 완료', function(){
  location.reload();
});
```

---

## load(icon, options)

로딩 표시를 합니다.

```javascript
// 로딩 시작
var loadIndex = popup.load(0);

// 작업 완료 후 닫기
setTimeout(function(){
  popup.close(loadIndex);
}, 3000);

// 로딩 아이콘 타입: 0, 1, 2
popup.load(1, { shade: 0.5 });
```

---

## tips(content, follow, options)

툴팁을 표시합니다.

```javascript
// 기본
popup.tips('도움말 내용', '#helpBtn');

// 방향 지정
popup.tips('위쪽에 표시', '#target', { tips: 1 });  // 1:위, 2:우, 3:아래, 4:좌

// 색상 지정
popup.tips('커스텀 색상', '#target', { tips: [1, '#ff5722'] });

// 자동 닫기 시간
popup.tips('3초 후 닫힘', '#target', { time: 3000 });
```

---

## prompt(options, yes)

입력창을 표시합니다.

```javascript
// 기본
popup.prompt({ title: '이름 입력' }, function(value, index){
  popup.msg('입력값: ' + value);
  popup.close(index);
});

// textarea
popup.prompt({
  title: '내용 입력',
  formType: 2,  // 0:text, 1:password, 2:textarea
  value: '기본값'
}, function(value, index){
  console.log(value);
  popup.close(index);
});
```

---

## photos(options)

사진 뷰어를 표시합니다.

```javascript
// 배열 방식
popup.photos({
  photos: {
    data: [
      { src: '/img/1.jpg', alt: '사진1' },
      { src: '/img/2.jpg', alt: '사진2' },
      { src: '/img/3.jpg', alt: '사진3' }
    ],
    start: 0
  },
  toolbar: true,  // 툴바 (확대/축소/회전)
  footer: true    // 하단 정보
});

// 선택자 방식
popup.photos({
  photos: '#gallery',  // img 태그들을 포함한 컨테이너
  anim: 5
});
```

### 사진 뷰어 기능

- 마우스 휠로 확대/축소
- 좌우 화살표 키로 이전/다음
- 툴바: 확대, 축소, 회전, 좌우반전, 초기화

---

## toast(options)

토스트 메시지를 표시합니다.

```javascript
popup.toast({
  content: '토스트 메시지',
  icon: 1,           // 아이콘
  time: 3000,        // 표시 시간
  position: 'tc'     // 위치
});
```

### 위치 옵션

| 값 | 설명 |
|----|------|
| `tc` | 상단 중앙 |
| `tl` | 상단 좌측 |
| `tr` | 상단 우측 |
| `bc` | 하단 중앙 |
| `bl` | 하단 좌측 |
| `br` | 하단 우측 |

---

## notice(options)

공지 팝업을 표시합니다. "하루 안보기" 기능을 지원합니다.

```javascript
popup.notice({
  id: 'notice-20231209',  // 고유 ID (필수)
  title: '공지사항',
  content: '새로운 기능이 추가되었습니다.',
  btn: ['확인', '하루 안보기']
});
```

---

## tab(options)

탭 레이어를 표시합니다.

```javascript
popup.tab({
  title: '탭 팝업',
  area: ['500px', '400px'],
  tab: [
    { title: '기본정보', content: '<div>기본정보 내용</div>' },
    { title: '상세정보', content: '<div>상세정보 내용</div>' },
    { title: '기타', content: '<div>기타 내용</div>' }
  ]
});
```

---

## drawer(options)

슬라이드 오버레이 패널을 표시합니다.

```javascript
popup.drawer({
  title: '패널 제목',
  content: '<div>패널 내용</div>',
  direction: 'r',   // 방향: 't'(상단), 'r'(우측), 'b'(하단), 'l'(좌측)
  size: '350px',    // 크기
  shade: 0.3,
  shadeClose: true
});

// 왼쪽 메뉴
popup.drawer({
  title: '메뉴',
  direction: 'l',
  size: '250px',
  content: '<ul><li>메뉴1</li><li>메뉴2</li></ul>'
});

// 상단 알림
popup.drawer({
  title: '알림',
  direction: 't',
  size: '150px',
  content: '상단에서 내려오는 패널'
});
```

---

## 동적 제어 API

### style(index, css)

팝업 스타일을 동적으로 변경합니다.

```javascript
var idx = popup.open({...});

popup.style(idx, {
  'background-color': '#f5f5f5',
  'border-radius': '10px'
});
```

### full(index)

팝업을 전체화면으로 만듭니다.

```javascript
popup.full(idx);
```

### min(index)

팝업을 최소화합니다.

```javascript
popup.min(idx);
```

### restore(index)

최소화/전체화면된 팝업을 복원합니다.

```javascript
popup.restore(idx);
```

### setTop(layero)

팝업을 최상위로 올립니다.

```javascript
popup.setTop($('#cui-popup1'));
```

### iframeSrc(index, url)

iframe 팝업의 URL을 변경합니다.

```javascript
popup.iframeSrc(idx, 'https://new-url.com');
```

### closeLast()

가장 마지막에 열린 팝업을 닫습니다.

```javascript
popup.closeLast();
```

### title(title, idx)

팝업 제목을 변경합니다.

```javascript
popup.title('새 제목', idx);
```

### content(content, idx)

팝업 내용을 변경합니다.

```javascript
popup.content('<p>새 내용</p>', idx);
```

### getPopup(idx)

팝업 인스턴스를 가져옵니다.

```javascript
var inst = popup.getPopup(idx);
console.log(inst.config);  // 팝업 설정
console.log(inst.layero);  // 팝업 DOM 요소
```

### getChildFrame(selector, idx)

iframe 팝업 내부의 요소를 가져옵니다.

```javascript
// iframe 내부의 특정 요소
var elem = popup.getChildFrame('#innerBtn', idx);

// iframe document 전체
var doc = popup.getChildFrame(null, idx);
```

### getFrameIndex(win)

iframe 내부에서 현재 팝업의 인덱스를 가져옵니다.

```javascript
// iframe 내부에서 사용
var idx = parent.popup.getFrameIndex(window);
parent.popup.close(idx);
```

### iframeAuto(idx)

iframe 높이를 내용에 맞게 자동 조절합니다.

```javascript
popup.iframeAuto(idx);
```

---

## 스킨

`skin` 옵션으로 다양한 스킨을 적용할 수 있습니다.

### 색상 스킨

```javascript
popup.open({
  title: '제목',
  content: '내용',
  skin: 'cui-popup-skin-primary',  // 파란색
  btn: ['확인']
});
```

| 스킨 | 설명 |
|------|------|
| `cui-popup-skin-primary` | 파란색 그라데이션 |
| `cui-popup-skin-success` | 녹색 그라데이션 |
| `cui-popup-skin-warning` | 주황색 그라데이션 |
| `cui-popup-skin-danger` | 빨간색 그라데이션 |
| `cui-popup-skin-info` | 하늘색 그라데이션 |
| `cui-popup-skin-dark` | 다크 테마 |

### 스타일 스킨

| 스킨 | 설명 |
|------|------|
| `cui-popup-skin-minimal` | 깔끔한 미니멀 |
| `cui-popup-skin-round` | 둥근 모서리 |
| `cui-popup-skin-flat` | 그림자 없음 |
| `cui-popup-skin-glass` | 글래스모피즘 |
| `cui-popup-skin-ios` | iOS 스타일 |
| `cui-popup-skin-material` | 머티리얼 디자인 |

### 스킨 조합

```javascript
popup.open({
  skin: 'cui-popup-skin-dark cui-popup-skin-round',
  // ...
});
```

---

## 애니메이션

`anim` 옵션으로 열림 애니메이션을 지정합니다.

### 숫자 방식

| 값 | 설명 |
|----|------|
| 0 | 확대 |
| 1 | 위에서 슬라이드 |
| 2 | 아래에서 슬라이드 |
| 3 | 왼쪽에서 슬라이드 |
| 4 | 오른쪽에서 슬라이드 |
| 5 | 페이드 |
| 6 | 회전 |

### 문자열 방식

```javascript
popup.open({
  anim: 'slideDown',  // slideDown, slideUp, slideLeft, slideRight
  // ...
});
```

---

## beforeEnd 콜백

팝업이 닫히기 전에 확인 로직을 실행합니다.

```javascript
popup.open({
  title: '수정',
  content: '...',
  beforeEnd: function(index){
    // false 반환 시 닫기 취소
    return confirm('저장하지 않고 닫으시겠습니까?');
  }
});

// Promise 지원
popup.open({
  beforeEnd: function(index){
    return new Promise(function(resolve){
      popup.confirm('닫으시겠습니까?', function(idx){
        popup.close(idx);
        resolve(true);
      }, function(idx){
        popup.close(idx);
        resolve(false);
      });
    });
  }
});
```

---

## hideOnClose 옵션

팝업을 닫지 않고 숨깁니다. 재사용에 유용합니다.

```javascript
var idx = popup.open({
  title: '재사용 팝업',
  content: '내용',
  hideOnClose: true
});

// 숨겨진 팝업 다시 표시
$('#cui-popup' + idx).show();
$('#cui-popup-shade' + idx).show();
```
