# Cui 코어 모듈

Catui 프레임워크의 코어 모듈입니다.

## 초기화

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dist/css/catui.css">
</head>
<body>
  <script src="dist/catui.js"></script>
  <script>
    Catui.use(['popup', 'table'], function(){
      // 모듈 사용
    });
  </script>
</body>
</html>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `config(options)` | 전역 설정 |
| `use(modules, callback)` | 모듈 로드 |
| `extend(options)` | 모듈 확장 |
| `each(obj, callback)` | 객체/배열 순회 |
| `router(hash)` | 라우터 |
| `event(module, events, params)` | 이벤트 발생 |
| `onevent(module, events, callback)` | 이벤트 등록 |

---

## config(options)

전역 설정을 합니다.

```javascript
Catui.config({
  base: '/dist/modules/',  // 모듈 경로
  version: false,          // 버전 쿼리스트링
  debug: false             // 디버그 모드
});
```

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `base` | String | 자동 | 모듈 기본 경로 |
| `version` | Boolean/String | false | 버전 쿼리스트링 |
| `debug` | Boolean | false | 디버그 모드 |
| `dir` | String | - | 정적 파일 경로 |

---

## use(modules, callback)

모듈을 로드합니다.

```javascript
// 단일 모듈
Catui.use('popup', function(){
  popup.alert('Hello!');
});

// 다중 모듈
Catui.use(['popup', 'table', 'form'], function(){
  // 모든 모듈 사용 가능
});

// 모듈 객체로 받기
Catui.use(['popup', 'table'], function(popup, table){
  popup.msg('로드됨');
  table.render({...});
});
```

---

## extend(options)

커스텀 모듈을 확장합니다.

```javascript
Catui.extend({
  myModule: '/path/to/myModule'
});

// 사용
Catui.use(['myModule'], function(){
  myModule.init();
});
```

---

## each(obj, callback)

객체나 배열을 순회합니다.

```javascript
// 배열
Catui.each([1, 2, 3], function(index, item){
  console.log(index, item);
});

// 객체
Catui.each({ a: 1, b: 2 }, function(key, value){
  console.log(key, value);
});
```

---

## 이벤트 시스템

### event(module, events, params)

이벤트를 발생시킵니다.

```javascript
Catui.event('myModule', 'click(filter)', { data: 'test' });
```

### onevent(module, events, callback)

이벤트를 등록합니다.

```javascript
Catui.onevent('myModule', 'click(filter)', function(data){
  console.log(data);
});
```

---

## $c (jQuery-like)

간단한 DOM 조작을 위한 유틸리티입니다.

```javascript
Catui.use(['$c'], function(){
  // 선택
  $c('#id');
  $c('.class');
  $c('div');

  // 이벤트
  $c('#btn').on('click', function(){
    console.log('클릭');
  });

  // 속성
  $c('#input').val();
  $c('#div').html('<p>내용</p>');
  $c('#div').text('텍스트');

  // 클래스
  $c('#div').addClass('active');
  $c('#div').removeClass('active');
  $c('#div').hasClass('active');

  // 스타일
  $c('#div').css('color', 'red');
  $c('#div').css({ color: 'red', fontSize: '14px' });

  // 표시/숨김
  $c('#div').show();
  $c('#div').hide();

  // 탐색
  $c('#div').find('.child');
  $c('#div').parent();
  $c('#div').children();

  // 데이터
  $c('#div').data('id');
  $c('#div').attr('data-id');
});
```

---

## 전역 객체

모듈 로드 후 전역으로 접근 가능한 객체들:

```javascript
// 전역 접근
window.popup
window.table
window.form
// ...

// 또는 Catui 객체를 통해
Catui.popup
Catui.table
Catui.form
// ...
```

---

## 완전한 예시

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Catui 예제</title>
  <link rel="stylesheet" href="/dist/css/catui.css">
</head>
<body>
  <div class="cui-container">
    <button class="cui-btn cui-btn-primary" id="alertBtn">알림</button>
    <button class="cui-btn" id="confirmBtn">확인</button>
    
    <table id="demo" cui-filter="demo"></table>
  </div>

  <script src="/dist/catui.js"></script>
  <script>
    // 전역 설정
    Catui.config({
      base: '/dist/modules/',
      version: '1.0.0'
    });
    
    // 모듈 로드
    Catui.use(['$c', 'popup', 'table'], function(){
      // 알림 버튼
      $c('#alertBtn').on('click', function(){
        popup.alert('안녕하세요!');
      });
      
      // 확인 버튼
      $c('#confirmBtn').on('click', function(){
        popup.confirm('계속하시겠습니까?', function(index){
          popup.msg('확인됨');
          popup.close(index);
        });
      });
      
      // 테이블
      table.render({
        elem: '#demo',
        url: '/api/users',
        cols: [[
          { type: 'checkbox' },
          { field: 'id', title: 'ID', width: 80 },
          { field: 'name', title: '이름' },
          { field: 'email', title: '이메일' }
        ]],
        page: true
      });
    });
  </script>
</body>
</html>
```
