/*!
 * Catui form - 폼 컴포넌트
 * Based on form.js, jQuery-free
 * MIT Licensed
 */

!function(window, undefined){
  "use strict";

  var document = window.document
  ,MOD_NAME = 'form'
  
  // $c 동적 참조
  ,get$c = function(){ return window.$c; }

  // 상수
  ,ELEM = '.cui-form'
  ,_THIS = 'cui-this'
  ,_SHOW = 'cui-show'
  ,_HIDE = 'cui-hide'
  ,_DISABLED = 'cui-disabled'

  // Form 생성자
  ,Form = function(){
    this.config = {
      verify: {
        required: [
          /[\S]+/
          ,'필수 항목입니다.'
        ]
        ,phone: [
          /^01[0-9]{8,9}$/
          ,'올바른 휴대폰 번호를 입력하세요.'
        ]
        ,email: [
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
          ,'올바른 이메일 형식이 아닙니다.'
        ]
        ,url: [
          /^(#|(http(s?)):\/\/|\/\/)[^\s]+\.[^\s]+$/
          ,'올바른 URL 형식이 아닙니다.'
        ]
        ,number: function(value){
          if(!value || isNaN(value)) return '숫자만 입력할 수 있습니다.';
        }
        ,pass: [
          /^[\S]{6,12}$/
          ,'비밀번호는 6~12자로 입력하세요.'
        ]
        ,date: [
          /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/
          ,'날짜 형식이 올바르지 않습니다.'
        ]
        ,identity: [
          /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
          ,'올바른 주민등록번호를 입력하세요.'
        ]
      }
      ,autocomplete: null
    };
  };

  // 전역 설정
  Form.prototype.set = function(options){
    var that = this;
    get$c().extend(true, that.config, options);
    return that;
  };

  // 검증 규칙 설정
  Form.prototype.verify = function(settings){
    var that = this;
    get$c().extend(true, that.config.verify, settings);
    return that;
  };

  // 이벤트 등록
  Form.prototype.on = function(events, callback){
    if(window.Catui && Catui.onevent){
      return Catui.onevent.call(this, MOD_NAME, events, callback);
    }
    return this;
  };

  // 폼 값 설정/가져오기
  Form.prototype.val = function(filter, object){
    var that = this
    ,formElem = get$c()(ELEM + '[cui-filter="' + filter + '"]');

    if(!formElem[0]) return {};

    // 값 설정
    if(object){
      for(var key in object){
        var itemElem = formElem.find('[name="' + key + '"]');
        if(!itemElem[0]) continue;

        var type = itemElem[0].type;

        if(type === 'checkbox'){
          itemElem[0].checked = !!object[key];
        } else if(type === 'radio'){
          itemElem.each(function(i, elem){
            if(elem.value === object[key]){
              elem.checked = true;
            }
          });
        } else {
          itemElem.val(object[key]);
        }
      }
      that.render(null, filter);
    }

    return that.getValue(filter, formElem);
  };

  // 폼 값 가져오기
  Form.prototype.getValue = function(filter, itemForm){
    itemForm = itemForm || get$c()(ELEM + '[cui-filter="' + filter + '"]').eq(0);

    var field = {}
    ,fieldElem = itemForm.find('input,select,textarea');

    fieldElem.each(function(i, item){
      if(!item.name) return;

      // 체크박스, 라디오 미선택 시 스킵
      if(/^checkbox|radio$/.test(item.type) && !item.checked) return;

      field[item.name] = item.value;
    });

    return field;
  };

  // 폼 렌더링
  // filter가 문자열이면 cui-filter로 검색, DOM 요소면 해당 요소 내에서 검색
  Form.prototype.render = function(type, filter){
    var that = this
    ,$c = get$c();
    
    // $c가 없으면 대기 후 재시도
    if(!$c){
      setTimeout(function(){ that.render(type, filter); }, 50);
      return that;
    }
    
    // 이벤트 바인딩 확인 (render 호출 시마다 체크)
    bindFormSubmit($c);
    
    var elemForm;
    if(filter && typeof filter === 'object' && filter.nodeType){
      // DOM 요소가 전달된 경우
      elemForm = $c(filter);
    } else if(filter && typeof filter === 'string'){
      // filter 문자열
      elemForm = $c(ELEM + '[cui-filter="' + filter + '"]');
    } else {
      // 전체
      elemForm = $c(ELEM);
    }
    
    // 요소가 없으면 body에서 검색 (테이블 등 cui-form 클래스가 없는 경우)
    if(!elemForm[0] && filter && typeof filter === 'object'){
      elemForm = $c(filter);
    }

    var items = {
      // 스위치 렌더링 (cui-skin="switch") - 체크박스보다 먼저 실행
      switch: function(){
        elemForm.find('input[type="checkbox"][cui-skin="switch"]').each(function(i, item){
          if(item.getAttribute('cui-rendered')) return;
          item.setAttribute('cui-rendered', 'true');

          var disabled = item.disabled ? ' cui-disabled' : '';
          var switchText = item.getAttribute('cui-text') || '';
          var texts = switchText.split('|');
          
          // 기존 렌더링된 요소 제거
          var hasRender = item.nextElementSibling;
          if(hasRender && hasRender.classList.contains('cui-form-switch')){
            hasRender.remove();
          }

          // 원본 input 숨기기
          item.style.display = 'none';
          
          var wrap = document.createElement('div');
          wrap.className = 'cui-form-switch' + disabled + (item.checked ? ' cui-form-checked' : '');
          
          // 스위치 스타일: <em>텍스트</em><i></i>
          wrap.innerHTML = '<em>' + ((item.checked ? texts[0] : texts[1]) || '') + '</em><i></i>';

          item.parentNode.insertBefore(wrap, item.nextSibling);

          wrap.addEventListener('click', function(e){
            if(item.disabled) return;
            item.checked = !item.checked;
            wrap.classList.toggle('cui-form-checked', item.checked);
            
            var emText = wrap.querySelector('em');
            if(emText){
              emText.textContent = (item.checked ? texts[0] : texts[1]) || '';
            }

            triggerEvent('switch', item.name || item.getAttribute('cui-filter'), {
              elem: item
              ,value: item.value
              ,checked: item.checked
            });
          });
        });
      }

      // 체크박스 렌더링 (스위치 제외)
      ,checkbox: function(){
        elemForm.find('input[type="checkbox"]').each(function(i, item){
          // 이미 렌더링되었거나 스위치인 경우 스킵
          if(item.getAttribute('cui-skin') === 'switch') return;
          if(typeof item.getAttribute('cui-ignore') === 'string') return;
          if(item.getAttribute('cui-rendered') === 'checkbox') return;
          
          var hasRender = item.nextElementSibling;
          if(hasRender && hasRender.classList.contains('cui-form-checkbox')){
            return; // 이미 렌더링됨
          }
          
          item.setAttribute('cui-rendered', 'checkbox');

          var skin = item.getAttribute('cui-skin') || '';
          var title = item.title || '';
          var disabled = item.disabled ? ' cui-checkbox-disabled cui-disabled' : '';

          // 다음 텍스트 노드에서 라벨 텍스트 가져오기
          var textNode = item.nextSibling;
          var labelText = title;
          if(!labelText && textNode && textNode.nodeType === 3){
            labelText = textNode.textContent.trim();
            textNode.textContent = '';
          }

          // 대체 요소 생성 (기본 스타일 = Primary 스타일)
          var reElem = document.createElement('div');
          reElem.className = 'cui-unselect cui-form-checkbox cui-form-checkbox-primary' 
            + (item.checked ? ' cui-form-checked' : '')
            + disabled;
          
          // Primary 스타일 (기본)
          reElem.innerHTML = '<i class="cui-icon">' + (item.checked ? 'check' : '') + '</i>'
            + (labelText ? '<span>' + labelText + '</span>' : '');

          // input 뒤에 삽입
          item.after(reElem);

          // 클릭 이벤트
          reElem.addEventListener('click', function(){
            if(item.disabled) return;
            
            item.checked = !item.checked;
            reElem.classList.toggle('cui-form-checked', item.checked);
            
            var icon = reElem.querySelector('.cui-icon');
            icon.textContent = item.checked ? 'check' : '';

            triggerEvent('checkbox', item.name || item.getAttribute('cui-filter'), {
              elem: item
              ,value: item.value
              ,checked: item.checked
            });
          });
        });
      }

      // 라디오 렌더링
      ,radio: function(){
        elemForm.find('input[type="radio"]').each(function(i, item){
          if(typeof item.getAttribute('cui-ignore') === 'string') return;
          if(item.getAttribute('cui-rendered') === 'radio') return;
          
          var hasRender = item.nextElementSibling;
          if(hasRender && hasRender.classList.contains('cui-form-radio')){
            return; // 이미 렌더링됨
          }
          
          item.setAttribute('cui-rendered', 'radio');

          var disabled = item.disabled ? ' cui-radio-disabled cui-disabled' : '';

          // 다음 텍스트 노드에서 라벨 텍스트 가져오기
          var textNode = item.nextSibling;
          var labelText = item.title || '';
          if(!labelText && textNode && textNode.nodeType === 3){
            labelText = textNode.textContent.trim();
            textNode.textContent = '';
          }

          // 대체 요소 생성
          var reElem = document.createElement('div');
          reElem.className = 'cui-unselect cui-form-radio'
            + (item.checked ? ' cui-form-checked' : '')
            + disabled;
          
          reElem.innerHTML = '<i class="cui-icon">' + (item.checked ? 'radio_button_checked' : 'radio_button_unchecked') + '</i>'
            + '<span>' + labelText + '</span>';

          // input 뒤에 삽입
          item.after(reElem);

          // 클릭 이벤트
          reElem.addEventListener('click', function(){
            if(item.disabled) return;

            // 같은 이름의 라디오 초기화
            var name = item.name;
            var form = item.closest(ELEM) || document;
            var sameRadios = form.querySelectorAll('input[name="' + name + '"]');
            
            sameRadios.forEach(function(radio){
              var next = radio.nextElementSibling;
              if(next && next.classList.contains('cui-form-radio')){
                radio.checked = false;
                next.classList.remove('cui-form-checked');
                next.querySelector('.cui-icon').textContent = 'radio_button_unchecked';
              }
            });

            item.checked = true;
            reElem.classList.add('cui-form-checked');
            reElem.querySelector('.cui-icon').textContent = 'radio_button_checked';

            triggerEvent('radio', item.name || item.getAttribute('cui-filter'), {
              elem: item
              ,value: item.value
            });
          });
        });
      }

      // select 렌더링 (기본 HTML select 사용)
      ,select: function(){
        elemForm.find('select').each(function(i, item){
          if(item.getAttribute('cui-rendered')) return;
          if(item.getAttribute('cui-ignore') !== null) return; // cui-ignore 속성이 있으면 스킵
          
          item.setAttribute('cui-rendered', 'true');
          item.classList.add('cui-form-select');

          item.addEventListener('change', function(e){
            var filter = item.getAttribute('cui-filter') || '';
            triggerEvent('select', filter, {
              elem: item
              ,value: item.value
              ,text: item.options[item.selectedIndex].text
            });
          });
        });
      }

      // 비밀번호 토글
      ,password: function(){
        elemForm.find('input[type="password"][cui-eye]').each(function(i, item){
          if(item.getAttribute('cui-rendered')) return;
          item.setAttribute('cui-rendered', 'true');

          var wrap = document.createElement('div');
          wrap.className = 'cui-form-password';
          item.parentNode.insertBefore(wrap, item);
          wrap.appendChild(item);

          var eyeBtn = document.createElement('i');
          eyeBtn.className = 'cui-icon cui-password-eye';
          eyeBtn.textContent = 'visibility_off';
          wrap.appendChild(eyeBtn);

          eyeBtn.addEventListener('click', function(){
            if(item.type === 'password'){
              item.type = 'text';
              eyeBtn.textContent = 'visibility';
            } else {
              item.type = 'password';
              eyeBtn.textContent = 'visibility_off';
            }
          });
        });
      }

      // 슬라이더 (range)
      ,slider: function(){
        elemForm.find('input[type="range"]').each(function(i, item){
          if(item.getAttribute('cui-rendered')) return;
          item.setAttribute('cui-rendered', 'true');

          item.classList.add('cui-form-slider');

          var showValue = item.getAttribute('cui-value') !== null;
          
          if(showValue){
            var valueSpan = document.createElement('span');
            valueSpan.className = 'cui-slider-value';
            valueSpan.textContent = item.value;
            item.parentNode.insertBefore(valueSpan, item.nextSibling);

            item.addEventListener('input', function(){
              valueSpan.textContent = item.value;
            });
          }

          item.addEventListener('change', function(){
            triggerEvent('slider', item.name, {
              elem: item
              ,value: item.value
            });
          });
        });
      }

      // 입력 그룹 (아이콘 + 입력)
      ,inputGroup: function(){
        elemForm.find('.cui-input-group').each(function(i, group){
          if(group.getAttribute('cui-rendered')) return;
          group.setAttribute('cui-rendered', 'true');

          var input = group.querySelector('input, select, textarea');
          if(input){
            input.addEventListener('focus', function(){
              group.classList.add('cui-focus');
            });
            input.addEventListener('blur', function(){
              group.classList.remove('cui-focus');
            });
          }
        });
      }
    };

    // 이벤트 트리거
    function triggerEvent(type, filter, params){
      if(window.Catui && Catui.event){
        Catui.event(MOD_NAME, type + '(' + filter + ')', params);
      }
    }

    // 렌더링 순서 (스위치가 체크박스보다 먼저)
    var renderOrder = ['switch', 'checkbox', 'radio', 'select', 'password', 'slider', 'inputGroup'];

    // 타입에 따른 렌더링
    if(type){
      items[type] && items[type]();
    } else {
      renderOrder.forEach(function(key){
        items[key] && items[key]();
      });
    }

    return that;
  };

  // 폼 리셋
  Form.prototype.reset = function(filter){
    var that = this
    ,$c = get$c()
    ,formElem = $c(ELEM + (filter ? '[cui-filter="' + filter + '"]' : ''));

    if(!formElem[0]) return that;

    // 네이티브 리셋
    formElem[0].reset();

    // 체크박스 UI 업데이트 (input은 이전 형제 요소)
    formElem.find('.cui-form-checkbox').each(function(i, wrap){
      var input = wrap.previousElementSibling;
      if(!input || input.type !== 'checkbox') return;
      
      wrap.classList.toggle('cui-form-checked', input.checked);
      
      var icon = wrap.querySelector('.cui-icon');
      icon.textContent = input.checked ? 'check' : '';
    });

    // 라디오 UI 업데이트 (input은 이전 형제 요소)
    formElem.find('.cui-form-radio').each(function(i, wrap){
      var input = wrap.previousElementSibling;
      if(!input || input.type !== 'radio') return;
      
      wrap.classList.toggle('cui-form-checked', input.checked);
      wrap.querySelector('.cui-icon').textContent = input.checked ? 'radio_button_checked' : 'radio_button_unchecked';
    });

    // 스위치 UI 업데이트 (input은 이전 형제 요소)
    formElem.find('.cui-form-switch').each(function(i, wrap){
      var input = wrap.previousElementSibling;
      if(!input || input.type !== 'checkbox') return;
      
      var texts = (input.getAttribute('cui-text') || '').split('|');
      wrap.classList.toggle('cui-form-checked', input.checked);
      
      var em = wrap.querySelector('em');
      if(em){
        em.textContent = (input.checked ? texts[0] : texts[1]) || '';
      }
    });

    // 검증 상태 초기화
    formElem.find('.cui-form-danger, .cui-form-success').removeClass('cui-form-danger cui-form-success');
    formElem.find('.cui-form-tip-error').remove();
    
    // 실시간 검증 바인딩
    console.log('[form.render] calling autoVerify, elemForm:', elemForm.length);
    that.autoVerify(elemForm);

    return that;
  };

  // 실시간 검증 활성화
  Form.prototype.liveVerify = function(filter){
    var that = this
    ,$c = get$c()
    ,formElem = $c(ELEM + (filter ? '[cui-filter="' + filter + '"]' : ''));

    formElem.find('[cui-verify]').each(function(i, item){
      // blur 이벤트
      item.addEventListener('blur', function(){
        that.verifyItem(item);
      });
      // change 이벤트 (select, checkbox, radio 등)
      item.addEventListener('change', function(){
        that.verifyItem(item);
      });
    });

    return that;
  };
  
  // 자동 실시간 검증 바인딩 (render 시 호출)
  Form.prototype.autoVerify = function(container){
    var that = this
    ,$c = get$c();
    
    // container가 jQuery 객체인 경우 직접 사용
    var formElem = container && container.length ? container : $c(ELEM);
    
    console.log('[form.autoVerify] formElem count:', formElem.length);

    formElem.find('[cui-verify]').each(function(i, item){
      console.log('[form.autoVerify] binding:', item);
      // 이미 바인딩된 경우 스킵
      if(item.getAttribute('cui-verify-bound')) return;
      item.setAttribute('cui-verify-bound', 'true');
      
      // blur 이벤트
      item.addEventListener('blur', function(){
        that.verifyItem(item);
      });
      // change 이벤트
      item.addEventListener('change', function(){
        that.verifyItem(item);
      });
      // input 이벤트 (실시간 검증)
      item.addEventListener('input', function(){
        that.verifyItem(item);
      });
    });

    return that;
  };

  // 개별 항목 검증
  Form.prototype.verifyItem = function(item){
    var that = this
    ,$c = get$c()
    ,verify = item.getAttribute('cui-verify');
    
    if(!verify) return true;

    var rules = verify.split('|');
    var value = item.value;
    var parent = $c(item).closest('.cui-form-item')[0] || item.parentNode;

    // 기존 상태 제거
    $c(parent).removeClass('cui-form-danger cui-form-success');
    var existingTip = parent.querySelector('.cui-form-tip');
    if(existingTip) existingTip.remove();

    for(var j = 0; j < rules.length; j++){
      var rule = that.config.verify[rules[j]];
      if(!rule) continue;

      var errMsg = '';
      if(typeof rule === 'function'){
        errMsg = rule(value, item);
      } else if(rule[0] && !rule[0].test(value)){
        errMsg = rule[1];
      }

      if(errMsg){
        $c(parent).addClass('cui-form-danger');
        var tip = document.createElement('div');
        tip.className = 'cui-form-tip cui-form-tip-error';
        tip.innerHTML = '<i class="cui-icon">error</i>' + errMsg;
        parent.appendChild(tip);
        return false;
      }
    }

    // 성공
    $c(parent).addClass('cui-form-success');
    return true;
  };

  // 폼 전체 검증
  Form.prototype.validate = function(filter){
    var that = this
    ,$c = get$c()
    ,formElem = $c(ELEM + (filter ? '[cui-filter="' + filter + '"]' : ''))
    ,isValid = true;

    formElem.find('[cui-verify]').each(function(i, item){
      if(!that.verifyItem(item)){
        if(isValid){ // 첫 번째 오류 필드에 포커스
          item.focus();
        }
        isValid = false;
      }
    });

    return isValid;
  };

  // 폼 비활성화/활성화
  Form.prototype.disabled = function(filter, isDisabled){
    var $c = get$c()
    ,formElem = $c(ELEM + (filter ? '[cui-filter="' + filter + '"]' : ''));

    formElem.find('input, select, textarea, button').each(function(i, item){
      item.disabled = isDisabled !== false;
    });

    return this;
  };

  // 폼 제출 이벤트
  Form.prototype.submit = function(filter, callback){
    var that = this;

    get$c()(document).on('submit', ELEM + '[cui-filter="' + filter + '"]', function(e){
      e.preventDefault();
      
      var formElem = get$c()(this);
      var field = that.getValue(filter, formElem);

      // 검증
      var isValid = true;
      formElem.find('[cui-verify]').each(function(i, item){
        var verify = item.getAttribute('cui-verify').split('|');
        var value = item.value;

        for(var j = 0; j < verify.length; j++){
          var rule = that.config.verify[verify[j]];
          if(!rule) continue;

          var errMsg = '';
          if(typeof rule === 'function'){
            errMsg = rule(value, item);
          } else if(rule[0] && !rule[0].test(value)){
            errMsg = rule[1];
          }

          if(errMsg){
            isValid = false;
            if(window.popup){
              popup.msg(errMsg);
            } else {
              alert(errMsg);
            }
            item.focus();
            return false;
          }
        }
      });

      if(isValid && typeof callback === 'function'){
        callback({ elem: this, field: field });
      }
    });

    return that;
  };

  // 인스턴스 생성
  var form = new Form();

  // 초기 렌더링 및 이벤트 바인딩
  var initOnReady = function(){
    var $c = get$c();
    if($c){
      $c(function(){
        bindFormSubmit($c);
      });
    } else {
      if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', function(){
          bindFormSubmit(get$c());
        });
      } else {
        bindFormSubmit(get$c());
      }
    }
  };

  // 이벤트 바인딩 플래그
  var eventsBound = false;
  
  // 폼 제출 이벤트 바인딩
  function bindFormSubmit($c){
    if(!$c) return;
    
    // 이미 바인딩되어 있으면 스킵
    if(eventsBound) return;
    eventsBound = true;
    
    // 검증 수행 함수
    function doVerify(formElem, $c){
      var isValid = true;
      $c(formElem).find('[cui-verify]').each(function(i, item){
        var verify = item.getAttribute('cui-verify');
        if(!verify) return;
        
        var rules = verify.split('|');
        var value = item.value;
        
        for(var j = 0; j < rules.length; j++){
          var rule = form.config.verify[rules[j]];
          if(!rule) continue;
          
          var errMsg = '';
          if(typeof rule === 'function'){
            errMsg = rule(value, item);
          } else if(rule[0] && !rule[0].test(value)){
            errMsg = rule[1];
          }
          
          if(errMsg){
            isValid = false;
            if(window.popup){
              popup.msg(errMsg, {icon: 2});
            } else {
              alert(errMsg);
            }
            item.focus();
            return false;
          }
        }
      });
      return isValid;
    }
    
    // 폼 submit 이벤트
    $c(document).on('submit', ELEM, function(e){
      e.preventDefault();
      
      var filter = this.getAttribute('cui-filter') || '';
      
      // 검증 수행
      if(!doVerify(this, $c)) return;

      if(window.Catui && Catui.event){
        Catui.event(MOD_NAME, 'submit(' + filter + ')', {
          elem: this
          ,field: form.getValue(filter, $c(this))
        });
      }
    });
    
    // cui-submit 버튼 클릭 이벤트
    $c(document).on('click', '[cui-submit]', function(e){
      e.preventDefault();
      
      var filter = this.getAttribute('cui-filter') || '';
      var formElem = null;
      
      // cui-filter가 있으면 해당 폼 찾기
      if(filter){
        formElem = document.querySelector(ELEM + '[cui-filter="' + filter + '"]');
      }
      // 없으면 가장 가까운 폼 찾기
      if(!formElem){
        formElem = $c(this).closest(ELEM)[0];
        if(formElem){
          filter = formElem.getAttribute('cui-filter') || '';
        }
      }
      
      if(!formElem) return;
      
      // 검증 수행
      if(!doVerify(formElem, $c)) return;
      
      if(window.Catui && Catui.event){
        Catui.event(MOD_NAME, 'submit(' + filter + ')', {
          elem: formElem
          ,field: form.getValue(filter, $c(formElem))
        });
      }
    });
  }

  initOnReady();

  // 전역 노출
  window.form = form;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = form;
  }

}(window);
