# Date 모듈

날짜 및 시간 선택기를 제공하는 모듈입니다.

## 기본 사용법

```html
<input type="text" id="date1" placeholder="날짜 선택">

<script>
Catui.use(['date'], function(){
  date.render({
    elem: '#date1'
  });
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `render(options)` | 날짜 선택기 렌더링 |
| `getInst(id)` | 인스턴스 가져오기 |
| `closeAll()` | 모든 날짜 선택기 닫기 |

---

## render(options)

날짜 선택기를 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `type` | String | 'date' | 선택 타입 |
| `format` | String | 'yyyy-MM-dd' | 날짜 형식 |
| `value` | String/Date | - | 초기값 |
| `min` | String | '1900-1-1' | 최소 날짜 |
| `max` | String | '2099-12-31' | 최대 날짜 |
| `range` | Boolean/String | false | 범위 선택 |
| `trigger` | String | 'click' | 트리거 이벤트 |
| `show` | Boolean | false | 기본 표시 |
| `position` | String | - | 위치 (fixed) |
| `zIndex` | Number | 66666666 | z-index |
| `showBottom` | Boolean | true | 하단 바 표시 |
| `btns` | Array | ['clear','now','confirm'] | 버튼 |
| `lang` | String | 'ko' | 언어 |
| `theme` | String | 'default' | 테마 |
| `calendar` | Boolean | false | 공휴일 표시 |
| `mark` | Object | {} | 날짜 마킹 |

### 콜백

| 콜백 | 설명 |
|------|------|
| `done(value, date, endDate)` | 선택 완료 |
| `change(value, date, endDate)` | 값 변경 |
| `ready(date)` | 렌더링 완료 |

---

## 선택 타입 (type)

| 타입 | 설명 | 기본 형식 |
|------|------|----------|
| `year` | 년도 선택 | yyyy |
| `month` | 월 선택 | yyyy-MM |
| `date` | 날짜 선택 | yyyy-MM-dd |
| `time` | 시간 선택 | HH:mm:ss |
| `datetime` | 날짜+시간 | yyyy-MM-dd HH:mm:ss |

### 타입별 예시

```javascript
// 년도 선택
date.render({
  elem: '#year',
  type: 'year'
});

// 월 선택
date.render({
  elem: '#month',
  type: 'month'
});

// 날짜 선택 (기본)
date.render({
  elem: '#date',
  type: 'date'
});

// 시간 선택
date.render({
  elem: '#time',
  type: 'time'
});

// 날짜+시간 선택
date.render({
  elem: '#datetime',
  type: 'datetime'
});
```

---

## 날짜 형식 (format)

| 형식 | 설명 | 예시 |
|------|------|------|
| `yyyy` | 4자리 연도 | 2024 |
| `yy` | 2자리 연도 | 24 |
| `MM` | 2자리 월 | 01~12 |
| `M` | 1~2자리 월 | 1~12 |
| `dd` | 2자리 일 | 01~31 |
| `d` | 1~2자리 일 | 1~31 |
| `HH` | 24시간 | 00~23 |
| `H` | 24시간 | 0~23 |
| `hh` | 12시간 | 01~12 |
| `h` | 12시간 | 1~12 |
| `mm` | 분 | 00~59 |
| `m` | 분 | 0~59 |
| `ss` | 초 | 00~59 |
| `s` | 초 | 0~59 |

### 형식 예시

```javascript
date.render({
  elem: '#date',
  format: 'yyyy년 MM월 dd일'
});

date.render({
  elem: '#datetime',
  type: 'datetime',
  format: 'yyyy-MM-dd HH:mm'
});
```

---

## 범위 선택 (range)

```javascript
// 기본 범위 선택 (~ 구분)
date.render({
  elem: '#dateRange',
  range: true
});

// 커스텀 구분자
date.render({
  elem: '#dateRange',
  range: ' 부터 '
});

// 날짜+시간 범위
date.render({
  elem: '#datetimeRange',
  type: 'datetime',
  range: true
});
```

---

## 초기값 설정 (value)

```javascript
// 문자열
date.render({
  elem: '#date',
  value: '2024-01-15'
});

// Date 객체
date.render({
  elem: '#date',
  value: new Date()
});

// 범위 초기값
date.render({
  elem: '#dateRange',
  range: true,
  value: '2024-01-01 ~ 2024-01-31'
});
```

---

## 최소/최대 날짜 제한

```javascript
// 문자열
date.render({
  elem: '#date',
  min: '2024-01-01',
  max: '2024-12-31'
});

// 상대값
date.render({
  elem: '#date',
  min: -7,   // 7일 전부터
  max: 30    // 30일 후까지
});

