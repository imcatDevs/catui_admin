# Layout 레이아웃

그리드 시스템과 레이아웃 유틸리티를 제공합니다.

## 컨테이너

```html
<!-- 고정 너비 컨테이너 -->
<div class="cui-container">
  내용
</div>

<!-- 전체 너비 컨테이너 -->
<div class="cui-fluid">
  내용
</div>
```

### 컨테이너 너비

| 화면 크기 | 너비 |
|----------|------|
| < 768px | 100% |
| ≥ 768px | 750px |
| ≥ 992px | 970px |
| ≥ 1200px | 1170px |

---

## 그리드 시스템

12열 그리드 시스템을 제공합니다.

### 기본 사용법

```html
<div class="cui-row">
  <div class="cui-col-md6">1/2</div>
  <div class="cui-col-md6">1/2</div>
</div>

<div class="cui-row">
  <div class="cui-col-md4">1/3</div>
  <div class="cui-col-md4">1/3</div>
  <div class="cui-col-md4">1/3</div>
</div>

<div class="cui-row">
  <div class="cui-col-md3">1/4</div>
  <div class="cui-col-md3">1/4</div>
  <div class="cui-col-md3">1/4</div>
  <div class="cui-col-md3">1/4</div>
</div>
```

### 반응형 클래스

| 클래스 | 화면 크기 |
|--------|----------|
| `cui-col-xs*` | < 768px (모바일) |
| `cui-col-sm*` | ≥ 768px (태블릿) |
| `cui-col-md*` | ≥ 992px (데스크탑) |
| `cui-col-lg*` | ≥ 1200px (대형 화면) |

### 반응형 예시

```html
<div class="cui-row">
  <!-- 모바일: 전체, 태블릿: 1/2, 데스크탑: 1/3 -->
  <div class="cui-col-xs12 cui-col-sm6 cui-col-md4">
    반응형 열
  </div>
</div>
```

### 열 오프셋

```html
<div class="cui-row">
  <div class="cui-col-md6 cui-col-md-offset3">
    왼쪽 3칸 오프셋
  </div>
</div>
```

### 열 간격

```html
<!-- 10px 간격 -->
<div class="cui-row cui-col-space10">
  <div class="cui-col-md4"><div>내용</div></div>
  <div class="cui-col-md4"><div>내용</div></div>
  <div class="cui-col-md4"><div>내용</div></div>
</div>
```

간격 옵션: `1`, `2`, `4`, `5`, `6`, `8`, `10`, `12`, `15`, `16`, `20`, `24`, `30`

---

## 관리자 레이아웃

```html
<body class="cui-layout-body">
  <div class="cui-layout cui-layout-admin">
    <!-- 헤더 -->
    <div class="cui-header">
      <div class="cui-logo">CATUI</div>
      <ul class="cui-nav cui-layout-right">
        <li class="cui-nav-item">
          <a href="#">사용자</a>
        </li>
      </ul>
    </div>
    
    <!-- 사이드바 -->
    <div class="cui-side cui-bg-black">
      <div class="cui-side-scroll">
        <ul class="cui-nav cui-nav-tree">
          <li class="cui-nav-item"><a href="#">메뉴 1</a></li>
          <li class="cui-nav-item"><a href="#">메뉴 2</a></li>
        </ul>
      </div>
    </div>
    
    <!-- 본문 -->
    <div class="cui-body">
      <div class="cui-main">
        내용
      </div>
    </div>
    
    <!-- 푸터 -->
    <div class="cui-footer">
      © 2024 Catui
    </div>
  </div>
</body>
```

---

## 표시/숨김

### 화면 크기별 숨김

```html
<div class="cui-hide-xs">모바일에서 숨김</div>
<div class="cui-hide-sm">태블릿에서 숨김</div>
<div class="cui-hide-md">데스크탑에서 숨김</div>
<div class="cui-hide-lg">대형 화면에서 숨김</div>
```

### 화면 크기별 표시

```html
<div class="cui-show-xs-block">모바일에서만 표시</div>
<div class="cui-show-sm-block">태블릿에서만 표시</div>
<div class="cui-show-md-block">데스크탑에서만 표시</div>
<div class="cui-show-lg-block">대형 화면에서만 표시</div>
```

---

## 유틸리티 클래스

