# Catui 모듈 문서

Catui는 한국어 UI 프레임워크입니다.

## 모듈 목록

### 코어

- [cui.js](./cui.md) - 코어 모듈
- [layout](./layout.md) - 레이아웃/그리드 시스템

### UI 컴포넌트

- [popup.js](./popup.md) - 팝업/레이어
- [table.js](./table.md) - 데이터 테이블
- [form.js](./form.md) - 폼 요소
- [tree.js](./tree.md) - 트리 구조
- [date.js](./date.md) - 날짜/시간 선택기
- [page.js](./page.md) - 페이지네이션
- [element.js](./element.md) - 기본 요소 (탭, 진행바 등)
- [upload.js](./upload.md) - 파일 업로드
- [dropdown.js](./dropdown.md) - 드롭다운 메뉴
- [carousel.js](./carousel.md) - 캐러셀/슬라이드
- [transfer.js](./transfer.md) - 트랜스퍼 (이중 목록)
- [slider.js](./slider.md) - 슬라이더
- [rate.js](./rate.md) - 평점/별점
- [colorpicker.js](./colorpicker.md) - 컬러 선택기
- [theme.js](./theme.md) - 테마 관리

### 유틸리티

- [util.js](./util.md) - 유틸리티 함수
- [flow.js](./flow.md) - 플로우 (무한 스크롤)
- [tpl.js](./tpl.md) - 템플릿 엔진
- [code.js](./code.md) - 코드 하이라이트
- [editor.js](./editor.md) - 에디터

## 사용법

```html
<!-- CSS -->
<link rel="stylesheet" href="dist/css/catui.css">

<!-- JS -->
<script src="dist/catui.js"></script>

<script>
  Catui.use(['popup', 'table', 'form'], function(){
    // 모듈 사용
    popup.alert('안녕하세요!');
  });
</script>
```

## 전역 설정

```javascript
Catui.config({
  base: '/dist/modules/',  // 모듈 경로
  version: false           // 버전 쿼리스트링
});
```
