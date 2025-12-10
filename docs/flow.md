# Flow 모듈

무한 스크롤(플로우 로딩)을 제공하는 모듈입니다.

## 기본 사용법

```html
<ul id="list"></ul>

<script>
Catui.use(['flow'], function(){
  flow.load({
    elem: '#list',
    done: function(page, next){
      $.get('/api/list', { page: page }, function(res){
        var html = '';
        res.data.forEach(function(item){
          html += '<li>' + item.title + '</li>';
        });
        next(html, page < res.pages);
      });
    }
  });
});
</script>
```

---

## API 목록

| API | 설명 |
|-----|------|
| `load(options)` | 플로우 로딩 |
| `lazyimg(options)` | 이미지 지연 로딩 |

---

## load(options)

무한 스크롤을 설정합니다.

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `elem` | String/DOM | - | 대상 요소 (필수) |
| `scrollElem` | String/DOM | - | 스크롤 컨테이너 |
| `isAuto` | Boolean | true | 자동 로딩 |
| `end` | String | '더 이상 데이터가 없습니다' | 완료 메시지 |
| `isLazyimg` | Boolean | false | 이미지 지연 로딩 |
| `mb` | Number | 50 | 하단 여백 트리거 (px) |

### 콜백

| 콜백 | 설명 |
|------|------|
| `done(page, next)` | 데이터 로딩 |

---

## done 콜백

```javascript
flow.load({
  elem: '#list',
  done: function(page, next){
    // page: 현재 페이지 (1부터 시작)
    // next(html, hasMore): 로딩 완료 후 호출
    
    $.get('/api/list', { page: page, size: 10 }, function(res){
      var html = '';
      res.data.forEach(function(item){
        html += '<div class="item">' + item.title + '</div>';
      });
      
      // next(추가할 HTML, 더 있는지 여부)
      next(html, page < res.totalPages);
    });
  }
});
```

---

## lazyimg(options)

이미지 지연 로딩을 설정합니다.

```html
<img cui-src="/img/photo.jpg" src="/img/placeholder.gif">

<script>
flow.lazyimg({
  elem: 'img[cui-src]',
  scrollElem: '#container'  // 스크롤 컨테이너 (선택)
});
</script>
```

---

## 완전한 예시

### 게시글 무한 스크롤

```html
<div id="postContainer">
  <div id="postList"></div>
</div>

<script>
Catui.use(['flow'], function(){
  flow.load({
    elem: '#postList',
    scrollElem: '#postContainer',
    done: function(page, next){
      $.get('/api/posts', { page: page, size: 20 }, function(res){
        var html = '';
        
        if(res.data.length === 0 && page === 1){
          html = '<div class="empty">게시글이 없습니다.</div>';
          next(html, false);
          return;
        }
        
        res.data.forEach(function(post){
          html += '<div class="post-item">'
            + '<h3>' + post.title + '</h3>'
            + '<p>' + post.summary + '</p>'
            + '<span class="date">' + post.date + '</span>'
            + '</div>';
        });
        
        next(html, page < res.totalPages);
      });
    }
  });
});
</script>
```

### 이미지 갤러리

```html
<div id="gallery"></div>

<script>
Catui.use(['flow'], function(){
  flow.load({
    elem: '#gallery',
    isLazyimg: true,
    done: function(page, next){
      $.get('/api/images', { page: page }, function(res){
        var html = '';
        res.data.forEach(function(img){
          html += '<div class="gallery-item">'
            + '<img cui-src="' + img.url + '" src="/img/loading.gif">'
            + '</div>';
        });
        next(html, page < res.totalPages);
      });
    }
  });
});
</script>
```