### 배경 색상

```html
<div class="cui-bg-primary">Primary</div>
<div class="cui-bg-success">Success</div>
<div class="cui-bg-warning">Warning</div>
<div class="cui-bg-danger">Danger</div>
<div class="cui-bg-blue">Blue</div>
<div class="cui-bg-green">Green</div>
<div class="cui-bg-orange">Orange</div>
<div class="cui-bg-red">Red</div>
<div class="cui-bg-gray">Gray</div>
<div class="cui-bg-black">Black</div>
```

### 텍스트 색상

```html
<span class="cui-font-blue">Blue</span>
<span class="cui-font-green">Green</span>
<span class="cui-font-orange">Orange</span>
<span class="cui-font-red">Red</span>
<span class="cui-font-gray">Gray</span>
<span class="cui-font-black">Black</span>
```

### 폰트 크기

```html
<span class="cui-font-12">12px</span>
<span class="cui-font-14">14px</span>
<span class="cui-font-16">16px</span>
<span class="cui-font-18">18px</span>
<span class="cui-font-20">20px</span>
<span class="cui-font-24">24px</span>
```

### 정렬

```html
<div class="cui-text-left">왼쪽 정렬</div>
<div class="cui-text-center">가운데 정렬</div>
<div class="cui-text-right">오른쪽 정렬</div>
```

### 여백

```html
<!-- 마진 -->
<div class="cui-m-10">전체 10px 마진</div>
<div class="cui-mt-10">상단 10px 마진</div>
<div class="cui-mr-10">우측 10px 마진</div>
<div class="cui-mb-10">하단 10px 마진</div>
<div class="cui-ml-10">좌측 10px 마진</div>

<!-- 패딩 -->
<div class="cui-p-10">전체 10px 패딩</div>
<div class="cui-pt-10">상단 10px 패딩</div>
<div class="cui-pr-10">우측 10px 패딩</div>
<div class="cui-pb-10">하단 10px 패딩</div>
<div class="cui-pl-10">좌측 10px 패딩</div>
```

옵션: `0`, `5`, `10`, `15`, `20`

### Flexbox

```html
<div class="cui-flex cui-flex-center">
  <div>가운데 정렬</div>
</div>

<div class="cui-flex cui-justify-between cui-align-center">
  <div>왼쪽</div>
  <div>오른쪽</div>
</div>

<div class="cui-flex cui-gap-10">
  <div>아이템 1</div>
  <div>아이템 2</div>
  <div>아이템 3</div>
</div>
```

| 클래스 | 설명 |
|--------|------|
| `cui-flex` | display: flex |
| `cui-flex-wrap` | flex-wrap: wrap |
| `cui-flex-row` | flex-direction: row |
| `cui-flex-column` | flex-direction: column |
| `cui-flex-center` | 가로/세로 가운데 |
| `cui-justify-start` | justify-content: flex-start |
| `cui-justify-end` | justify-content: flex-end |
| `cui-justify-center` | justify-content: center |
| `cui-justify-between` | justify-content: space-between |
| `cui-justify-around` | justify-content: space-around |
| `cui-align-start` | align-items: flex-start |
| `cui-align-end` | align-items: flex-end |
| `cui-align-center` | align-items: center |
| `cui-gap-5/10/15/20` | gap |

---

## 카드

```html
<div class="cui-card">
  <div class="cui-card-header">제목</div>
  <div class="cui-card-body">
    내용
  </div>
</div>
```

---

## 뱃지

```html
<span class="cui-badge">99</span>
<span class="cui-badge cui-bg-blue">NEW</span>
<span class="cui-badge-dot"></span>
<span class="cui-badge-rim">테두리</span>
```

---

## 인용

```html
<div class="cui-elem-quote">
  인용 텍스트입니다.
</div>
```

---

## 애니메이션

```html
<div class="cui-anim cui-anim-up">위로 슬라이드</div>
<div class="cui-anim cui-anim-down">아래로 슬라이드</div>
<div class="cui-anim cui-anim-scale">확대</div>
<div class="cui-anim cui-anim-fadein">페이드인</div>
<div class="cui-anim cui-anim-rotate cui-anim-loop">회전 (반복)</div>
```

