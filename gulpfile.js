"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const concat = require('gulp-concat');
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const minify = require('gulp-clean-css');
var include = require('gulp-file-include');
const beautify = require('gulp-beautify');
const terser = require('gulp-terser');
const imagewebp = require('gulp-webp');
var sass = require('gulp-sass')(require('sass'));
const livereload = require('gulp-livereload');
var reload = browsersync.reload;



// == Browser-sync task
gulp.task("browser-sync", function (done) {
  browsersync.init({
    server: {
      baseDir: 'docs/',
    },
    // startPath: "src/index.html", 
    //    browser: 'chrome',
    host: 'localhost',
    port: 5000,
    open: true,
    tunnel: true
  });
  gulp.watch(["./**/*.html"]).on("change", reload);
  done();
});

// CSS task
gulp.task("css", () => {
  return gulp
    .src([
      "assests/scss/404-page.css",
      "assests/scss/acc-settings.css",
      "assests/scss/account-page.css",
      "assests/scss/article-details.css",
      "assests/scss/article-page.css",
      "assests/scss/checkout-page.css",
      "assests/scss/earn-page.css",
      "assests/scss/faq-page.css",
      "assests/scss/guest-order-page.css",
      "assests/scss/home.css",
      "assests/scss/marchent-page.css",
      "assests/scss/order-details.css",
      "assests/scss/order-history.css",
      "assests/scss/payment-details.css",
      "assests/scss/payment-receve.css",
      "assests/scss/reset-pass-page.css",
      "assests/scss/signIn-page.css",
      "assests/scss/signUp-page.css",
      "assests/scss/terms-service.css",
      "assests/scss/style.scss"
    ])
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(minify())
    .pipe(gulp.dest("docs/css"))
    .pipe(browsersync.stream())
    .pipe(livereload())
});

// Webfonts task
gulp.task("webfonts", () => {
  return (
    gulp
      .src("assests/scss/web/*.{ttf,woff,woff2,eot,svg}")
      .pipe(gulp.dest('docs/css/web'))
  );
});

//optimize and move images
gulp.task("webpImage", () => {
  return (
    gulp
      .src('assests/image/**/*.{jpg,png}')
      .pipe(imagewebp())
      .pipe(gulp.dest('docs/image'))
  );
});
//svg images
gulp.task("svgImage", () => {
  return (
    gulp
      .src('assests/image/*.{svg,gif,pdf,webp}')
      .pipe(gulp.dest('docs/image'))
  );
});


gulp.task("htmlInc", () => {
  return (
    gulp
      .src([
        'html/*.html',
        'html/**/*.html'
      ])
      .pipe(include())
      .pipe(gulp.dest('docs'))
      .pipe(beautify.html({ indent_size: 1, indent_char: "	" }))
      .pipe(browsersync.stream())
      .pipe(livereload())
  );
});
gulp.task("htmlComponents", () => {
  return (
    gulp
      .src(['html/partials/**/_*.html'])
      .pipe(include())
      .pipe(browsersync.stream())
      .pipe(livereload())
  );
});

// Transpile, concatenate and minify scripts
// gulp.task("js", () => {
//   return (
//     gulp
//       .src([
//         "node_modules/swiper/swiper-bundle.min.js",
//         'assests/js/general.js'
//       ])
//       // folder only, filename is specified in webpack config
//       .pipe(concat('app.js'))
//       .pipe(terser())
//       .pipe(gulp.dest("src/js"))
//       .pipe(browsersync.stream())
//       .pipe(livereload())
//   );
// });

gulp.task("default", gulp.series("css", "webfonts", "webpImage", "htmlInc", "htmlComponents", "browser-sync", "svgImage", () => {
  livereload.listen();
  gulp.watch(["assests/scss/**/*"], gulp.series("css"));
  //   gulp.watch(["assests/js/**/*"], gulp.series("js"));
  gulp.watch(["html/partials/**/_*.html"], gulp.series("htmlComponents"));
  gulp.watch(['html/*.html'], gulp.series("htmlInc"));
  gulp.watch(["assests/scss/web/*"], gulp.series("webfonts"));
  gulp.watch('assests/image/*.{jpg,png}', gulp.series("webpImage"));
  gulp.watch('assests/image/*.{svg,gif,pdf}', gulp.series("svgImage"));
}));





