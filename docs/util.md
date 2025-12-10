# Util 모듈

유틸리티 함수들을 제공하는 모듈입니다.

## 기본 사용법

```javascript
Catui.use(['util'], function(){
  // 유틸리티 함수 사용
  util.timeAgo(Date.now() - 3600000);  // "1시간 전"
});
```

---

## API 목록

### 시간/날짜

| API | 설명 |
|-----|------|
| `timeAgo(time, onlyDate)` | 상대 시간 표시 |
| `toDateString(time, format)` | 날짜 포맷팅 |
| `countdown(endTime, serverTime, callback)` | 카운트다운 |

### 숫자/문자열

| API | 설명 |
|-----|------|
| `digit(num, length)` | 숫자 앞 0 채우기 |
| `comma(num)` | 천단위 콤마 |
| `countUp(options)` | 숫자 카운트업 애니메이션 |

### 유효성 검증

| API | 설명 |
|-----|------|
| `isEmpty(value)` | 빈 값 체크 |
| `isEmail(str)` | 이메일 검증 |
| `isPhone(str)` | 전화번호 검증 (한국) |
| `isUrl(str)` | URL 검증 |

### 보안/이스케이프

| API | 설명 |
|-----|------|
| `escape(str)` | HTML 이스케이프 |
| `unescape(str)` | HTML 언이스케이프 |
| `stripScripts(str)` | 스크립트 태그 제거 |
| `sanitize(str, options)` | HTML 정화 (화이트리스트) |
| `escapeSql(str)` | SQL 인젝션 방지 |
| `escapeRegex(str)` | 정규식 특수문자 이스케이프 |
| `safeJsonParse(str, defaultValue)` | 안전한 JSON 파싱 |
| `safeEncodeUri(str)` | URL 파라미터 안전 인코딩 |

### 유틸리티

| API | 설명 |
|-----|------|
| `deepClone(obj)` | 딥 복사 |
| `debounce(fn, delay)` | 디바운스 |
| `throttle(fn, delay)` | 쓰로틀 |
| `uuid()` | UUID 생성 |
| `shortId(length)` | 짧은 ID 생성 |

### 쿼리스트링

| API | 설명 |
|-----|------|
| `parseQuery(str)` | 쿼리스트링 파싱 |
| `toQuery(obj)` | 쿼리스트링 생성 |

### 쿠키

| API | 설명 |
|-----|------|
| `setCookie(name, value, days)` | 쿠키 설정 |
| `getCookie(name)` | 쿠키 가져오기 |
| `removeCookie(name)` | 쿠키 삭제 |

### DOM/UI

| API | 설명 |
|-----|------|
| `scrollTo(to, duration)` | 스크롤 애니메이션 |
| `fixbar(options)` | 고정 바 |
| `on(elem, event, selector, callback)` | 이벤트 위임 |

---

## timeAgo(time, onlyDate)

상대 시간을 표시합니다.

```javascript
// 기본 사용
util.timeAgo(Date.now() - 30000);      // "방금 전"
util.timeAgo(Date.now() - 60000);      // "1분 전"
util.timeAgo(Date.now() - 3600000);    // "1시간 전"
util.timeAgo(Date.now() - 86400000);   // "1일 전"

// 타임스탬프
util.timeAgo(1702123456000);  // "X일 전" 또는 날짜

// 날짜만 표시
util.timeAgo(1702123456000, true);  // "2023-12-09"
```

---

## toDateString(time, format)

날짜를 지정된 형식으로 포맷팅합니다.

```javascript
// 기본 형식
util.toDateString(Date.now());  // "2024-01-15 14:30:00"

// 커스텀 형식
util.toDateString(Date.now(), 'yyyy년 MM월 dd일');  // "2024년 01월 15일"
util.toDateString(Date.now(), 'yyyy-MM-dd');        // "2024-01-15"
util.toDateString(Date.now(), 'HH:mm:ss');          // "14:30:00"
util.toDateString(Date.now(), 'MM/dd HH:mm');       // "01/15 14:30"
```

---

## digit(num, length)

숫자 앞에 0을 채웁니다.

```javascript
util.digit(5);       // "05"
util.digit(5, 3);    // "005"
util.digit(123, 5);  // "00123"
util.digit(99);      // "99"
```

---

## escape(str) / unescape(str)

HTML 특수문자를 이스케이프/언이스케이프합니다.