| 클래스 | 설명 |
|--------|------|
| `cui-anim-up` | 아래에서 위로 |
| `cui-anim-upbit` | 약간 위로 |
| `cui-anim-down` | 위에서 아래로 |
| `cui-anim-downbit` | 약간 아래로 |
| `cui-anim-scale` | 확대 |
| `cui-anim-scaleSpring` | 탄성 확대 |
| `cui-anim-fadein` | 페이드인 |
| `cui-anim-fadeout` | 페이드아웃 |
| `cui-anim-rotate` | 회전 |
| `cui-anim-loop` | 무한 반복 |

---

## 완전한 예시

### 관리자 대시보드

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>관리자 대시보드</title>
  <link rel="stylesheet" href="/dist/css/catui.css">
</head>
<body class="cui-layout-body">
  <div class="cui-layout cui-layout-admin">
    <!-- 헤더 -->
    <div class="cui-header cui-bg-black">
      <div class="cui-logo">ADMIN</div>
      <ul class="cui-nav cui-layout-left">
        <li class="cui-nav-item">
          <a href="#"><i class="cui-icon">menu</i></a>
        </li>
      </ul>
      <ul class="cui-nav cui-layout-right">
        <li class="cui-nav-item">
          <a href="#">
            <i class="cui-icon">person</i> 관리자
          </a>
          <dl class="cui-nav-child">
            <dd><a href="#">내 정보</a></dd>
            <dd><a href="#">설정</a></dd>
            <dd><a href="#">로그아웃</a></dd>
          </dl>
        </li>
      </ul>
    </div>
    
    <!-- 사이드바 -->
    <div class="cui-side cui-bg-black">
      <div class="cui-side-scroll">
        <ul class="cui-nav cui-nav-tree">
          <li class="cui-nav-item cui-nav-itemed">
            <a href="javascript:;">
              <i class="cui-icon">dashboard</i> 대시보드
            </a>
            <dl class="cui-nav-child">
              <dd class="cui-this"><a href="#">통계</a></dd>
              <dd><a href="#">분석</a></dd>
            </dl>
          </li>
          <li class="cui-nav-item">
            <a href="javascript:;">
              <i class="cui-icon">people</i> 사용자 관리
            </a>
            <dl class="cui-nav-child">
              <dd><a href="#">사용자 목록</a></dd>
              <dd><a href="#">권한 설정</a></dd>
            </dl>
          </li>
          <li class="cui-nav-item">
            <a href="#">
              <i class="cui-icon">settings</i> 설정
            </a>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- 본문 -->
    <div class="cui-body">
      <div class="cui-main cui-p-15">
        <!-- 통계 카드 -->
        <div class="cui-row cui-col-space15">
          <div class="cui-col-md3 cui-col-sm6">
            <div class="cui-card">
              <div class="cui-card-body cui-bg-blue cui-text-center">
                <h2 class="cui-font-white">1,234</h2>
                <p class="cui-font-white">총 사용자</p>
              </div>
            </div>
          </div>
          <div class="cui-col-md3 cui-col-sm6">
            <div class="cui-card">
              <div class="cui-card-body cui-bg-green cui-text-center">
                <h2 class="cui-font-white">567</h2>
                <p class="cui-font-white">오늘 방문</p>
              </div>
            </div>
          </div>
          <div class="cui-col-md3 cui-col-sm6">
            <div class="cui-card">
              <div class="cui-card-body cui-bg-orange cui-text-center">
                <h2 class="cui-font-white">89</h2>
                <p class="cui-font-white">신규 주문</p>
              </div>
            </div>
          </div>
          <div class="cui-col-md3 cui-col-sm6">
            <div class="cui-card">
              <div class="cui-card-body cui-bg-red cui-text-center">
                <h2 class="cui-font-white">12</h2>
                <p class="cui-font-white">미처리 문의</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 테이블 카드 -->
        <div class="cui-card cui-mt-15">
          <div class="cui-card-header">
            <span>최근 주문</span>
            <span class="cui-badge cui-bg-blue cui-ml-10">NEW</span>
          </div>
          <div class="cui-card-body">
            <table class="cui-table" cui-filter="orderTable">
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>고객명</th>
                  <th>금액</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ORD-001</td>
                  <td>홍길동</td>
                  <td>50,000원</td>
                  <td><span class="cui-badge cui-bg-green">완료</span></td>
                </tr>
                <tr>
                  <td>ORD-002</td>
                  <td>김철수</td>
                  <td>35,000원</td>
                  <td><span class="cui-badge cui-bg-orange">배송중</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 푸터 -->
    <div class="cui-footer">
      © 2024 Catui Admin
    </div>
  </div>

  <script src="/dist/catui.js"></script>