// 오늘부터
date.render({
  elem: '#date',
  min: 0
});

// 동적 제한
date.render({
  elem: '#endDate',
  min: function(){
    return $('#startDate').val();
  }
});
```

---

## 테마 (theme)

```javascript
// 기본 제공 테마
date.render({
  elem: '#date',
  theme: 'default'  // 또는 'molv', 'grid', 'circle'
});

// 커스텀 색상
date.render({
  elem: '#date',
  theme: '#1677ff'  // 16진수 색상
});
```

---

## 날짜 마킹 (mark)

```javascript
date.render({
  elem: '#date',
  mark: {
    '0-1-1': '신정',
    '0-3-1': '삼일절',
    '0-5-5': '어린이날',
    '0-8-15': '광복절',
    '0-10-3': '개천절',
    '0-12-25': '성탄절',
    '2024-2-9': '설날',
    '2024-2-10': '설날',
    '2024-9-16': '추석',
    '2024-9-17': '추석'
  }
});
```

---

## 콜백예시

### done - 선택 완료

```javascript
date.render({
  elem: '#date',
  done: function(value, date, endDate){
    console.log(value);    // '2024-01-15'
    console.log(date);     // { year: 2024, month: 1, date: 15, ... }
    console.log(endDate);  // 범위 선택 시 종료일 정보
  }
});
```

### change - 값 변경

```javascript
date.render({
  elem: '#date',
  change: function(value, date, endDate){
    // 값이 변경될 때마다 호출
    console.log('변경:', value);
  }
});
```

### ready - 렌더링 완료

```javascript
date.render({
  elem: '#date',
  ready: function(date){
    console.log('렌더링 완료');
  }
});
```

---

## 버튼 설정 (btns)

```javascript
// 버튼 순서 변경
date.render({
  elem: '#date',
  btns: ['confirm', 'now', 'clear']
});

// 일부 버튼만 표시
date.render({
  elem: '#date',
  btns: ['confirm']
});

// 하단 바 숨기기
date.render({
  elem: '#date',
  showBottom: false
});
```

---

## 인라인 (show)

날짜 선택기를 항상 표시합니다.

```html
<div id="inlineDate"></div>

<script>
date.render({
  elem: '#inlineDate',
  show: true,
  position: 'static',
  done: function(value){
    console.log(value);
  }
});
</script>
```

---

## 연동 예시

### 시작일-종료일 연동

```javascript
var startDate = date.render({
  elem: '#startDate',
  done: function(value){
    endDate.config.min = value;
  }
});

var endDate = date.render({
  elem: '#endDate',
  done: function(value){
    startDate.config.max = value;
  }
});
```

### 생년월일 (나이 제한)

```javascript
var today = new Date();
var minYear = today.getFullYear() - 100;
var maxYear = today.getFullYear() - 18;

date.render({
  elem: '#birthday',
  max: maxYear + '-12-31',  // 18세 이상
  min: minYear + '-1-1',    // 100세 이하
  value: maxYear + '-01-01'
});
```

---

## 완전한 예시

```html
<div class="cui-form">
  <div class="cui-form-item">
    <label class="cui-form-label">날짜 선택</label>
    <div class="cui-input-block">
      <input type="text" id="date1" class="cui-input" placeholder="날짜 선택">
    </div>
  </div>
  
  <div class="cui-form-item">
    <label class="cui-form-label">기간 선택</label>
    <div class="cui-input-block">
      <input type="text" id="dateRange" class="cui-input" placeholder="시작일 ~ 종료일">
    </div>
  </div>
  
  <div class="cui-form-item">
    <label class="cui-form-label">예약 시간</label>
    <div class="cui-input-block">
      <input type="text" id="datetime1" class="cui-input" placeholder="날짜 및 시간 선택">
    </div>
  </div>
</div>

<script>
Catui.use(['date'], function(){
  // 날짜 선택
  date.render({
    elem: '#date1',
    theme: '#1677ff',
    done: function(value){
      console.log('선택:', value);
    }
  });
  
  // 기간 선택
  date.render({
    elem: '#dateRange',
    range: true,
    min: 0,  // 오늘부터
    done: function(value){
      var dates = value.split(' ~ ');
      console.log('시작:', dates[0]);
      console.log('종료:', dates[1]);
    }
  });
  
  // 날짜+시간
  date.render({
    elem: '#datetime1',
    type: 'datetime',
    min: 0,
    format: 'yyyy-MM-dd HH:mm',
    done: function(value){
      console.log('예약 시간:', value);
    }
  });
});
</script>
```
