# Code 모듈

코드 하이라이트 및 복사 기능을 제공하는 모듈입니다.

## 기본 사용법

```html
<pre class="cui-code">
  <code>
function hello() {
  console.log('Hello, World!');
}
  </code>
</pre>

<script>
Catui.use(['code'], function(){
  // 자동으로 코드 블록을 렌더링
});
</script>
```

---

## 속성

| 속성 | 설명 |
|------|------|
| `cui-title` | 제목 표시 |
| `cui-height` | 높이 제한 |
| `cui-encode` | HTML 인코딩 |
| `cui-skin` | 스킨 (dark) |
| `cui-copy` | 복사 버튼 표시 (기본 true) |

---

## 제목 표시

```html
<pre class="cui-code" cui-title="JavaScript">
  <code>
var name = 'Catui';
console.log(name);
  </code>
</pre>
```

---

## 높이 제한

```html
<pre class="cui-code" cui-height="200">
  <code>
// 긴 코드...
// 스크롤 가능
  </code>
</pre>
```

---

## 다크 스킨

```html
<pre class="cui-code" cui-skin="dark">
  <code>
console.log('Dark theme');
  </code>
</pre>
```

---

## 복사 버튼 숨기기

```html
<pre class="cui-code" cui-copy="false">
  <code>
// 복사 버튼 없음
  </code>
</pre>
```

---

## 완전한 예시

```html
<h3>JavaScript 예제</h3>
<pre class="cui-code" cui-title="app.js" cui-skin="dark">
  <code>
// Catui 사용 예시
Catui.use(['popup', 'table', 'form'], function(){
  // 팝업
  popup.alert('환영합니다!');
  
  // 테이블
  table.render({
    elem: '#demo',
    url: '/api/data',
    cols: [[
      { field: 'id', title: 'ID' },
      { field: 'name', title: '이름' }
    ]]
  });
});
  </code>
</pre>

<h3>HTML 예제</h3>
<pre class="cui-code" cui-title="index.html" cui-encode="true">
  <code>
<div class="cui-container">
  <button class="cui-btn">버튼</button>
</div>
  </code>
</pre>

<h3>CSS 예제</h3>
<pre class="cui-code" cui-title="style.css">
  <code>
.cui-btn {
  padding: 8px 16px;
  background: #1677ff;
  color: #fff;
  border-radius: 4px;
}
  </code>
</pre>
```