</body>
</html>
```

### 로그인 페이지

```html
<body class="cui-bg-gray">
  <div class="cui-container" style="padding-top: 100px;">
    <div class="cui-row">
      <div class="cui-col-md4 cui-col-md-offset4 cui-col-sm6 cui-col-sm-offset3">
        <div class="cui-card">
          <div class="cui-card-header cui-text-center">
            <h3>로그인</h3>
          </div>
          <div class="cui-card-body" style="padding: 30px;">
            <form class="cui-form">
              <div class="cui-form-item">
                <label class="cui-form-label">아이디</label>
                <div class="cui-input-block">
                  <input type="text" name="username" class="cui-input" 
                         placeholder="아이디를 입력하세요" cui-verify="required">
                </div>
              </div>
              <div class="cui-form-item">
                <label class="cui-form-label">비밀번호</label>
                <div class="cui-input-block">
                  <input type="password" name="password" class="cui-input" 
                         placeholder="비밀번호를 입력하세요" cui-verify="required">
                </div>
              </div>
              <div class="cui-form-item">
                <div class="cui-input-block">
                  <input type="checkbox" cui-skin="primary" title="로그인 유지">
                </div>
              </div>
              <div class="cui-form-item">
                <div class="cui-input-block">
                  <button class="cui-btn cui-btn-primary cui-btn-fluid">로그인</button>
                </div>
              </div>
            </form>
            <div class="cui-text-center cui-mt-15">
              <a href="#" class="cui-font-gray">비밀번호 찾기</a>
              <span class="cui-font-gray"> | </span>
              <a href="#" class="cui-font-gray">회원가입</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
```

### 상품 목록 그리드

```html
<div class="cui-container cui-mt-20">
  <h2 class="cui-mb-15">상품 목록</h2>
  
  <div class="cui-row cui-col-space15">
    <!-- 상품 카드 반복 -->
    <div class="cui-col-lg3 cui-col-md4 cui-col-sm6 cui-col-xs12">
      <div class="cui-card">
        <img src="/img/product1.jpg" style="width: 100%; height: 200px; object-fit: cover;">
        <div class="cui-card-body">
          <h4 class="cui-elip">상품명이 길어지면 말줄임 처리</h4>
          <p class="cui-font-gray cui-font-12">카테고리</p>
          <div class="cui-flex cui-justify-between cui-align-center cui-mt-10">
            <span class="cui-font-red cui-font-18"><b>29,000원</b></span>
            <button class="cui-btn cui-btn-sm cui-btn-primary">
              <i class="cui-icon">shopping_cart</i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="cui-col-lg3 cui-col-md4 cui-col-sm6 cui-col-xs12">
      <div class="cui-card">
        <img src="/img/product2.jpg" style="width: 100%; height: 200px; object-fit: cover;">
        <div class="cui-card-body">
          <h4>상품 2</h4>
          <p class="cui-font-gray cui-font-12">카테고리</p>
          <div class="cui-flex cui-justify-between cui-align-center cui-mt-10">
            <span class="cui-font-red cui-font-18"><b>35,000원</b></span>
            <button class="cui-btn cui-btn-sm cui-btn-primary">
              <i class="cui-icon">shopping_cart</i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 더 많은 상품... -->
  </div>
