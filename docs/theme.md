# Theme 모듈

테마 관리 모듈입니다. 프리셋 테마 선택, 커스텀 브랜드 컬러 적용, 다크 모드 등을 지원합니다.

## 기본 사용법

```javascript
Catui.use(['theme'], function(){
  // 테마 설정
  theme.set('blue');
  
  // 현재 테마 확인
  console.log(theme.current()); // 'blue'
});
```

---

## 프리셋 테마

| 테마명 | 설명 | Primary 색상 |
|--------|------|--------------|
| `default` | 기본 (다크 사이드바) | #1677ff |
| `light` | 라이트 (전체 밝음) | #1677ff |
| `dark` | 다크 (전체 어두움) | #1677ff |
| `blue` | 블루 | #1677ff |
| `green` | 그린 | #52c41a |
| `purple` | 퍼플 | #722ed1 |
| `orange` | 오렌지 | #fa8c16 |
| `red` | 레드 | #ff4d4f |
| `cyan` | 시안 | #13c2c2 |
| `pink` | 핑크 | #eb2f96 |
| `indigo` | 인디고 | #2f54eb |
| `teal` | 티얼 | #20c997 |

---

## API

### theme.set(name, save)

테마를 설정합니다.

```javascript
// 테마 설정 (localStorage에 저장)
theme.set('blue');

// 저장 없이 설정
theme.set('green', false);
```

#### 매개변수

| 매개변수 | 타입 | 설명 | 기본값 |
|----------|------|------|--------|
| name | string | 테마 이름 | 'default' |
| save | boolean | localStorage 저장 여부 | true |

---

### theme.setPrimary(color, options)

Primary 색상만 변경합니다 (브랜드 컬러).

```javascript
// 기본 사용
theme.setPrimary('#ff6600');

// 헤더에도 적용
theme.setPrimary('#ff6600', { applyToLayout: true });
```

#### setPrimary 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| applyToLayout | boolean | 헤더/로고에도 색상 적용 |

#### 자동 계산되는 CSS 변수

- `--cui-primary`: 기본 색상
- `--cui-primary-rgb`: RGB 값
- `--cui-primary-hover`: 호버 색상 (10% 어둡게)
- `--cui-primary-active`: 활성 색상 (20% 어둡게)
- `--cui-primary-light`: 연한 배경 (90% 밝게)
- `--cui-primary-lighter`: 더 연한 배경 (95% 밝게)

---

### theme.setBrand(brandColor, options)

전체 브랜드 컬러 세트를 적용합니다.

```javascript
// 기본 사용
theme.setBrand('#ff6600');

// 조화 색상 자동 생성
theme.setBrand('#ff6600', { harmonize: true });

// 레이아웃에도 적용
theme.setBrand('#ff6600', { 
  applyToLayout: true,
  harmonize: true 
});
```

#### 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| applyToLayout | boolean | 헤더/로고에 색상 적용 |
| harmonize | boolean | success, info 색상도 조화롭게 조정 |

---

### theme.list()

모든 프리셋 테마 목록을 반환합니다.

```javascript
var themes = theme.list();
console.log(themes);
// { default: {...}, light: {...}, blue: {...}, ... }
```

---

### theme.get(name)

특정 테마 정보를 가져옵니다.

```javascript
var blueTheme = theme.get('blue');
console.log(blueTheme);
// { name: '블루', header: '#1677ff', sidebar: '#001529', ... }
```

---

### theme.current()

현재 적용된 테마 이름을 반환합니다.

```javascript
var current = theme.current();
console.log(current); // 'default'
```

---

### theme.reset()

테마를 기본값으로 초기화합니다.

```javascript
theme.reset();
```

---

### theme.restore()

localStorage에 저장된 테마를 복원합니다.

```javascript
theme.restore();
```

> **참고**: DOM Ready 시 자동으로 호출됩니다.

---

### theme.add(name, config)

커스텀 테마를 추가합니다.

```javascript
theme.add('custom', {
  name: '커스텀',
  header: '#333333',
  sidebar: '#222222',
  logo: '#444444',
  primary: '#00ff00',
  isDark: true,
  vars: {
    '--cui-theme-header-text': '#ffffff'
  }
});

// 사용
theme.set('custom');
```

#### 테마 설정 구조

| 속성 | 타입 | 설명 |
|------|------|------|
| name | string | 표시 이름 |
| header | string | 헤더 배경색 |
| sidebar | string | 사이드바 배경색 |
| logo | string | 로고 영역 배경색 |
| primary | string | Primary 색상 |
| isDark | boolean | 다크 모드 여부 |
| vars | object | 추가 CSS 변수 |

---

### theme.render(elem, options)

테마 선택기를 렌더링합니다.

```html
<div id="themePicker"></div>

<script>
theme.render('#themePicker', {
  size: 24,
  gap: 8,
  showName: false,
  onChange: function(name, data){
    console.log('테마 변경:', name);
  }
});
</script>
```

#### render 옵션

| 옵션 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| size | number | 선택 버튼 크기 (px) | 24 |
| gap | number | 버튼 간격 (px) | 8 |
| showName | boolean | 테마 이름 표시 | false |
| onChange | function | 변경 콜백 | null |

---

## 이벤트

### change

테마가 변경될 때 발생합니다.

```javascript
theme.on('change', function(obj){
  console.log('테마:', obj.theme);
  console.log('데이터:', obj.data);
  console.log('다크 모드:', obj.isDark);
});
```

---

## 테마 적용 컴포넌트

테마 변경 시 영향을 받는 컴포넌트:

| 컴포넌트 | 적용 부분 |
|----------|-----------|
| 버튼 | Primary 버튼 배경 |
| 탭 | 활성 탭 색상, 밑줄, 배경 |
| 뱃지 | Primary 뱃지 |
| 프로그레스 | 기본 진행바 색상 |
| 링크 | 텍스트 색상 |
| Input | Focus 테두리, 그림자 |
| 체크박스/라디오 | 선택 시 색상 |
| 테이블 | 체크된 행 배경 |
| 아코디언 | 열린 항목 배경 |
| 메뉴 | 활성 항목 배경 |
| 캐러셀 | 화살표 호버, 인디케이터 |
| 필드셋 | 테두리 색상 |
| 인용문 | 왼쪽 테두리 |

---

## CSS 변수

```css
:root {
  /* Primary 색상 */
  --cui-primary: #1677ff;
  --cui-primary-hover: #4096ff;
  --cui-primary-active: #0958d9;
  --cui-primary-rgb: 22, 119, 255;
  --cui-primary-light: #e6f4ff;
  --cui-primary-lighter: #f0f8ff;
  
  /* 레이아웃 테마 */
  --cui-theme-header: #1e1e2d;
  --cui-theme-sidebar: #1e1e2d;
  --cui-theme-logo: var(--cui-primary);
}
```
