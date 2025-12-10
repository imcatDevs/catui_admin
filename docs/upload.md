# Upload 모듈

파일 업로드 기능을 제공하는 모듈입니다.

## 기본 사용법

```html
<button type="button" class="cui-btn" id="uploadBtn">
  <i class="cui-icon">upload</i> 파일 업로드
</button>

<script>
Catui.use(['upload'], function(){
  upload.render({
    elem: '#uploadBtn',
    url: '/api/upload',
    done: function(res){
      console.log('업로드 완료:', res);
    }
  });
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `render(options)` | 업로드 렌더링 |

---

## render(options)

업로드를 렌더링합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `url` | String | - | 업로드 URL (필수) |
| `data` | Object | {} | 추가 데이터 |
| `headers` | Object | {} | 요청 헤더 |
| `accept` | String | 'images' | 파일 타입 |
| `acceptMime` | String | - | MIME 타입 |
| `exts` | String | - | 허용 확장자 |
| `auto` | Boolean | true | 자동 업로드 |
| `bindAction` | String/DOM | - | 수동 업로드 버튼 |
| `field` | String | 'file' | 파일 필드명 |
| `size` | Number | 0 | 최대 크기 (KB) |
| `multiple` | Boolean | false | 다중 선택 |
| `number` | Number | 0 | 최대 파일 수 |
| `drag` | Boolean | true | 드래그 업로드 |

### 콜백

| 콜백 | 설명 |
|------|------|
| `choose(obj)` | 파일 선택 시 |
| `before(obj)` | 업로드 전 |
| `done(res, index, upload)` | 업로드 완료 |
| `error(index, upload)` | 업로드 실패 |
| `progress(n, elem, res, index)` | 업로드 진행 |
| `allDone(obj)` | 전체 완료 |

---

## 파일 타입 (accept)

| 값 | 설명 |
|----|------|
| `images` | 이미지 (기본) |
| `file` | 모든 파일 |
| `video` | 비디오 |
| `audio` | 오디오 |

### 이미지 업로드

```javascript
upload.render({
  elem: '#uploadBtn',
  url: '/api/upload',
  accept: 'images',
  acceptMime: 'image/*',
  exts: 'jpg|png|gif|bmp',
  size: 2048,  // 2MB
  done: function(res){
    if(res.code === 0){
      $('#preview').attr('src', res.url);
    }
  }
});
```

### 파일 업로드

```javascript
upload.render({
  elem: '#uploadBtn',
  url: '/api/upload',
  accept: 'file',
  exts: 'pdf|doc|docx|xls|xlsx',
  size: 10240,  // 10MB
  done: function(res){
    console.log(res);
  }
});
```

---

## 다중 업로드

```javascript
upload.render({
  elem: '#uploadBtn',
  url: '/api/upload',
  multiple: true,
  number: 5,  // 최대 5개
  done: function(res, index, upload){
    console.log('파일 ' + (index + 1) + ' 완료');
  },
  allDone: function(obj){
    console.log('전체 완료');
    console.log('성공:', obj.successful);
    console.log('실패:', obj.failed);
  }
});
```

---

## 드래그 업로드

```html
<div class="cui-upload-drag" id="uploadDrag">
  <i class="cui-icon" style="font-size: 50px; color: #ccc;">cloud_upload</i>
  <p>파일을 여기에 끌어다 놓거나 클릭하여 선택</p>
</div>

<script>
upload.render({
  elem: '#uploadDrag',
  url: '/api/upload',
  drag: true,
  done: function(res){
    popup.msg('업로드 완료!');
  }
});
</script>
```

---

## 수동 업로드

자동 업로드를 비활성화하고 버튼으로 업로드합니다.

```html
<button type="button" class="cui-btn" id="selectFile">파일 선택</button>
<button type="button" class="cui-btn cui-btn-primary" id="doUpload">업로드</button>
<div id="fileList"></div>

