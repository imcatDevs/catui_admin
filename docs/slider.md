# Slider 모듈

슬라이더(범위 선택기)를 제공하는 모듈입니다.

## 기본 사용법

```html
<div id="slider"></div>

<script>
Catui.use(['slider'], function(){
  slider.render({
    elem: '#slider',
    change: function(value){
      console.log(value);
    }
  });
});
</script>
```

---

## render(options)

슬라이더를 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `type` | String | 'default' | 타입 (default/vertical) |
| `min` | Number | 0 | 최소값 |
| `max` | Number | 100 | 최대값 |
| `value` | Number/Array | 0 | 초기값 |
| `step` | Number | 1 | 단계 |
| `range` | Boolean | false | 범위 선택 |
| `showstep` | Boolean | false | 단계 점 표시 |
| `tips` | Boolean | true | 툴팁 표시 |
| `input` | Boolean | false | 입력 박스 표시 |
| `disabled` | Boolean | false | 비활성화 |
| `theme` | String | '#1677ff' | 테마 색상 |

### 콜백

| 콜백 | 설명 |
|------|------|
| `change(value)` | 값 변경 시 |
| `done(value)` | 드래그 완료 시 |

### 인스턴스 메소드

```javascript
var inst = slider.render({
  elem: '#slider',
  value: 50
});

inst.setValue(75);      // 값 설정
inst.getValue();        // 값 가져오기 (75)
inst.destroy();         // 인스턴스 정리
```

| 메소드 | 설명 |
|--------|------|
| `setValue(value, idx)` | 값 설정 (범위: idx로 지정) |
| `getValue()` | 현재 값 가져오기 |
| `destroy()` | 인스턴스 정리 |

---

## 범위 선택 (range)

```javascript
slider.render({
  elem: '#slider',
  range: true,
  value: [20, 80],
  change: function(value){
    console.log('최소:', value[0], '최대:', value[1]);
  }
});
```

---

## 수직 슬라이더

```javascript
slider.render({
  elem: '#slider',
  type: 'vertical',
  height: 200
});
```

---

## 단계 설정

```javascript
slider.render({
  elem: '#slider',
  min: 0,
  max: 100,
  step: 10,
  showstep: true
});
```

---

## 입력 박스 연동

```javascript
slider.render({
  elem: '#slider',
  input: true,
  change: function(value){
    $('#value').text(value);
  }
});
```

---

## 완전한 예시

### 볼륨 조절

```html
<div style="display:flex;align-items:center;gap:10px;">
  <i class="cui-icon">volume_down</i>
  <div id="volumeSlider" style="flex:1;"></div>
  <i class="cui-icon">volume_up</i>
  <span id="volumeValue">50</span>%
</div>

<script>
slider.render({
  elem: '#volumeSlider',
  value: 50,
  change: function(value){
    $('#volumeValue').text(value);
  }
});
</script>
```

### 가격 범위

```html
<div id="priceSlider"></div>
<p>가격: <span id="minPrice">0</span>원 ~ <span id="maxPrice">100000</span>원</p>

<script>
slider.render({
  elem: '#priceSlider',
  range: true,
  min: 0,
  max: 100000,
  step: 1000,
  value: [10000, 50000],
  change: function(value){
    $('#minPrice').text(value[0].toLocaleString());
    $('#maxPrice').text(value[1].toLocaleString());
  }
});
</script>
```
