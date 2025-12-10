# Editor 모듈

간단한 리치 텍스트 에디터를 제공하는 모듈입니다.

## 기본 사용법

```html
<textarea id="editor"></textarea>

<script>
Catui.use(['editor'], function(){
  editor.render({
    elem: '#editor'
  });
});
</script>
```

---

## render(options)

에디터를 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `height` | Number | 300 | 높이 |
| `uploadImage` | Object | - | 이미지 업로드 설정 |
| `tool` | Array | - | 툴바 버튼 |
| `hideTool` | Array | [] | 숨길 툴바 버튼 |

### 콜백

| 콜백 | 설명 |
|------|------|
| `done(content)` | 내용 변경 시 |

---

## 툴바 버튼

기본 툴바:

| 버튼 | 설명 |
|------|------|
| `bold` | 굵게 |
| `italic` | 기울임 |
| `underline` | 밑줄 |
| `del` | 취소선 |
| `\|` | 구분자 |
| `left` | 왼쪽 정렬 |
| `center` | 가운데 정렬 |
| `right` | 오른쪽 정렬 |
| `link` | 링크 |
| `unlink` | 링크 제거 |
| `face` | 이모티콘 |
| `image` | 이미지 |
| `help` | 도움말 |

### 커스텀 툴바

```javascript
editor.render({
  elem: '#editor',
  tool: ['bold', 'italic', 'underline', '|', 'left', 'center', 'right', '|', 'link', 'image']
});
```

### 툴바 숨기기

```javascript
editor.render({
  elem: '#editor',
  hideTool: ['face', 'help']
});
```

---

## 이미지 업로드

```javascript
editor.render({
  elem: '#editor',
  uploadImage: {
    url: '/api/upload',
    type: 'post'
  }
});
```

---

## 값 가져오기/설정

```javascript
var editorInst = editor.render({
  elem: '#editor'
});

// 값 가져오기
var content = editorInst.getContent();

// 값 설정
editorInst.setContent('<p>새 내용</p>');

// 텍스트만 가져오기
var text = editorInst.getText();
```

---

## 완전한 예시

```html
<form class="cui-form" cui-filter="articleForm">
  <div class="cui-form-item">
    <label class="cui-form-label">제목</label>
    <div class="cui-input-block">
      <input type="text" name="title" class="cui-input" cui-verify="required">
    </div>
  </div>
  
  <div class="cui-form-item">
    <label class="cui-form-label">내용</label>
    <div class="cui-input-block">
      <textarea id="articleContent" name="content" cui-verify="required"></textarea>
    </div>
  </div>
  
  <div class="cui-form-item">
    <button class="cui-btn cui-btn-primary" cui-submit cui-filter="submit">저장</button>
  </div>
</form>

<script>
Catui.use(['editor', 'form', 'popup'], function(){
  // 에디터 초기화
  var articleEditor = editor.render({
    elem: '#articleContent',
    height: 400,
    uploadImage: {
      url: '/api/upload/image',
      type: 'post'
    }
  });
  
  // 폼 제출
  form.on('submit(submit)', function(data){
    // 에디터 내용 추가
    data.field.content = articleEditor.getContent();
    
    $.post('/api/article/save', data.field, function(res){
      if(res.code === 0){
        popup.msg('저장되었습니다.');
      }
    });
    
    return false;
  });
});
</script>
```

---

## 주의사항

1. 에디터 내용은 HTML 형식으로 저장됩니다.
2. 서버에서 XSS 필터링을 반드시 적용하세요.
3. 이미지 업로드 시 파일 크기/타입 검증을 하세요.
