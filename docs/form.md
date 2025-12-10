# Form 모듈

폼 요소를 렌더링하고 유효성 검사, 값 수집 등을 처리하는 모듈입니다.

## 기본 사용법

```html
<form class="cui-form" cui-filter="demo">
  <div class="cui-form-item">
    <label class="cui-form-label">사용자명</label>
    <div class="cui-input-block">
      <input type="text" name="username" cui-verify="required" placeholder="사용자명 입력">
    </div>
  </div>
  <div class="cui-form-item">
    <button class="cui-btn cui-btn-primary" cui-submit cui-filter="submit">제출</button>
  </div>
</form>

<script>
Catui.use(['form'], function(){
  form.on('submit(submit)', function(data){
    console.log(data.field);  // 폼 데이터
    return false;  // 기본 제출 방지
  });
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `render(type, filter)` | 폼 요소 렌더링 |
| `val(filter, object)` | 폼 값 설정/가져오기 |
| `verify(settings)` | 커스텀 유효성 규칙 추가 |
| `on(events, callback)` | 이벤트 등록 |

---

## render(type, filter)

동적으로 추가된 폼 요소를 렌더링합니다.

```javascript
// 전체 렌더링
form.render();

// 특정 타입만 렌더링
form.render('select');
form.render('checkbox');
form.render('radio');
form.render('switch');

// 특정 필터만 렌더링
form.render('select', 'demo');
form.render(null, 'demo');  // 전체 타입, 특정 필터
```

### 렌더링 타입

| 타입 | 설명 |
|------|------|
| `select` | 셀렉트박스 |
| `checkbox` | 체크박스 |
| `radio` | 라디오버튼 |
| `switch` | 스위치 |

---

## val(filter, object)

폼 값을 설정하거나 가져옵니다.

```javascript
// 값 설정
form.val('demo', {
  username: '홍길동',
  email: 'hong@test.com',
  status: 1,
  gender: 'male',
  hobbies: ['reading', 'sports']
});

// 값 가져오기
var data = form.val('demo');
console.log(data);
```

---

## verify(settings)

커스텀 유효성 검사 규칙을 추가합니다.

```javascript
form.verify({
  // 단순 정규식
  username: [/^[a-zA-Z0-9_]{4,16}$/, '4~16자 영문, 숫자, 언더스코어만 가능'],
  
  // 함수
  password: function(value){
    if(value.length < 6){
      return '비밀번호는 6자 이상이어야 합니다.';
    }
  },
  
  // 비밀번호 확인
  confirmPwd: function(value){
    var pwd = $('input[name="password"]').val();
    if(value !== pwd){
      return '비밀번호가 일치하지 않습니다.';
    }
  },
  
  // 비동기 검사 (Promise)
  asyncEmail: function(value){
    return new Promise(function(resolve, reject){
      $.get('/api/checkEmail', { email: value }, function(res){
        if(res.exists){
          reject('이미 사용중인 이메일입니다.');
        } else {
          resolve();
        }
      });
    });
  }
});
```

### 내장 유효성 규칙

| 규칙 | 설명 |
|------|------|
| `required` | 필수 입력 |
| `phone` | 전화번호 |
| `email` | 이메일 |
| `url` | URL |
| `number` | 숫자 |
| `date` | 날짜 |
| `identity` | 주민등록번호 |

### 사용 예시

```html
<input type="text" name="email" cui-verify="required|email">
<input type="text" name="phone" cui-verify="phone">
<input type="password" name="password" cui-verify="required|password">
```

---

## 이벤트

### submit - 폼 제출

```javascript
form.on('submit(submit)', function(data){
  console.log(data.elem);   // 제출 버튼 요소
  console.log(data.form);   // form 요소
  console.log(data.field);  // 폼 데이터 객체
  
  // AJAX 제출
  $.post('/api/save', data.field, function(res){
    if(res.code === 0){
      popup.msg('저장되었습니다.');
    }
  });
  
  return false;  // 기본 제출 방지
});
```

### select - 셀렉트 변경

```javascript
form.on('select(city)', function(data){
  console.log(data.elem);   // select 요소
  console.log(data.value);  // 선택된 값
  console.log(data.othis);  // 렌더링된 요소
  
  // 연동 셀렉트
  loadDistricts(data.value);
});
```

### checkbox - 체크박스 변경

```javascript
form.on('checkbox(agree)', function(data){
  console.log(data.elem);    // 요소
  console.log(data.value);   // 값
  console.log(data.checked); // 체크 상태
});
```

### radio - 라디오 변경

```javascript
form.on('radio(gender)', function(data){
  console.log(data.value);  // 선택된 값
});
```

### switch - 스위치 변경

```javascript
form.on('switch(status)', function(data){
  console.log(data.elem);
  console.log(data.value);
  console.log(data.checked);
  
  // 상태 변경 API 호출
  $.post('/api/toggleStatus', {
    id: data.value,
    status: data.checked ? 1 : 0
  });
});
```

---

## 폼 요소

### 셀렉트박스

```html
<select name="city" cui-filter="city">
  <option value="">선택하세요</option>
  <option value="seoul">서울</option>
  <option value="busan">부산</option>
  <option value="daegu" disabled>대구 (비활성)</option>