</div>
```

### 검색 폼 레이아웃

```html
<div class="cui-card">
  <div class="cui-card-header">검색</div>
  <div class="cui-card-body">
    <form class="cui-form">
      <div class="cui-row cui-col-space10">
        <div class="cui-col-md3 cui-col-sm6">
          <div class="cui-form-item">
            <label class="cui-form-label">이름</label>
            <div class="cui-input-block">
              <input type="text" name="name" class="cui-input" placeholder="이름">
            </div>
          </div>
        </div>
        <div class="cui-col-md3 cui-col-sm6">
          <div class="cui-form-item">
            <label class="cui-form-label">이메일</label>
            <div class="cui-input-block">
              <input type="text" name="email" class="cui-input" placeholder="이메일">
            </div>
          </div>
        </div>
        <div class="cui-col-md3 cui-col-sm6">
          <div class="cui-form-item">
            <label class="cui-form-label">상태</label>
            <div class="cui-input-block">
              <select name="status" class="cui-select">
                <option value="">전체</option>
                <option value="1">활성</option>
                <option value="0">비활성</option>
              </select>
            </div>
          </div>
        </div>
        <div class="cui-col-md3 cui-col-sm6">
          <div class="cui-form-item">
            <label class="cui-form-label">&nbsp;</label>
            <div class="cui-input-block">
              <button class="cui-btn cui-btn-primary">
                <i class="cui-icon">search</i> 검색
              </button>
              <button type="reset" class="cui-btn">초기화</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
```

### 프로필 카드

```html
<div class="cui-row cui-col-space20">
  <div class="cui-col-md4">
    <div class="cui-card">
      <div class="cui-card-body cui-text-center" style="padding: 30px;">
        <img src="/img/avatar.jpg" class="cui-circle" 
             style="width: 100px; height: 100px; object-fit: cover;">
        <h3 class="cui-mt-15">홍길동</h3>
        <p class="cui-font-gray">프론트엔드 개발자</p>
        <div class="cui-flex cui-justify-center cui-gap-10 cui-mt-15">
          <span class="cui-badge cui-bg-blue">JavaScript</span>
          <span class="cui-badge cui-bg-green">Vue.js</span>
          <span class="cui-badge cui-bg-orange">React</span>
        </div>
        <div class="cui-mt-20">
          <button class="cui-btn cui-btn-primary cui-btn-sm">
            <i class="cui-icon">mail</i> 메시지
          </button>
          <button class="cui-btn cui-btn-sm">
            <i class="cui-icon">person_add</i> 팔로우
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="cui-col-md8">
    <div class="cui-card">
      <div class="cui-card-header">소개</div>
      <div class="cui-card-body">
        <div class="cui-text">
          <p>안녕하세요, 5년차 프론트엔드 개발자입니다.</p>
          <p>JavaScript와 다양한 프레임워크를 활용한 웹 개발을 전문으로 합니다.</p>
          <ul>
            <li>반응형 웹 개발</li>
            <li>SPA 애플리케이션 개발</li>
            <li>UI/UX 최적화</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 미디어 리스트

```html
<div class="cui-card">
  <div class="cui-card-header">최근 게시물</div>
  <div class="cui-card-body cui-p-0">
    <!-- 아이템 -->
    <div class="cui-flex cui-p-15" style="border-bottom: 1px solid #eee;">
      <img src="/img/thumb1.jpg" style="width: 120px; height: 80px; object-fit: cover; border-radius: 4px;">
      <div class="cui-flex-1 cui-ml-15">
        <h4 class="cui-elip">게시물 제목이 여기에 표시됩니다</h4>
        <p class="cui-font-gray cui-font-12 cui-mt-5 cui-elip">
          게시물 내용 미리보기가 여기에 표시됩니다...
        </p>
        <div class="cui-flex cui-justify-between cui-align-center cui-mt-10">
          <span class="cui-font-gray cui-font-12">2024-01-15</span>
          <span class="cui-font-gray cui-font-12">
            <i class="cui-icon" style="font-size: 14px;">visibility</i> 1,234
          </span>
        </div>
      </div>
    </div>
    
    <!-- 더 많은 아이템... -->
    <div class="cui-flex cui-p-15">
      <img src="/img/thumb2.jpg" style="width: 120px; height: 80px; object-fit: cover; border-radius: 4px;">
      <div class="cui-flex-1 cui-ml-15">
        <h4 class="cui-elip">두 번째 게시물</h4>
        <p class="cui-font-gray cui-font-12 cui-mt-5 cui-elip">
          두 번째 게시물 내용...
        </p>
        <div class="cui-flex cui-justify-between cui-align-center cui-mt-10">
          <span class="cui-font-gray cui-font-12">2024-01-14</span>
          <span class="cui-font-gray cui-font-12">
            <i class="cui-icon" style="font-size: 14px;">visibility</i> 987
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
```
