"use strict";

// Load plugins

const sitemap = require("gulp-sitemap");
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const minify = require("gulp-clean-css");
const fileInclude = require("gulp-file-include");
const through2 = require('through2');
const beautify = require("gulp-beautify");
const sass = require("gulp-sass")(require("sass"));
const terser = require("gulp-terser");
const uglify = require("gulp-uglify");
const replace = require('gulp-replace');
const fs = require('fs');
const del = require('del');

//delete html 
gulp.task('clean-html', function () {
  return del('docs/**/*.html');
});

//replace links

gulp.task('replace-html', function () {
    return gulp.src('docs/**/*.html')
        .pipe(replace('.html', ''))
        .pipe(gulp.dest('docs'));
});


// rename files
gulp.task('rename-files', function () {
    return gulp.src('docs/**/*.html')
        .pipe(rename({ extname: '' }))
        .pipe(gulp.dest('docs'));
});
// moverobots

gulp.task('move-robots', function() {
  return gulp.src('html/robots.txt')
    .pipe(rename('robots.txt'))
    .pipe(gulp.dest('docs'));
});

//sitemap task


gulp.task('sitemap', function () {
    return gulp.src([
        'html/**/*.html',
        '!html/404.html',
        '!html/account-settings.html',
        '!html/order-details.html',
        '!html/payment-failed.html',
        '!html/payment-received.html'
    ], {
        read: false
    })
    .pipe(sitemap({
        siteUrl: 'https://www.accbuddy.com',
        getLoc: function (siteUrl, loc, entry) {
            return loc.replace('.html', '');
        }
    }))
    .pipe(replace('.html', ''))
    .pipe(gulp.dest('./docs'));
});


// CSS task
gulp.task("css", () => {
  return gulp
    .src([
      "assests/*.css",
      "assests/scss/**/*.css",
      "assests/scss/*.css",
      "assests/scss/style.scss",
    ])
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(minify())
    .pipe(gulp.dest("docs/css"))
    .pipe(browsersync.stream());
});

// Webfonts task
gulp.task("webfonts", () => {
  return gulp.src("assests/scss/web/*.{ttf,woff,woff2,eot,svg}").pipe(gulp.dest("docs/css/web"));
});

// Copy other images (SVG, GIF,WEBP) to docs folder
gulp.task("images", () => {
  return gulp.src("assests/image/**/*.{svg,gif,webp}").pipe(gulp.dest("docs/image"));
});


gulp.task("fileInclude", () => {
  const scripts = JSON.parse(fs.readFileSync('scripts.json'));

  return gulp
    .src("html/*.html")
    .pipe(
      through2.obj(function (file, enc, cb) {
        const fileContent = file.contents.toString();
        const flags = {};

        // Check each section in the JSON file
        scripts.sections.forEach(section => {
          const sectionCommentedOut = new RegExp(`<!--\\s*@@include\\("${section.include}"\\)\\s*-->`).test(fileContent);
          flags[section.name] = fileContent.includes(`@@include("${section.include}")`) && !sectionCommentedOut;
        });

        file.flags = flags;
        file.needScriptsJson = Object.values(flags).some(value => value === true);
        cb(null, file);
      })
    )
    .pipe(replace('<!-- headScriptsJson -->', function (match) {
      if (this.file.needScriptsJson) {
        return '<script src="scripts.json" defer></script>\n';
      }
      return '';
    }))
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(replace(/<!--\s*build:([^ ]+?)\s*-->[\s\S]*?<!--\s*endbuild\s*-->/g, function (match, p1) {
      const section = scripts.sections.find(s => s.name === p1);
      if (section && this.file.flags[section.name]) {
        return `<script src="${section.script}" defer></script>\n`;
      }
      return '';
    }))
    .pipe(replace('<!-- headScripts -->', function (match) {
      let scriptTags = '';

      // Generate script tags for sections with headScript property
      scripts.sections.forEach(section => {
        if (section.headScript && this.file.flags[section.name]) {
          scriptTags += `<script src="${section.headScript}"  defer></script>\n`;
        }
      });
      return scriptTags;
    }))
    .pipe(gulp.dest("docs"))
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(browsersync.stream());
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
    .pipe(browsersync.stream());
});

// Watch files
gulp.task("watch", () => {
  browsersync.init({
    server: {
      baseDir: "docs/",
    },
    host: "localhost",
    port: 5000,
    open: true,
    tunnel: true,
    online: false, // Add this line to disable the online option
  });

  gulp.watch("assests/scss/**/*", gulp.series("css"));
  gulp.watch("html/*.html", gulp.series("fileInclude"));
  gulp.watch("assests/scss/web/*", gulp.series("webfonts"));
  gulp.watch("assests/image/**/*.{svg,gif}", gulp.series("images"));
  gulp.watch("assests/js/*.js", gulp.series("js"));
});

// Default task

// Default task
gulp.task("default", gulp.parallel("css", "webfonts", "images", "fileInclude", "js", "sitemap", "move-robots","watch"));



gulp.task("finish", gulp.series("replace-html", "rename-files","clean-html"));