"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const minify = require("gulp-clean-css");
const include = require("gulp-file-include");
const beautify = require("gulp-beautify");
const sass = require("gulp-sass")(require("sass"));
const livereload = require("gulp-livereload");
const terser = require("gulp-terser");
const uglify = require("gulp-uglify");

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
      "assests/scss/style.scss",
    ])
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(minify())
    .pipe(gulp.dest("docs/css"))
    .pipe(browsersync.stream())
    .pipe(livereload());
});

// Webfonts task
gulp.task("webfonts", () => {
  return gulp.src("assests/scss/web/*.{ttf,woff,woff2,eot,svg}").pipe(gulp.dest("docs/css/web"));
});

// Copy other images (SVG, GIF,WEBP) to docs folder
gulp.task("Images", () => {
  return gulp.src("assests/image/**/*.{svg,gif,webp}").pipe(gulp.dest("docs/image"));
});

// HTML task
gulp.task("html", () => {
  return gulp
    .src(["html/*.html", "html/**/*.html"])
    .pipe(include())
    .pipe(gulp.dest("docs"))
    .pipe(beautify.html({ indent_size: 1, indent_char: "\t" }))
    .pipe(browsersync.stream())
    .pipe(livereload());
});

// JavaScript task
gulp.task("js", () => {
  return gulp
    .src([
      "assests/*.js", 
      "assests/js/**/*.js", 
      "assests/js/*.js"
    ])
    .pipe(terser())
    .pipe(uglify())
    .pipe(gulp.dest("docs/js"))
    .pipe(browsersync.stream())
    .pipe(livereload());
});

// Watch files
gulp.task("watch", () => {
  livereload.listen();
  gulp.watch("assests/scss/**/*", gulp.series("css"));
  gulp.watch("html/partials/**/_*.html", gulp.series("html"));
  gulp.watch("html/*.html", gulp.series("html"));
  gulp.watch("assests/scss/web/*", gulp.series("webfonts"));
  gulp.watch("assests/image/**/*.{svg,gif}", gulp.series("Images"));
  gulp.watch("assests/js/*.js", gulp.series("js"));
});

// Serve task
gulp.task("serve", () => {
  browsersync.init({
    server: {
      baseDir: "docs/",
    },
    host: "localhost",
    port: 5000,
    open: true,
    tunnel: true,
  });
});

// Default task
gulp.task("watch", gulp.parallel("css", "webfonts", "Images", "html", "js", "serve", "watch"));
