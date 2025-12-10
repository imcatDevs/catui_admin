# Colorpicker 모듈

컬러 선택기를 제공하는 모듈입니다.

## 기본 사용법

```html
<div id="colorPicker"></div>

<script>
Catui.use(['colorpicker'], function(){
  colorpicker.render({
    elem: '#colorPicker',
    done: function(color){
      console.log(color);
    }
  });
});
</script>
```

---

## render(options)

컬러 선택기를 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `color` | String | '' | 초기 색상 |
| `format` | String | 'hex' | 형식 (hex/rgb/rgba) |
| `predefine` | Boolean | false | 사전 정의 색상 |
| `colors` | Array | [] | 사전 정의 색상 목록 |
| `alpha` | Boolean | false | 투명도 지원 |
| `size` | String | - | 크기 (lg/sm/xs) |

### 콜백

| 콜백 | 설명 |
|------|------|
| `done(color)` | 선택 완료 |
| `change(color)` | 색상 변경 중 |

---

## 색상 형식 (format)

```javascript
// HEX (기본)
colorpicker.render({
  elem: '#picker',
  format: 'hex',
  done: function(color){
    console.log(color);  // "#1677ff"
  }
});

// RGB
colorpicker.render({
  elem: '#picker',
  format: 'rgb',
  done: function(color){
    console.log(color);  // "rgb(22, 119, 255)"
  }
});

// RGBA (투명도 포함)
colorpicker.render({
  elem: '#picker',
  format: 'rgba',
  alpha: true,
  done: function(color){
    console.log(color);  // "rgba(22, 119, 255, 0.8)"
  }
});
```

---

## 사전 정의 색상

```javascript
colorpicker.render({
  elem: '#picker',
  predefine: true,
  colors: [
    '#1677ff', '#16b777', '#ffb800', '#ff5722',
    '#2f4056', '#393d49', '#e6e6e6', '#ffffff'
  ]
});
```

---

## 완전한 예시

### 테마 색상 선택

```html
<div class="theme-picker">
  <label>테마 색상:</label>
  <div id="themePicker"></div>
  <span id="colorValue">#1677ff</span>
</div>

<script>
colorpicker.render({
  elem: '#themePicker',
  color: '#1677ff',
  predefine: true,
  colors: [
    '#1677ff', '#16b777', '#ffb800', '#ff5722',
    '#eb2f96', '#722ed1', '#13c2c2', '#52c41a'
  ],
  done: function(color){
    $('#colorValue').text(color);
    document.documentElement.style.setProperty('--cui-primary', color);
  }
});
</script>
```

### 배경색 선택

```html
<div class="bg-picker">
  <div id="bgPicker"></div>
  <div id="preview" style="width:100px;height:100px;border:1px solid #ccc;"></div>
</div>

<script>
colorpicker.render({
  elem: '#bgPicker',
  format: 'rgba',
  alpha: true,
  color: 'rgba(255, 255, 255, 1)',
  change: function(color){
    $('#preview').css('background-color', color);
  },
  done: function(color){
    popup.msg('선택된 색상: ' + color);
  }
});
</script>
```