<script>
upload.render({
  elem: '#selectFile',
  url: '/api/upload',
  auto: false,
  bindAction: '#doUpload',
  choose: function(obj){
    // 선택된 파일 목록 표시
    var files = this.files = obj.pushFile();
    var html = '';
    
    obj.preview(function(index, file, result){
      html += '<p>' + file.name + ' <a data-index="' + index + '" href="javascript:;">삭제</a></p>';
    });
    
    $('#fileList').html(html);
    
    // 삭제 처리
    $('#fileList').find('a').on('click', function(){
      delete files[$(this).data('index')];
      $(this).parent().remove();
    });
  },
  done: function(res){
    popup.msg('업로드 완료!');
  }
});
</script>
```

---

## 이미지 미리보기

```html
<div class="cui-upload">
  <button type="button" class="cui-btn" id="uploadImg">이미지 선택</button>
  <div class="cui-upload-list">
    <img id="preview" src="" style="max-width: 200px; display: none;">
  </div>
</div>

<script>
upload.render({
  elem: '#uploadImg',
  url: '/api/upload',
  accept: 'images',
  before: function(obj){
    // 업로드 전 미리보기
    obj.preview(function(index, file, result){
      $('#preview').attr('src', result).show();
    });
  },
  done: function(res){
    if(res.code === 0){
      popup.msg('업로드 완료!');
    } else {
      popup.msg(res.msg);
    }
  },
  error: function(){
    popup.msg('업로드 실패!');
  }
});
</script>
```

---

## 업로드 진행률

```html
<div class="cui-progress" id="uploadProgress" style="display: none;">
  <div class="cui-progress-bar" cui-percent="0%"></div>
</div>

<script>
upload.render({
  elem: '#uploadBtn',
  url: '/api/upload',
  before: function(obj){
    $('#uploadProgress').show();
    element.progress('uploadProgress', '0%');
  },
  progress: function(n, elem, res, index){
    element.progress('uploadProgress', n + '%');
  },
  done: function(res){
    element.progress('uploadProgress', '100%');
    setTimeout(function(){
      $('#uploadProgress').hide();
    }, 500);
  }
});
</script>
```

---

## 추가 데이터

```javascript
upload.render({
  elem: '#uploadBtn',
  url: '/api/upload',
  data: {
    category: 'avatar',
    userId: 123
  },
  headers: {
    'Authorization': 'Bearer ' + token
  },
  done: function(res){
    console.log(res);
  }
});
```

---

## 유효성 검사

```javascript
upload.render({
  elem: '#uploadBtn',
  url: '/api/upload',
  accept: 'images',
  exts: 'jpg|png',
  size: 1024,  // 1MB
  before: function(obj){
    // 추가 검사
    var files = obj.pushFile();
    for(var key in files){
      if(files[key].size > 1024 * 1024){
        popup.msg('파일 크기는 1MB 이하여야 합니다.');
        delete files[key];
        return false;
      }
    }
  },
  error: function(index, upload){
    popup.msg('업로드 실패!');
  }
});
```

---

## 완전한 예시

```html
<div class="cui-form-item">
  <label class="cui-form-label">프로필 사진</label>
  <div class="cui-input-block">
    <div class="cui-upload">
      <button type="button" class="cui-btn" id="avatarBtn">
        <i class="cui-icon">add_photo_alternate</i> 사진 선택
      </button>
      <div class="cui-upload-list" id="avatarList"></div>
    </div>
  </div>
</div>

<script>
Catui.use(['upload', 'popup'], function(){
  upload.render({
    elem: '#avatarBtn',
    url: '/api/upload/avatar',
    accept: 'images',
    acceptMime: 'image/jpeg,image/png',
    exts: 'jpg|jpeg|png',
    size: 2048,
    before: function(obj){
      popup.load();
      
      obj.preview(function(index, file, result){
        $('#avatarList').html('<img src="' + result + '" style="max-width:150px;max-height:150px;border-radius:50%;">');
      });
    },
    done: function(res){
      popup.closeAll('loading');
      
      if(res.code === 0){
        popup.msg('업로드 완료!', { icon: 1 });
        $('input[name="avatar"]').val(res.url);
      } else {
        popup.msg(res.msg, { icon: 2 });
      }
    },
    error: function(){
      popup.closeAll('loading');
      popup.msg('업로드 실패!', { icon: 2 });
    }
  });
});
</script>
```