</select>

<!-- 검색 가능 -->
<select name="city" cui-filter="city" cui-search>
  <option value="">선택하세요</option>
  ...
</select>

<!-- 그룹 -->
<select name="area">
  <optgroup label="수도권">
    <option value="seoul">서울</option>
    <option value="incheon">인천</option>
  </optgroup>
  <optgroup label="영남권">
    <option value="busan">부산</option>
    <option value="daegu">대구</option>
  </optgroup>
</select>
```

### 체크박스

```html
<!-- 기본 -->
<input type="checkbox" name="agree" value="1" title="동의합니다" cui-filter="agree">

<!-- 기본 체크 -->
<input type="checkbox" name="remember" value="1" title="자동 로그인" checked>

<!-- 비활성화 -->
<input type="checkbox" name="disabled" value="1" title="비활성" disabled>

<!-- 기본 스타일 (원형) -->
<input type="checkbox" name="default" title="기본" cui-skin="primary">
```

### 라디오

```html
<input type="radio" name="gender" value="male" title="남성" checked>
<input type="radio" name="gender" value="female" title="여성">
<input type="radio" name="gender" value="other" title="기타" disabled>
```

### 스위치

```html
<input type="checkbox" name="status" value="1" cui-skin="switch" cui-filter="status" cui-text="ON|OFF">

<!-- 기본 체크 -->
<input type="checkbox" name="active" value="1" cui-skin="switch" checked>

<!-- 비활성화 -->
<input type="checkbox" name="lock" value="1" cui-skin="switch" disabled>
```

### 텍스트 입력

```html
<!-- 기본 -->
<input type="text" name="title" class="cui-input" placeholder="제목">

<!-- 비밀번호 -->
<input type="password" name="password" class="cui-input">

<!-- 비활성화 -->
<input type="text" name="readonly" class="cui-input" value="읽기전용" readonly>
<input type="text" name="disabled" class="cui-input" value="비활성" disabled>
```

### 텍스트영역

```html
<textarea name="content" class="cui-textarea" placeholder="내용을 입력하세요"></textarea>
```

---

## 레이아웃

### 수평 레이아웃

```html
<form class="cui-form">
  <div class="cui-form-item">
    <label class="cui-form-label">제목</label>
    <div class="cui-input-block">
      <input type="text" name="title" class="cui-input">
    </div>
  </div>
</form>
```

### 수직 레이아웃

```html
<form class="cui-form cui-form-pane">
  <div class="cui-form-item">
    <label class="cui-form-label">제목</label>
    <div class="cui-input-block">
      <input type="text" name="title" class="cui-input">
    </div>
  </div>
</form>
```

### 인라인 레이아웃

```html
<form class="cui-form cui-form-inline">
  <div class="cui-form-item">
    <input type="text" name="keyword" class="cui-input" placeholder="검색어">
  </div>
  <div class="cui-form-item">
    <button class="cui-btn cui-btn-primary">검색</button>
  </div>
</form>
```

### 라벨 너비 조절

```html
<form class="cui-form" style="--cui-form-label-width: 120px;">
  ...
</form>
```

---

## 동적 폼

```javascript
// 동적으로 폼 요소 추가 후 렌더링
$('#formContainer').append(`
  <select name="category">
    <option value="1">카테고리1</option>
    <option value="2">카테고리2</option>
  </select>
`);

// 반드시 렌더링 호출
form.render('select');
```

---

## 폼 초기화

```javascript
// HTML5 기본 초기화
document.querySelector('form').reset();

// 또는 빈 값으로 설정
form.val('demo', {
  username: '',
  email: '',
  status: 0
});
```