```javascript
// 이스케이프
util.escape('<script>alert("XSS")</script>');
// "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"

// 언이스케이프
util.unescape('&lt;div&gt;');  // "<div>"
```

---

## countdown(endTime, serverTime, callback)

카운트다운 타이머를 생성합니다.

```javascript
// 기본 사용
util.countdown('2024-12-31 23:59:59', function(date, serverTime, timer){
  console.log(date);
  // { d: 일, h: 시, m: 분, s: 초 }
  
  // 타이머 중지
  // clearInterval(timer);
});

// 서버 시간 기준
util.countdown('2024-12-31 23:59:59', '2024-01-15 12:00:00', function(date){
  $('#countdown').html(
    date.d + '일 ' + date.h + '시간 ' + date.m + '분 ' + date.s + '초'
  );
});
```

---

## fixbar(options)

화면 고정 바(Back to Top 등)를 생성합니다.

```javascript
// 기본 (맨 위로 버튼)
util.fixbar();

// 커스텀 버튼
util.fixbar({
  bar1: true,   // 버튼 1 표시
  bar2: true,   // 버튼 2 표시
  bgcolor: '#1677ff',
  click: function(type){
    if(type === 'bar1'){
      console.log('버튼 1 클릭');
    }
  }
});

// 옵션
util.fixbar({
  showHeight: 200,  // 스크롤 200px 이상에서 표시
  css: {            // 커스텀 스타일
    right: 30,
    bottom: 30
  }
});
```

---

## on(attr, events, callback)

이벤트 위임을 설정합니다.

```javascript
// HTML
// <button cui-on="click: test">클릭</button>

// JS
util.on('cui-on', {
  test: function(e){
    console.log('클릭됨');
    console.log(this);  // 클릭된 요소
  }
});

// 여러 이벤트
util.on('cui-on', {
  edit: function(e){
    var id = $(this).data('id');
    console.log('수정:', id);
  },
  delete: function(e){
    var id = $(this).data('id');
    popup.confirm('삭제하시겠습니까?', function(index){
      // 삭제 처리
      popup.close(index);
    });
  }
});
```

---

## 완전한 예시

### 게시판 시간 표시

```html
<ul id="postList">
  <li>
    <span class="title">게시글 제목</span>
    <span class="time" data-time="1702123456000"></span>
  </li>
</ul>

<script>
Catui.use(['util'], function(){
  // 시간 표시 업데이트
  $('#postList .time').each(function(){
    var timestamp = $(this).data('time');
    $(this).text(util.timeAgo(timestamp));
  });
});
</script>
```

### 이벤트 할인 카운트다운

```html
<div id="eventBanner">
  <h2>특별 할인 이벤트!</h2>
  <p>남은 시간: <span id="countdown"></span></p>
</div>

<script>
Catui.use(['util'], function(){
  util.countdown('2024-12-31 23:59:59', function(date, server, timer){
    if(date.d < 0){
      $('#countdown').text('이벤트 종료');
      clearInterval(timer);
      return;
    }
    
    $('#countdown').html(
      '<strong>' + date.d + '</strong>일 ' +
      '<strong>' + util.digit(date.h) + '</strong>시간 ' +
      '<strong>' + util.digit(date.m) + '</strong>분 ' +
      '<strong>' + util.digit(date.s) + '</strong>초'
    );
  });
});
</script>
```

### XSS 방지

```javascript
// 사용자 입력 처리
var userInput = '<script>alert("XSS")</script>';
var safeHtml = util.escape(userInput);

$('#content').html(safeHtml);  // 안전하게 표시
```

### 통합 이벤트 처리

```html
<div id="actionArea">
  <button class="cui-btn" cui-on="click: add">추가</button>
  <button class="cui-btn" cui-on="click: edit" data-id="1">수정</button>
  <button class="cui-btn cui-btn-danger" cui-on="click: delete" data-id="1">삭제</button>
</div>

<script>
Catui.use(['util', 'popup'], function(){
  util.on('cui-on', {
    add: function(){
      popup.open({
        title: '추가',
        content: '추가 폼'
      });
    },
    edit: function(){
      var id = $(this).data('id');
      popup.open({
        title: '수정',
        content: 'ID: ' + id + ' 수정 폼'
      });
    },
    delete: function(){
      var id = $(this).data('id');
      popup.confirm('ID: ' + id + '를 삭제하시겠습니까?', function(index){
        popup.close(index);
        popup.msg('삭제되었습니다.');
      });
    }
  });
});
</script>
```
