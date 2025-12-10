import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        location: 'readonly',
        JSON: 'readonly',
        FormData: 'readonly',
        XMLHttpRequest: 'readonly',
        Blob: 'readonly',
        FileReader: 'readonly',
        Image: 'readonly',
        MutationObserver: 'readonly',
        CustomEvent: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        getComputedStyle: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        alert: 'readonly',
        prompt: 'readonly',
        // Catui globals
        $c: 'readonly',
        Catui: 'readonly',
        popup: 'readonly',
        // Jest globals
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
        require: 'readonly',
        module: 'readonly'
      }
    },
    rules: {
      // 에러 방지
      'no-undef': 'error',
      'no-unused-vars': ['warn', { 
        vars: 'all', 
        args: 'none',
        varsIgnorePattern: '^_|^\\$c$|^config$|^that$',
        caughtErrors: 'none'  // catch 블록 에러 변수 무시
      }],
      'no-redeclare': 'warn',  // 레거시 코드에서 var 재선언 허용
      
      // 코드 품질
      'eqeqeq': ['warn', 'smart'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'off',  // 템플릿 엔진에서 필요
      'no-with': 'error',
      
      // 스타일 (경고만)
      'semi': ['warn', 'always'],
      'no-extra-semi': 'warn',
      'no-unreachable': 'warn',
      'no-constant-condition': 'warn',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      
      // 허용 (레거시 코드 호환)
      'no-prototype-builtins': 'off',
      'no-useless-escape': 'off',
      'no-shadow-restricted-names': 'off',  // IIFE에서 undefined 파라미터 허용
      'no-control-regex': 'off'  // 파일 필터링용 정규식
    },
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**'
    ]
  },
  {
    files: ['tests/**/*.js'],
    rules: {
      'no-unused-vars': 'off'
    }
  }
];
