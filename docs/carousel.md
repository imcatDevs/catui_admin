# Carousel 모듈

캐러셀/슬라이드쇼를 제공하는 모듈입니다.

## 기본 사용법

```html
<div class="cui-carousel" id="carousel">
  <div carousel-item>
    <div><img src="/img/1.jpg" alt=""></div>
    <div><img src="/img/2.jpg" alt=""></div>
    <div><img src="/img/3.jpg" alt=""></div>
  </div>
</div>

<script>
Catui.use(['carousel'], function(){
  carousel.render({
    elem: '#carousel'
  });
});
</script>
```

---

## render(options)

캐러셀을 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `width` | String | '100%' | 너비 |
| `height` | String | '280px' | 높이 |
| `full` | Boolean | false | 전체 화면 |
| `anim` | String | 'default' | 애니메이션 |
| `autoplay` | Boolean | true | 자동 재생 |
| `interval` | Number | 3000 | 전환 간격 (ms) |
| `index` | Number | 0 | 시작 인덱스 |
| `arrow` | String | 'hover' | 화살표 (hover/always/none) |
| `indicator` | String | 'inside' | 인디케이터 (inside/outside/none) |

### 콜백

| 콜백 | 설명 |
|------|------|
| `change(index)` | 슬라이드 변경 시 |

---

## 애니메이션 (anim)

| 값 | 설명 |
|----|------|
| `default` | 좌우 슬라이드 |
| `updown` | 상하 슬라이드 |
| `fade` | 페이드 |

```javascript
carousel.render({
  elem: '#carousel',
  anim: 'fade'
});
```

---

## 화살표 (arrow)

```javascript
// 호버 시 표시 (기본)
carousel.render({
  elem: '#carousel',
  arrow: 'hover'
});

// 항상 표시
carousel.render({
  elem: '#carousel',
  arrow: 'always'
});

// 숨김
carousel.render({
  elem: '#carousel',
  arrow: 'none'
});
```

---

## 인디케이터 (indicator)

```javascript
// 내부 표시 (기본)
carousel.render({
  elem: '#carousel',
  indicator: 'inside'
});

// 외부 표시
carousel.render({
  elem: '#carousel',
  indicator: 'outside'
});

// 숨김
carousel.render({
  elem: '#carousel',
  indicator: 'none'
});
```

---

## 완전한 예시

```html
<div class="cui-carousel" id="mainBanner">
  <div carousel-item>
    <div>
      <a href="/event/1">
        <img src="/img/banner1.jpg" alt="이벤트 1">
      </a>
    </div>
    <div>
      <a href="/event/2">
        <img src="/img/banner2.jpg" alt="이벤트 2">
      </a>
    </div>
    <div>
      <a href="/event/3">
        <img src="/img/banner3.jpg" alt="이벤트 3">
      </a>
    </div>
  </div>
</div>

<script>
Catui.use(['carousel'], function(){
  carousel.render({
    elem: '#mainBanner',
    width: '100%',
    height: '400px',
    anim: 'fade',
    autoplay: true,
    interval: 5000,
    arrow: 'always',
    change: function(index){
      console.log('현재 슬라이드:', index);
    }
  });
});
</script>
```
