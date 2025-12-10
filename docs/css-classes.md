# Catui CSS 클래스 문서

> Catui UI Framework의 모든 CSS 클래스 레퍼런스

---

## 목차

1. [CSS 변수 (Variables)](#css-변수-variables)
2. [유틸리티 (Utilities)](#유틸리티-utilities)
3. [버튼 (Button)](#버튼-button)
4. [입력 (Input)](#입력-input)
5. [폼 (Form)](#폼-form)
6. [테이블 (Table)](#테이블-table)
7. [페이지네이션 (Page)](#페이지네이션-page)
8. [팝업 (Popup)](#팝업-popup)
9. [탭/아코디언 (Element)](#탭아코디언-element)
10. [트리 (Tree)](#트리-tree)
11. [드롭다운 (Dropdown)](#드롭다운-dropdown)
12. [날짜선택기 (Date)](#날짜선택기-date)
13. [에디터 (Editor)](#에디터-editor)
14. [업로드 (Upload)](#업로드-upload)
15. [캐러셀 (Carousel)](#캐러셀-carousel)
16. [기타 컴포넌트](#기타-컴포넌트)
17. [레이아웃 (Layout)](#레이아웃-layout)

---

## CSS 변수 (Variables)

### 테마 색상

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `--cui-primary` | `#16baaa` | 기본 브랜드 색상 |
| `--cui-primary-hover` | `#13a89a` | Primary hover 상태 |
| `--cui-primary-active` | `#10968a` | Primary active 상태 |
| `--cui-primary-rgb` | `22, 186, 170` | RGB 값 (rgba용) |
| `--cui-primary-light` | `#e8f8f6` | Primary 연한 배경색 |
| `--cui-primary-lighter` | `#f3fbfa` | Primary 더 연한 배경색 |
| `--cui-success` | `#16b777` | 성공 색상 |
| `--cui-warning` | `#ffb800` | 경고 색상 |
| `--cui-danger` | `#ff5722` | 위험/에러 색상 |
| `--cui-info` | `#1e9fff` | 정보 색상 |

### 텍스트 색상

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `--cui-text-primary` | `rgba(0,0,0,0.88)` | 기본 텍스트 |
| `--cui-text-secondary` | `rgba(0,0,0,0.65)` | 보조 텍스트 |
| `--cui-text-tertiary` | `rgba(0,0,0,0.45)` | 부가 텍스트 |
| `--cui-text-disabled` | `rgba(0,0,0,0.25)` | 비활성 텍스트 |
| `--cui-text-inverse` | `rgba(255,255,255,0.85)` | 반전 텍스트 (어두운 배경) |

### 배경 색상

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `--cui-bg-base` | `#ffffff` | 기본 배경 |
| `--cui-bg-container` | `#ffffff` | 컨테이너 배경 |
| `--cui-bg-layout` | `#f5f5f5` | 레이아웃 배경 |
| `--cui-bg-gray` | `#fafafa` | 회색 배경 |
| `--cui-bg-hover` | `rgba(0,0,0,0.04)` | hover 배경 |
| `--cui-bg-mask` | `rgba(0,0,0,0.45)` | 오버레이 마스크 |

### 테두리

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `--cui-border-color` | `#e6e6e6` | 기본 테두리 |
| `--cui-border-color-light` | `#eee` | 연한 테두리 |
| `--cui-border-color-dark` | `#d2d2d2` | 진한 테두리 |
| `--cui-border-radius` | `2px` | 기본 라운드 |
| `--cui-border-radius-lg` | `4px` | 큰 라운드 |
| `--cui-border-radius-round` | `100px` | 둥근 라운드 |

### 그림자

| 변수명 | 설명 |
|--------|------|
| `--cui-shadow-sm` | 작은 그림자 |
| `--cui-shadow-md` | 중간 그림자 |
| `--cui-shadow-lg` | 큰 그림자 |

### 간격

| 변수명 | 값 |
|--------|-----|
| `--cui-spacing-xs` | 4px |
| `--cui-spacing-sm` | 8px |
| `--cui-spacing-md` | 16px |
| `--cui-spacing-lg` | 24px |

### z-index 계층

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `--cui-z-dropdown` | 2000 | 드롭다운 |
| `--cui-z-sticky` | 3000 | 고정 요소 |
| `--cui-z-fixed` | 4000 | 고정 위치 |
| `--cui-z-modal-backdrop` | 5000 | 모달 배경 |
| `--cui-z-modal` | 5001 | 모달 |
| `--cui-z-tooltip` | 7000 | 툴팁 |
| `--cui-z-toast` | 8000 | 토스트 |

---

## 유틸리티 (Utilities)

### 기본 유틸리티

| 클래스 | 설명 |
|--------|------|
| `.cui-border-box` | `box-sizing: border-box` |
| `.cui-clear` | float 해제 |
| `.cui-inline` | 인라인 블록 |
| `.cui-elip` | 텍스트 말줄임 (...) |
| `.cui-unselect` | 텍스트 선택 방지 |
| `.cui-disabled` | 비활성화 스타일 |
| `.cui-circle` | 원형 |

### 표시/숨김

| 클래스 | 설명 |
|--------|------|
| `.cui-show` | `display: block` |
| `.cui-hide` | `display: none` |
| `.cui-show-v` | `visibility: visible` |
| `.cui-hide-v` | `visibility: hidden` |

### 배경 색상

| 클래스 | 색상 |
|--------|------|
| `.cui-bg-primary` | Primary 색상 |
| `.cui-bg-success` | 녹색 |
| `.cui-bg-warning` | 주황색 |
| `.cui-bg-danger` | 빨간색 |
| `.cui-bg-red` | 빨간색 |
| `.cui-bg-orange` | 주황색 |
| `.cui-bg-green` | 녹색 |
| `.cui-bg-blue` | 파란색 |
| `.cui-bg-cyan` | 청록색 |
| `.cui-bg-black` | 검정색 |
| `.cui-bg-gray` | 회색 |
| `.cui-bg-white` | 흰색 |

### 테두리 색상

| 클래스 | 설명 |
|--------|------|
| `.cui-border` | 기본 테두리 |
| `.cui-border-red` | 빨간 테두리 |
| `.cui-border-orange` | 주황 테두리 |
| `.cui-border-green` | 녹색 테두리 |
| `.cui-border-blue` | 파란 테두리 |
| `.cui-border-cyan` | 청록 테두리 |
| `.cui-border-black` | 검정 테두리 |

### 텍스트 색상

| 클래스 | 색상 |
|--------|------|
| `.cui-font-red` | 빨간색 |
| `.cui-font-orange` | 주황색 |
| `.cui-font-green` | 녹색 |
| `.cui-font-blue` | 파란색 |
| `.cui-font-cyan` | 청록색 |
| `.cui-font-black` | 검정색 |
| `.cui-font-gray` | 회색 |
| `.cui-font-white` | 흰색 |

### 폰트 크기

| 클래스 | 크기 |
|--------|------|
| `.cui-font-12` | 12px |
| `.cui-font-14` | 14px |
| `.cui-font-16` | 16px |
| `.cui-font-18` | 18px |
| `.cui-font-20` | 20px |
| `.cui-font-24` | 24px |
| `.cui-font-28` | 28px |
| `.cui-font-32` | 32px |

### 텍스트 정렬

| 클래스 | 정렬 |
|--------|------|
| `.cui-text-left` | 왼쪽 |
| `.cui-text-center` | 가운데 |
| `.cui-text-right` | 오른쪽 |
| `.cui-valign-top` | 상단 |
| `.cui-valign-middle` | 중앙 |
| `.cui-valign-bottom` | 하단 |

### 여백 (Margin)

| 패턴 | 예시 |
|------|------|
| `.cui-m-{n}` | `.cui-m-0`, `.cui-m-5`, `.cui-m-10`, `.cui-m-15`, `.cui-m-20` |
| `.cui-mt-{n}` | margin-top |
| `.cui-mr-{n}` | margin-right |
| `.cui-mb-{n}` | margin-bottom |
| `.cui-ml-{n}` | margin-left |

### 패딩 (Padding)

| 패턴 | 예시 |
|------|------|
| `.cui-p-{n}` | `.cui-p-0`, `.cui-p-5`, `.cui-p-10`, `.cui-p-15`, `.cui-p-20` |
| `.cui-pt-{n}` | padding-top |
| `.cui-pr-{n}` | padding-right |
| `.cui-pb-{n}` | padding-bottom |
| `.cui-pl-{n}` | padding-left |

### Flexbox

| 클래스 | 설명 |
|--------|------|
| `.cui-flex` | `display: flex` |
| `.cui-flex-wrap` | `flex-wrap: wrap` |
| `.cui-flex-nowrap` | `flex-wrap: nowrap` |
| `.cui-flex-row` | `flex-direction: row` |
| `.cui-flex-column` | `flex-direction: column` |
| `.cui-flex-center` | 가로세로 중앙 |
| `.cui-justify-start` | 시작 정렬 |
| `.cui-justify-end` | 끝 정렬 |
| `.cui-justify-center` | 중앙 정렬 |
| `.cui-justify-between` | 양끝 분배 |
| `.cui-justify-around` | 균등 분배 |
| `.cui-align-start` | 상단 정렬 |
| `.cui-align-end` | 하단 정렬 |
| `.cui-align-center` | 중앙 정렬 |
| `.cui-align-stretch` | 늘리기 |
| `.cui-flex-1` | `flex: 1` |
| `.cui-flex-auto` | `flex: auto` |
| `.cui-flex-none` | `flex: none` |

### Gap (간격)

| 클래스 | 값 |
|--------|-----|
| `.cui-gap-0` | 0 |
| `.cui-gap-5` | 5px |
| `.cui-gap-8` | 8px |
| `.cui-gap-10` | 10px |
| `.cui-gap-12` | 12px |
| `.cui-gap-15` | 15px |
| `.cui-gap-16` | 16px |
| `.cui-gap-20` | 20px |
| `.cui-gap-24` | 24px |
| `.cui-gap-30` | 30px |
| `.cui-gap-40` | 40px |
| `.cui-gap-50` | 50px |

### 애니메이션

| 클래스 | 효과 |
|--------|------|
| `.cui-anim` | 애니메이션 기본 클래스 |
| `.cui-anim-loop` | 무한 반복 |
| `.cui-anim-rotate` | 회전 |
| `.cui-anim-up` | 아래→위 슬라이드 |
| `.cui-anim-upbit` | 약간 위로 |
| `.cui-anim-down` | 위→아래 슬라이드 |
| `.cui-anim-downbit` | 약간 아래로 |
| `.cui-anim-scale` | 확대 |
| `.cui-anim-scaleSpring` | 탄성 확대 |
| `.cui-anim-fadein` | 페이드 인 |
| `.cui-anim-fadeout` | 페이드 아웃 |
| `.cui-trans` | transition 효과 |

---

## 버튼 (Button)

### 기본 버튼

```html
<button class="cui-btn">기본 버튼</button>
<button class="cui-btn cui-btn-primary">Primary</button>
<button class="cui-btn cui-btn-default">Default</button>
```

### 버튼 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-btn` | 기본 버튼 |
| `.cui-btn-default` | 테두리만 있는 버튼 |
| `.cui-btn-primary` | Primary 색상 |
| `.cui-btn-success` | 성공 (녹색) |
| `.cui-btn-warning` | 경고 (주황) |
| `.cui-btn-danger` | 위험 (빨강) |
| `.cui-btn-info` | 정보 (파랑) |
| `.cui-btn-normal` | 일반 (파랑) |

### 버튼 크기

| 클래스 | 높이 | 설명 |
|--------|------|------|
| `.cui-btn-lg` | 44px | 큰 버튼 |
| (기본) | 38px | 기본 크기 |
| `.cui-btn-sm` | 30px | 작은 버튼 |
| `.cui-btn-xs` | 22px | 아주 작은 버튼 |

### 버튼 스타일

| 클래스 | 설명 |
|--------|------|
| `.cui-btn-radius` | 둥근 버튼 (pill) |
| `.cui-btn-group` | 버튼 그룹 |
| `.cui-btn-container` | 버튼 컨테이너 |
| `.cui-btn-fluid` | 전체 너비 |

---

## 입력 (Input)

### 기본 입력

```html
<input type="text" class="cui-input" placeholder="입력">
<textarea class="cui-textarea"></textarea>
<select class="cui-select"></select>
```

### 입력 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-input` | 텍스트 입력 |
| `.cui-textarea` | 텍스트영역 |
| `.cui-select` | 선택 박스 |

### 아이콘 입력

| 클래스 | 설명 |
|--------|------|
| `.cui-input-wrap` | 아이콘 입력 래퍼 |
| `.cui-input-prefix` | 왼쪽 아이콘 |
| `.cui-input-suffix` | 오른쪽 아이콘 |

---

## 폼 (Form)

### 폼 레이아웃

```html
<form class="cui-form" cui-filter="myForm">
  <div class="cui-form-item">
    <label class="cui-form-label">라벨</label>
    <div class="cui-input-block">
      <input type="text" class="cui-input">
    </div>
  </div>
</form>
```

### 폼 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-form` | 폼 컨테이너 |
| `.cui-form-item` | 폼 아이템 |
| `.cui-form-label` | 라벨 |
| `.cui-input-block` | 입력 블록 |
| `.cui-input-inline` | 인라인 입력 |
| `.cui-form-mid` | 중간 텍스트 |
| `.cui-form-danger` | 에러 상태 |

### 체크박스/라디오

| 클래스 | 설명 |
|--------|------|
| `.cui-form-checkbox` | 체크박스 래퍼 |
| `.cui-form-radio` | 라디오 래퍼 |
| `.cui-form-checked` | 체크된 상태 |
| `.cui-form-switch` | 스위치 토글 |

---

## 테이블 (Table)

### 기본 테이블

```html
<table class="cui-table">
  <thead><tr><th>제목</th></tr></thead>
  <tbody><tr><td>내용</td></tr></tbody>
</table>
```

### 테이블 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-table` | 기본 테이블 |
| `.cui-table-view` | 테이블 뷰 컨테이너 |
| `.cui-table-box` | 테이블 박스 |
| `.cui-table-header` | 헤더 영역 |
| `.cui-table-body` | 바디 영역 |
| `.cui-table-tool` | 툴바 |
| `.cui-table-page` | 페이지네이션 영역 |

### 테이블 스타일

| 클래스 | 설명 |
|--------|------|
| `.cui-table[cui-even]` | 줄무늬 |
| `.cui-table[cui-size="sm"]` | 작은 테이블 |
| `.cui-table[cui-size="lg"]` | 큰 테이블 |
| `.cui-table[cui-skin="line"]` | 라인 스타일 |
| `.cui-table[cui-skin="row"]` | 행 스타일 |
| `.cui-table[cui-skin="nob"]` | 테두리 없음 |

---

## 페이지네이션 (Page)

### 기본 페이지네이션

```html
<div id="page1"></div>
<script>
page.render({
  elem: '#page1',
  count: 100,
  limit: 10
});
</script>
```

### 페이지네이션 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-page` | 기본 컨테이너 |
| `.cui-page-curr` | 현재 페이지 |
| `.cui-page-prev` | 이전 버튼 |
| `.cui-page-next` | 다음 버튼 |
| `.cui-page-first` | 처음 버튼 |
| `.cui-page-last` | 마지막 버튼 |

### 사이즈

| 클래스 | 설명 |
|--------|------|
| `.cui-page-sm` | 작은 크기 |
| `.cui-page-lg` | 큰 크기 |

### 스킨

| 클래스 | 설명 |
|--------|------|
| `.cui-page-skin-pill` | 알약 모양 |
| `.cui-page-skin-outline` | 테두리만 |
| `.cui-page-skin-square` | 사각형 |

---

## 팝업 (Popup)

### 팝업 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-popup` | 팝업 컨테이너 |
| `.cui-popup-title` | 타이틀 바 |
| `.cui-popup-content` | 내용 영역 |
| `.cui-popup-btn` | 버튼 영역 |
| `.cui-popup-close` | 닫기 버튼 |
| `.cui-popup-shade` | 배경 마스크 |

### 팝업 스킨

| 클래스 | 설명 |
|--------|------|
| `.cui-popup-skin-primary` | Primary 스킨 |
| `.cui-popup-skin-success` | 성공 스킨 |
| `.cui-popup-skin-warning` | 경고 스킨 |
| `.cui-popup-skin-danger` | 위험 스킨 |
| `.cui-popup-skin-info` | 정보 스킨 |
| `.cui-popup-skin-dark` | 다크 스킨 |
| `.cui-popup-skin-minimal` | 미니멀 스킨 |
| `.cui-popup-skin-round` | 둥근 스킨 |
| `.cui-popup-skin-flat` | 플랫 스킨 |
| `.cui-popup-skin-glass` | 글래스 스킨 |
| `.cui-popup-skin-ios` | iOS 스킨 |
| `.cui-popup-skin-material` | Material 스킨 |

---

## 탭/아코디언 (Element)

### 탭

```html
<div class="cui-tab" cui-filter="myTab">
  <ul class="cui-tab-title">
    <li class="cui-this">탭1</li>
    <li>탭2</li>
  </ul>
  <div class="cui-tab-content">
    <div class="cui-tab-item cui-show">내용1</div>
    <div class="cui-tab-item">내용2</div>
  </div>
</div>
```

### 탭 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-tab` | 탭 컨테이너 |
| `.cui-tab-title` | 탭 헤더 |
| `.cui-tab-content` | 탭 내용 |
| `.cui-tab-item` | 탭 아이템 |
| `.cui-tab-brief` | 간결한 스타일 |
| `.cui-tab-card` | 카드 스타일 |

### 프로그레스 바

| 클래스 | 설명 |
|--------|------|
| `.cui-progress` | 프로그레스 컨테이너 |
| `.cui-progress-bar` | 프로그레스 바 |
| `.cui-progress-text` | 텍스트 |
| `.cui-progress-big` | 큰 크기 |

### 아코디언

| 클래스 | 설명 |
|--------|------|
| `.cui-collapse` | 아코디언 컨테이너 |
| `.cui-collapse-item` | 아이템 |
| `.cui-collapse-title` | 타이틀 |
| `.cui-collapse-content` | 내용 |

---

## 트리 (Tree)

### 트리 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-tree` | 트리 컨테이너 |
| `.cui-tree-set` | 노드 세트 |
| `.cui-tree-entry` | 노드 엔트리 |
| `.cui-tree-main` | 메인 영역 |
| `.cui-tree-txt` | 텍스트 |
| `.cui-tree-pack` | 자식 노드 래퍼 |
| `.cui-tree-spread` | 펼침 상태 |
| `.cui-tree-line` | 연결선 |

### 트리 스킨

| 클래스 | 설명 |
|--------|------|
| `.cui-tree-skin-folder` | 폴더 스킨 |
| `.cui-tree-skin-dark` | 다크 스킨 |
| `.cui-tree-skin-compact` | 컴팩트 스킨 |

---

## 드롭다운 (Dropdown)

### 드롭다운 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-dropdown` | 드롭다운 컨테이너 |
| `.cui-dropdown-menu` | 메뉴 |
| `.cui-dropdown-item` | 아이템 |

### 메뉴

| 클래스 | 설명 |
|--------|------|
| `.cui-menu` | 메뉴 컨테이너 |
| `.cui-menu-item` | 메뉴 아이템 |
| `.cui-menu-item-group` | 그룹 |
| `.cui-menu-body-title` | 그룹 타이틀 |

---

## 날짜선택기 (Date)

### 날짜 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-date` | 날짜 선택기 |
| `.cui-date-header` | 헤더 |
| `.cui-date-content` | 내용 |
| `.cui-date-table` | 날짜 테이블 |
| `.cui-date-list` | 리스트 (년/월) |
| `.cui-date-footer` | 푸터 |

---

## 에디터 (Editor)

### 에디터 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-editor` | 에디터 컨테이너 |
| `.cui-editor-toolbar` | 툴바 |
| `.cui-editor-content` | 내용 영역 |
| `.cui-editor-tool` | 도구 버튼 |

---

## 업로드 (Upload)

### 업로드 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-upload` | 업로드 컨테이너 |
| `.cui-upload-drag` | 드래그 영역 |
| `.cui-upload-list` | 파일 리스트 |
| `.cui-upload-item` | 파일 아이템 |

---

## 캐러셀 (Carousel)

### 캐러셀 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-carousel` | 캐러셀 컨테이너 |
| `.cui-carousel-arrow` | 화살표 |
| `.cui-carousel-ind` | 인디케이터 |
| `.cui-carousel-prev` | 이전 버튼 |
| `.cui-carousel-next` | 다음 버튼 |

---

## 기타 컴포넌트

### 인용 (Blockquote)

| 클래스 | 설명 |
|--------|------|
| `.cui-quote` | 기본 인용 |
| `.cui-quote-nm` | 테두리 스타일 |
| `.cui-quote-success` | 성공 색상 |
| `.cui-quote-warning` | 경고 색상 |
| `.cui-quote-danger` | 위험 색상 |

### 패널

| 클래스 | 설명 |
|--------|------|
| `.cui-panel` | 패널 컨테이너 |
| `.cui-panel-header` | 패널 헤더 |
| `.cui-panel-body` | 패널 바디 |
| `.cui-panel-footer` | 패널 푸터 |
| `.cui-panel-primary` | Primary 색상 |
| `.cui-panel-success` | 성공 색상 |

### 카드

| 클래스 | 설명 |
|--------|------|
| `.cui-card` | 카드 컨테이너 |
| `.cui-card-header` | 카드 헤더 |
| `.cui-card-body` | 카드 바디 |
| `.cui-card-footer` | 카드 푸터 |
| `.cui-card-hover` | 호버 효과 |
| `.cui-card-primary` | Primary 헤더 |

### 뱃지

| 클래스 | 설명 |
|--------|------|
| `.cui-badge` | 기본 뱃지 |
| `.cui-badge-dot` | 점 뱃지 |
| `.cui-badge-rim` | 테두리 뱃지 |
| `.cui-badge-wrap` | 뱃지 래퍼 |

### 구분선

| 클래스 | 설명 |
|--------|------|
| `.cui-hr` | 기본 구분선 |
| `.cui-hr-dashed` | 점선 |
| `.cui-hr-dotted` | 점점선 |
| `.cui-hr-text` | 텍스트 포함 |

### Fixbar

| 클래스 | 설명 |
|--------|------|
| `.cui-fixbar` | 고정바 컨테이너 |
| `.cui-fixbar-item` | 아이템 |
| `.cui-fixbar-top` | 맨위로 버튼 |

---

## 레이아웃 (Layout)

### Admin 레이아웃

```html
<div class="cui-layout-admin">
  <header class="cui-layout-header"></header>
  <aside class="cui-layout-side"></aside>
  <main class="cui-layout-body"></main>
</div>
```

### 레이아웃 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-layout-admin` | Admin 레이아웃 |
| `.cui-layout-header` | 헤더 |
| `.cui-layout-side` | 사이드바 |
| `.cui-layout-body` | 메인 영역 |
| `.cui-layout-right` | 우측 영역 |
| `.cui-logo` | 로고 영역 |
| `.cui-nav` | 네비게이션 |
| `.cui-side-menu` | 사이드 메뉴 |
| `.cui-body` | 바디 컨테이너 |
| `.cui-footer` | 푸터 |

### 컨테이너

| 클래스 | 설명 |
|--------|------|
| `.cui-container` | 기본 컨테이너 |
| `.cui-container-fluid` | 전체 너비 |
| `.cui-row` | 행 |
| `.cui-col-*` | 열 (1-12) |

---

## 아이콘 (Icon)

### 사용법

```html
<i class="cui-icon">icon_name</i>
```

Material Icons를 사용합니다. [Material Icons 목록](https://fonts.google.com/icons) 참조.

### 아이콘 클래스

| 클래스 | 설명 |
|--------|------|
| `.cui-icon` | 아이콘 기본 |
| `.cui-icon-xs` | 14px |
| `.cui-icon-sm` | 18px |
| `.cui-icon-md` | 24px |
| `.cui-icon-lg` | 32px |
| `.cui-icon-xl` | 48px |

---

## 반응형 (Responsive)

### 브레이크포인트

| 클래스 | 크기 |
|--------|------|
| `.cui-xs-*` | < 576px |
| `.cui-sm-*` | ≥ 576px |
| `.cui-md-*` | ≥ 768px |
| `.cui-lg-*` | ≥ 992px |
| `.cui-xl-*` | ≥ 1200px |

### 숨김/표시

| 클래스 | 설명 |
|--------|------|
| `.cui-hide-xs` | xs에서 숨김 |
| `.cui-show-xs-only` | xs에서만 표시 |

---

*문서 생성일: 2024-12-10*
*Catui v1.0.0*
