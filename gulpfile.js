const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const fs = require('fs');
const path = require('path');

// 경로 설정
const paths = {
  css: {
    src: [
      'src/css/base/variables.css',
      'src/css/base/reset.css',
      'src/css/base/icon.css',
      'src/css/base/layout.css',
      'src/css/base/utilities.css',
      'src/css/components/button.css',
      'src/css/components/input.css',
      'src/css/components/page.css',
      'src/css/components/popup.css',
      'src/css/components/form.css',
      'src/css/components/element.css',
      'src/css/components/menu.css',
      'src/css/components/date.css',
      'src/css/components/dropdown.css',
      'src/css/components/tree.css',
      'src/css/components/table.css',
      'src/css/components/colorpicker.css',
      'src/css/components/transfer.css',
      'src/css/components/upload.css',
      'src/css/components/carousel.css',
      'src/css/components/flow.css',
      'src/css/components/editor.css',
      'src/css/components/code.css',
      'src/css/components/misc.css',
      'src/css/components/theme.css'
    ],
    dest: 'dist/'
  },
  js: {
    core: 'src/catui.js',
    modules: 'src/modules/*.js',
    dest: 'dist/'
  },
  fonts: {
    src: 'fonts/material-icons-v145-latin-regular.woff2',
    dest: 'dist/fonts/'
  },
  html: {
    index: 'index.html',
    tests: 'tests/*.html',
    dest: 'dist/'
  }
};

// CSS 빌드
function buildCSS() {
  return gulp.src(paths.css.src)
    .pipe(concat('catui.css'))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream());
}

// JS 코어 빌드
function buildJS() {
  return gulp.src(paths.js.core)
    .pipe(gulp.dest(paths.js.dest))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.js.dest));
}

// JS 모듈 복사
function copyModules() {
  return gulp.src(paths.js.modules)
    .pipe(gulp.dest(paths.js.dest + 'modules/'));
}

// 폰트 복사
function copyFonts() {
  // 폰트 디렉토리 생성
  if (!fs.existsSync(paths.fonts.dest)) {
    fs.mkdirSync(paths.fonts.dest, { recursive: true });
  }
  
  return gulp.src(paths.fonts.src)
    .pipe(rename('material-icons.woff2'))
    .pipe(gulp.dest(paths.fonts.dest));
}

// HTML 복사 (경로 수정)
function copyHTML() {
  // index.html 복사 (경로 수정)
  const indexContent = fs.readFileSync('index.html', 'utf-8')
    .replace(/href="\/dist\//g, 'href="./')
    .replace(/src="\/dist\//g, 'src="./')
    .replace(/src="\/tests\//g, 'src="./tests/');
  fs.writeFileSync('dist/index.html', indexContent);
  
  // tests 폴더 복사 (경로 수정)
  if (!fs.existsSync('dist/tests')) {
    fs.mkdirSync('dist/tests', { recursive: true });
  }
  
  const testFiles = fs.readdirSync('tests').filter(f => f.endsWith('.html'));
  testFiles.forEach(file => {
    let content = fs.readFileSync(`tests/${file}`, 'utf-8')
      .replace(/href="\/dist\//g, 'href="../')
      .replace(/src="\/dist\//g, 'src="../');
    fs.writeFileSync(`dist/tests/${file}`, content);
  });
  
  // json 폴더 복사
  if (fs.existsSync('tests/json')) {
    if (!fs.existsSync('dist/tests/json')) {
      fs.mkdirSync('dist/tests/json', { recursive: true });
    }
    const jsonFiles = fs.readdirSync('tests/json');
    jsonFiles.forEach(file => {
      fs.copyFileSync(`tests/json/${file}`, `dist/tests/json/${file}`);
    });
  }
  
  return Promise.resolve();
}

// 개발 서버 - dist 폴더만 제공
function serve(done) {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    port: 3000,
    open: true,
    notify: false
  });
  done();
}

// 파일 변경 감지
function watchFiles() {
  gulp.watch('src/css/**/*.css', gulp.series(buildCSS, reload));
  gulp.watch('src/**/*.js', gulp.series(buildJS, copyModules, reload));
  gulp.watch(['index.html', 'tests/*.html'], gulp.series(copyHTML, reload));
}

// 브라우저 새로고침
function reload(done) {
  browserSync.reload();
  done();
}

// 빌드 태스크
const build = gulp.series(
  gulp.parallel(buildCSS, buildJS, copyModules, copyFonts),
  copyHTML
);

// 개발 태스크
const dev = gulp.series(
  build,
  serve,
  watchFiles
);

// 기본 태스크
exports.default = dev;
exports.build = build;
exports.watch = dev;
exports.serve = gulp.series(build, serve, watchFiles);
exports.css = buildCSS;
exports.js = buildJS;
