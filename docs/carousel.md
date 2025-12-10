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

## API 목록

| API | 설명 |
|-----|------|
| `render(options)` | 캐러셀 렌더링 (인스턴스 반환) |
| `set(options)` | 전역 설정 |
| `getInst(id)` | 인스턴스 가져오기 |
| `on(events, callback)` | 이벤트 등록 |

### 인스턴스 메서드

| 메서드 | 설명 |
|--------|------|
| `goto(index)` | 지정 슬라이드로 이동 |
| `prev()` | 이전 슬라이드 |
| `next()` | 다음 슬라이드 |
| `reload(options)` | 리로드 |
| `destroy()` | 인스턴스 정리 |
| `config` | 설정 객체 |

---

## render(options)

캐러셀을 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `width` | String | '600px' | 너비 |
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

## 인스턴스 메소드

`render()` 반환 객체에서 사용할 수 있는 메소드입니다.

```javascript
var inst = carousel.render({
  elem: '#carousel',
  autoplay: true
});

// 특정 슬라이드로 이동
inst.goto(2);

// 이전/다음 슬라이드
inst.prev();
inst.next();

// 일시정지/재생
inst.pause();
inst.play();

// 인스턴스 정리
inst.destroy();
```

| 메소드 | 설명 |
|--------|------|
| `goto(index)` | 특정 슬라이드로 이동 |
| `prev()` | 이전 슬라이드 |
| `next()` | 다음 슬라이드 |
| `pause()` | 자동재생 일시정지 |
| `play()` | 자동재생 재개 |
| `reload(options)` | 옵션 변경 후 리로드 |
| `destroy()` | 인스턴스 정리 |

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
