# Rate 모듈

평점/별점 컴포넌트를 제공하는 모듈입니다.

## 기본 사용법

```html
<div id="rate"></div>

<script>
Catui.use(['rate'], function(){
  rate.render({
    elem: '#rate',
    choose: function(value){
      console.log(value);
    }
  });
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `render(options)` | 별점 렌더링 (인스턴스 반환) |
| `getInst(id)` | 인스턴스 가져오기 |
| `on(events, callback)` | 이벤트 등록 |

### 인스턴스 메서드

| 메서드 | 설명 |
|--------|------|
| `setValue(value)` | 값 설정 |
| `getValue()` | 값 가져오기 |
| `config` | 설정 객체 |

---

## render(options)

별점을 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `length` | Number | 5 | 별 개수 |
| `value` | Number | 0 | 초기값 |
| `half` | Boolean | false | 반개 선택 |
| `text` | Boolean | false | 텍스트 표시 |
| `readonly` | Boolean | false | 읽기 전용 |
| `theme` | String | '#FFB800' | 테마 색상 |

### 콜백

| 콜백 | 설명 |
|------|------|
| `choose(value)` | 선택 시 |

---

## 반개 선택

```javascript
rate.render({
  elem: '#rate',
  half: true,
  value: 3.5
});
```

---

## 텍스트 표시

```javascript
rate.render({
  elem: '#rate',
  text: true,
  setText: function(value){
    var texts = ['', '나쁨', '별로', '보통', '좋음', '최고'];
    return texts[value];
  }
});
```

---

## 읽기 전용

```javascript
rate.render({
  elem: '#rate',
  value: 4,
  readonly: true
});
```

---

## 완전한 예시

### 상품 평점

```html
<div class="product-rating">
  <label>평점:</label>
  <div id="productRate"></div>
  <span id="rateText"></span>
</div>

<script>
rate.render({
  elem: '#productRate',
  half: true,
  text: true,
  choose: function(value){
    var texts = {
      1: '별로예요', 1.5: '그저그래요', 2: '보통이에요', 
      2.5: '괜찮아요', 3: '좋아요', 3.5: '아주 좋아요',
      4: '훌륭해요', 4.5: '완벽에 가까워요', 5: '완벽해요!'
    };
    $('#rateText').text(texts[value] || '');
    $('input[name="rating"]').val(value);
  }
});
</script>
```

### 리뷰 평점 표시

```html
<div class="review-item">
  <div class="review-rating" id="reviewRate"></div>
  <p class="review-content">좋은 상품입니다.</p>
</div>

<script>
rate.render({
  elem: '#reviewRate',
  value: 4.5,
  half: true,
  readonly: true,
  theme: '#ff5722'
});
</script>
```
