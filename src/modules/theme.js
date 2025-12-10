!function(window, undefined){
  "use strict";

  var MOD_NAME = 'theme'
  ,STORAGE_KEY = 'catui-theme'
  ,get$c = function(){ return window.$c; };

  // 테마 설정
  var themes = {
    // 기본 테마 (다크 사이드바)
    'default': {
      name: '기본',
      header: '#1e1e2d',
      sidebar: '#1e1e2d',
      logo: 'var(--cui-primary)',
      primary: '#1677ff',
      isDark: false
    },
    // 라이트 테마
    'light': {
      name: '라이트',
      header: '#ffffff',
      sidebar: '#ffffff',
      logo: '#ffffff',
      primary: '#1677ff',
      isDark: false,
      vars: {
        '--cui-theme-header-text': '#333333',
        '--cui-theme-sidebar-text': '#333333'
      }
    },
    // 다크 테마 (전체)
    'dark': {
      name: '다크',
      header: '#141414',
      sidebar: '#141414',
      logo: '#1f1f1f',
      primary: '#1677ff',
      isDark: true
    },
    // 블루 테마
    'blue': {
      name: '블루',
      header: '#1677ff',
      sidebar: '#001529',
      logo: '#002140',
      primary: '#1677ff',
      isDark: false
    },
    // 그린 테마
    'green': {
      name: '그린',
      header: '#52c41a',
      sidebar: '#1e1e2d',
      logo: '#389e0d',
      primary: '#52c41a',
      isDark: false
    },
    // 퍼플 테마
    'purple': {
      name: '퍼플',
      header: '#722ed1',
      sidebar: '#1e1e2d',
      logo: '#531dab',
      primary: '#722ed1',
      isDark: false
    },
    // 오렌지 테마
    'orange': {
      name: '오렌지',
      header: '#fa8c16',
      sidebar: '#1e1e2d',
      logo: '#d46b08',
      primary: '#fa8c16',
      isDark: false
    },
    // 레드 테마
    'red': {
      name: '레드',
      header: '#ff4d4f',
      sidebar: '#1e1e2d',
      logo: '#cf1322',
      primary: '#ff4d4f',
      isDark: false
    },
    // 시안 테마
    'cyan': {
      name: '시안',
      header: '#13c2c2',
      sidebar: '#1e1e2d',
      logo: '#08979c',
      primary: '#13c2c2',
      isDark: false
    },
    // 핑크 테마
    'pink': {
      name: '핑크',
      header: '#eb2f96',
      sidebar: '#1e1e2d',
      logo: '#c41d7f',
      primary: '#eb2f96',
      isDark: false
    },
    // 인디고 테마
    'indigo': {
      name: '인디고',
      header: '#2f54eb',
      sidebar: '#001529',
      logo: '#1d39c4',
      primary: '#2f54eb',
      isDark: false
    },
    // 티얼 테마
    'teal': {
      name: '티얼',
      header: '#20c997',
      sidebar: '#1e1e2d',
      logo: '#12b886',
      primary: '#20c997',
      isDark: false
    }
  };

  // 현재 테마
  var currentTheme = 'default';

  // 테마 모듈
  var theme = {
    // 이벤트 등록
    on: function(events, callback){
      if(window.Catui && Catui.onevent){
        return Catui.onevent.call(this, MOD_NAME, events, callback);
      }
      return this;
    },

    // 테마 목록 가져오기
    list: function(){
      return themes;
    },

    // 테마 정보 가져오기
    get: function(name){
      return themes[name] || themes['default'];
    },

    // 현재 테마 가져오기
    current: function(){
      return currentTheme;
    },

    // 테마 설정
    set: function(name, save){
      var $c = get$c();
      var themeData = themes[name] || themes['default'];
      currentTheme = name || 'default';

      // CSS 변수 설정
      var root = document.documentElement;
      root.style.setProperty('--cui-theme-header', themeData.header);
      root.style.setProperty('--cui-theme-sidebar', themeData.sidebar);
      root.style.setProperty('--cui-theme-logo', themeData.logo);
      
      // Primary 색상 변경
      if(themeData.primary){
        root.style.setProperty('--cui-primary', themeData.primary);
        
        // HEX → RGB 변환
        var hex = themeData.primary.replace('#', '');
        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);
        root.style.setProperty('--cui-primary-rgb', r + ', ' + g + ', ' + b);
        
        // hover/active 자동 계산 (10%, 20% 어둡게)
        var darken = function(hex, percent){
          var num = parseInt(hex.replace('#', ''), 16);
          var amt = Math.round(2.55 * percent);
          var R = Math.max(0, (num >> 16) - amt);
          var G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
          var B = Math.max(0, (num & 0x0000FF) - amt);
          return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
        };
        
        // 커스텀 값이 없으면 자동 계산
        if(!themeData.vars || !themeData.vars['--cui-primary-hover']){
          root.style.setProperty('--cui-primary-hover', darken(themeData.primary, 10));
        }
        if(!themeData.vars || !themeData.vars['--cui-primary-active']){
          root.style.setProperty('--cui-primary-active', darken(themeData.primary, 20));
        }
        
        // Light 버전 계산 (배경용)
        var lighten = function(hex, percent){
          hex = hex.replace('#', '');
          var r = parseInt(hex.substring(0, 2), 16);
          var g = parseInt(hex.substring(2, 4), 16);
          var b = parseInt(hex.substring(4, 6), 16);
          r = Math.round(r + (255 - r) * percent / 100);
          g = Math.round(g + (255 - g) * percent / 100);
          b = Math.round(b + (255 - b) * percent / 100);
          return '#' + [r, g, b].map(function(x){
            var hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          }).join('');
        };
        
        root.style.setProperty('--cui-primary-light', lighten(themeData.primary, 90));
        root.style.setProperty('--cui-primary-lighter', lighten(themeData.primary, 95));
      }

      // 추가 CSS 변수 설정
      if(themeData.vars){
        for(var key in themeData.vars){
          root.style.setProperty(key, themeData.vars[key]);
        }
      }

      // body에 data-theme 속성 설정
      document.body.setAttribute('data-theme', currentTheme);

      // 레이아웃 클래스 변경
      var layout = document.querySelector('.cui-layout-admin');
      if(layout){
        // 기존 테마 클래스 제거
        var classList = layout.className.split(' ').filter(function(c){
          return !c.startsWith('cui-theme-');
        });
        layout.className = classList.join(' ');
        
        // 새 테마 클래스 추가
        if(name && name !== 'default'){
          layout.classList.add('cui-theme-' + name);
        }
      }

      // 다크 모드 처리
      if(themeData.isDark){
        document.body.classList.add('cui-theme-dark');
      } else {
        document.body.classList.remove('cui-theme-dark');
      }

      // 저장
      if(save !== false){
        localStorage.setItem(STORAGE_KEY, currentTheme);
      }

      // 이벤트 발생
      if(window.Catui && Catui.event){
        Catui.event(MOD_NAME, 'change', {
          theme: currentTheme,
          data: themeData,
          isDark: themeData.isDark
        });
      }

      return this;
    },

    // 저장된 테마 복원
    restore: function(){
      var saved = localStorage.getItem(STORAGE_KEY);
      if(saved && themes[saved]){
        this.set(saved, false);
      }
      return this;
    },

    // 테마 초기화 (기본으로)
    reset: function(){
      localStorage.removeItem(STORAGE_KEY);
      this.set('default', false);
      return this;
    },

    // 커스텀 테마 추가
    add: function(name, config){
      if(name && config){
        themes[name] = config;
      }
      return this;
    },

    // Primary 색상만 변경 (브랜드 컬러)
    setPrimary: function(color, options){
      if(!color) return this;
      
      var opts = options || {};
      var root = document.documentElement;
      
      // 색상 유틸리티
      var hexToRgb = function(hex){
        hex = hex.replace('#', '');
        return {
          r: parseInt(hex.substring(0, 2), 16),
          g: parseInt(hex.substring(2, 4), 16),
          b: parseInt(hex.substring(4, 6), 16)
        };
      };
      
      var rgbToHex = function(r, g, b){
        return '#' + [r, g, b].map(function(x){
          var hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('');
      };
      
      var adjustBrightness = function(hex, percent){
        var rgb = hexToRgb(hex);
        var factor = percent / 100;
        return rgbToHex(
          rgb.r + (255 - rgb.r) * factor,
          rgb.g + (255 - rgb.g) * factor,
          rgb.b + (255 - rgb.b) * factor
        );
      };
      
      var darken = function(hex, percent){
        var rgb = hexToRgb(hex);
        var factor = 1 - (percent / 100);
        return rgbToHex(rgb.r * factor, rgb.g * factor, rgb.b * factor);
      };
      
      // Primary 색상
      var rgb = hexToRgb(color);
      root.style.setProperty('--cui-primary', color);
      root.style.setProperty('--cui-primary-rgb', rgb.r + ', ' + rgb.g + ', ' + rgb.b);
      root.style.setProperty('--cui-primary-hover', darken(color, 10));
      root.style.setProperty('--cui-primary-active', darken(color, 20));
      
      // 연한 버전 (배경용)
      root.style.setProperty('--cui-primary-light', adjustBrightness(color, 90));
      root.style.setProperty('--cui-primary-lighter', adjustBrightness(color, 95));
      
      // 헤더/사이드바도 함께 변경 (옵션)
      if(opts.applyToLayout){
        root.style.setProperty('--cui-theme-header', color);
        root.style.setProperty('--cui-theme-logo', darken(color, 15));
      }
      
      return this;
    },
    
    // 전체 브랜드 컬러 세트 적용
    setBrand: function(brandColor, options){
      var opts = options || {};
      var root = document.documentElement;
      
      // Primary 설정
      this.setPrimary(brandColor, opts);
      
      // 보조 색상도 브랜드에 맞게 조정 (옵션)
      if(opts.harmonize){
        // HSL 기반 조화 색상 계산
        var hexToHsl = function(hex){
          hex = hex.replace('#', '');
          var r = parseInt(hex.substring(0, 2), 16) / 255;
          var g = parseInt(hex.substring(2, 4), 16) / 255;
          var b = parseInt(hex.substring(4, 6), 16) / 255;
          var max = Math.max(r, g, b), min = Math.min(r, g, b);
          var h, s, l = (max + min) / 2;
          if(max === min){ h = s = 0; }
          else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
              case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
              case g: h = ((b - r) / d + 2) / 6; break;
              case b: h = ((r - g) / d + 4) / 6; break;
            }
          }
          return { h: h * 360, s: s * 100, l: l * 100 };
        };
        
        var hslToHex = function(h, s, l){
          h /= 360; s /= 100; l /= 100;
          var r, g, b;
          if(s === 0){ r = g = b = l; }
          else {
            var hue2rgb = function(p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
          }
          return '#' + [r, g, b].map(function(x){
            var hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          }).join('');
        };
        
        var hsl = hexToHsl(brandColor);
        
        // Success (120도 회전 - 녹색 계열)
        root.style.setProperty('--cui-success', hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
        // Info (180도 회전 - 청록 계열)
        root.style.setProperty('--cui-info', hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
      }
      
      return this;
    },

    // 테마 선택기 렌더링
    render: function(elem, options){
      var $c = get$c();
      if(!$c) return this;

      var opts = $c.extend({
        size: 24,
        gap: 8,
        showName: false,
        onChange: null
      }, options);

      var container = typeof elem === 'string' ? document.querySelector(elem) : elem;
      if(!container) return this;

      var html = '<div class="cui-theme-picker" style="display: flex; gap: ' + opts.gap + 'px; flex-wrap: wrap;">';
      
      for(var key in themes){
        var t = themes[key];
        var isActive = currentTheme === key ? ' active' : '';
        var border = key === 'light' ? 'border: 1px solid #ddd;' : '';
        html += '<div class="cui-theme-dot' + isActive + '" data-theme="' + key + '" title="' + t.name + '" style="width: ' + opts.size + 'px; height: ' + opts.size + 'px; background: ' + t.header + '; border-radius: 4px; cursor: pointer; ' + border + '"></div>';
      }
      
      html += '</div>';
      container.innerHTML = html;

      // 이벤트 바인딩
      var dots = container.querySelectorAll('.cui-theme-dot');
      var that = this;
      
      dots.forEach(function(dot){
        dot.addEventListener('click', function(){
          var themeName = this.getAttribute('data-theme');
          that.set(themeName);
          
          // 활성 상태 변경
          dots.forEach(function(d){ d.classList.remove('active'); });
          this.classList.add('active');

          // 콜백
          if(typeof opts.onChange === 'function'){
            opts.onChange(themeName, themes[themeName]);
          }
        });
      });

      return this;
    }
  };

  // DOM Ready 시 저장된 테마 복원
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      theme.restore();
    });
  } else {
    theme.restore();
  }

  // 전역 노출
  window.theme = theme;

  // Catui 모듈 등록
  if(window.Catui){
    window.Catui[MOD_NAME] = theme;
  }

}(window);
