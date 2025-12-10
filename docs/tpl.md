# Tpl 모듈

템플릿 엔진을 제공하는 모듈입니다.

## 기본 사용법

```html
<script type="text/html" id="myTpl">
  <h1>{{ d.title }}</h1>
  <p>{{ d.content }}</p>
</script>

<div id="container"></div>

<script>
Catui.use(['tpl'], function(){
  var html = tpl('#myTpl', {
    title: '제목입니다',
    content: '내용입니다'
  });
  $('#container').html(html);
});
</script>
```

---

## 문법

### 변수 출력

```html
<!-- 기본 출력 (HTML 이스케이프) -->
{{ d.name }}

<!-- 원본 출력 (이스케이프 없음) -->
{{= d.htmlContent }}
```

---

### 조건문

```html
{{# if(d.status === 1){ }}
  <span class="active">활성</span>
{{# } else { }}
  <span class="inactive">비활성</span>
{{# } }}
```

---

### 반복문

```html
{{# for(var i = 0; i < d.list.length; i++){ }}
  <li>{{ d.list[i].name }}</li>
{{# } }}

<!-- 또는 -->
{{# d.items.forEach(function(item, index){ }}
  <div>{{ index + 1 }}. {{ item.title }}</div>
{{# }); }}
```

---

### JavaScript 실행

```html
{{# var total = d.price * d.quantity; }}
<p>총액: {{ total }}원</p>
```

---

## 완전한 예시

### 사용자 목록

```html
<script type="text/html" id="userListTpl">
  {{# if(d.users.length === 0){ }}
    <tr><td colspan="4">데이터가 없습니다.</td></tr>
  {{# } else { }}
    {{# d.users.forEach(function(user, i){ }}
      <tr>
        <td>{{ i + 1 }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>
          {{# if(user.status === 1){ }}
            <span class="cui-badge cui-bg-green">활성</span>
          {{# } else { }}
            <span class="cui-badge cui-bg-gray">비활성</span>
          {{# } }}
        </td>
      </tr>
    {{# }); }}
  {{# } }}
</script>

<table class="cui-table">
  <thead>
    <tr>
      <th>번호</th>
      <th>이름</th>
      <th>이메일</th>
      <th>상태</th>
    </tr>
  </thead>
  <tbody id="userList"></tbody>
</table>

<script>
Catui.use(['tpl'], function(){
  $.get('/api/users', function(res){
    var html = tpl('#userListTpl', { users: res.data });
    $('#userList').html(html);
  });
});
</script>
```

### 상품 카드

```html
<script type="text/html" id="productTpl">
  {{# d.products.forEach(function(product){ }}
    <div class="product-card">
      <img src="{{ product.image }}" alt="{{ product.name }}">
      <h3>{{ product.name }}</h3>
      <p class="price">
        {{# if(product.discount > 0){ }}
          <del>{{ product.originalPrice.toLocaleString() }}원</del>
          <strong>{{ product.price.toLocaleString() }}원</strong>
          <span class="discount">{{ product.discount }}% OFF</span>
        {{# } else { }}
          <strong>{{ product.price.toLocaleString() }}원</strong>
        {{# } }}
      </p>
      <button class="cui-btn cui-btn-primary" data-id="{{ product.id }}">
        장바구니 담기
      </button>
    </div>
  {{# }); }}
</script>
```

### HTML 콘텐츠 출력

```html
<script type="text/html" id="articleTpl">
  <article>
    <h1>{{ d.title }}</h1>
    <div class="meta">
      <span>{{ d.author }}</span>
      <span>{{ d.date }}</span>
    </div>
    <!-- HTML 이스케이프 없이 출력 -->
    <div class="content">{{= d.content }}</div>
  </article>
</script>
```

---

## 주의사항

1. 템플릿 내 데이터는 `d` 객체로 접근합니다.
2. `{{ }}` 안의 내용은 HTML 이스케이프됩니다.
3. `{{= }}` 안의 내용은 그대로 출력됩니다 (XSS 주의).
4. `{{# }}` 안에는 JavaScript 코드를 작성합니다.
