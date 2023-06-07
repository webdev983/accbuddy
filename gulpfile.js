const gulp = require("gulp");
const { deleteSync, deleteAsync } = require("del");
const runSequence = require("gulp4-run-sequence");
const rev = require("gulp-rev");
const gzip = require("gulp-gzip");
const revdel = require("gulp-rev-delete-original");
const collect = require("gulp-rev-collector");
const cleanCSS = require("gulp-clean-css");
const replace = require("gulp-replace");
const nunjucksRender = require("gulp-nunjucks-render");
const webp = require("gulp-webp");
const sitemap = require("gulp-sitemap");
const svgstore = require("gulp-svgstore");
const rename = require("gulp-rename");
const cheerio = require("gulp-cheerio");
const path = require("path");
const robots = require("gulp-robots");
const fs = require("fs");

// Rest of the Gulp tasks and configuration go here

gulp.task("initiate", () =>
  deleteAsync("build/**", { force: true }) // Deletes everything inside the build folder
    .then(function () {
      if (!fs.existsSync("build")) {
        // Checks if the build folder exists
        fs.mkdirSync("build", { recursive: true }); // Creates an empty build folder
      }
    })
);

gulp.task("nunjucks", function () {
  return gulp
    .src("pages/**/*.+(html|nunjucks)")
    .pipe(
      nunjucksRender({
        path: ["templates"],
      })
    )
    .pipe(gulp.dest("./build"));
});

gulp.task("convert-png", function () {
  gulp
    .src("assests/image/*.png")
    .pipe(webp())
    .pipe(gulp.dest("build/assests/image"));

  return gulp
    .src("build/**/*.html")
    .pipe(
      cheerio(function ($) {
        $('img[src$=".png"]').each(function () {
          const imagePath = $(this).attr("src");
          const webpPath = imagePath.replace(/\.png$/, ".webp");
          $(this).attr("src", webpPath);
        });
      })
    )
    .pipe(replace(".png", ".webp"))
    .pipe(gulp.dest("build"));
});

gulp.task("svg-sprite", function () {
  return gulp
    .src("assests/image/*.svg")
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/assests/image/"));
});

gulp.task("update-html", function () {
  return gulp
    .src("build/*.html")
    .pipe(
      cheerio(function ($) {
        $("img").each(function () {
          const $img = $(this);
          const imgSrc = $img.attr("src");
          const imgWidth = $img.attr("width");
          const imgHeight = $img.attr("height");
          const imgClass = $img.attr("class");

          if (imgSrc && imgSrc.endsWith(".svg")) {
            const imgId = path.basename(imgSrc, ".svg");

            $img.replaceWith(
              `<svg role="img" class="icon icon-${imgId} ${imgClass}" width="${imgWidth}" height="${imgHeight}"><use xlink:href="assests/image/sprite.svg#${imgId}"></use></svg>`
            );
          }
        });
      })
    )
    .pipe(gulp.dest("build"));
});

gulp.task("svg-sprite-implement", gulp.series("svg-sprite", "update-html"));

gulp.task("minify-css", () => {
  return gulp
    .src("assests/css/**/*.css")
    .pipe(cleanCSS())
    .pipe(gulp.dest("build/assests/css/"));
});

gulp.task("revision-rename", () =>
  gulp
    .src([
      "build/**/*.html",
      "build/**/*.css",
      "build/**/*.{webp,svg}",
      "!build/assests/css/partials/*.css",
    ])
    .pipe(rev())
    .pipe(revdel({ dest: "build" }))
    .pipe(gulp.dest("build"))
    .pipe(rev.manifest({ path: "manifest.json" }))
    .pipe(gulp.dest("build"))
);

gulp.task("revision-update-references", () =>
  gulp
    .src(["build/manifest.json", "build/**/*.{html,json,css,js}"])
    .pipe(collect())
    .pipe(gulp.dest("build"))
);

gulp.task(
  "file-fingerprinting",
  gulp.series("revision-rename", "revision-update-references")
);

gulp.task("gzip", function () {
  return gulp
    .src("build/assests/**/*.{css}") // Replaces into GZip
    .pipe(gzip())
    .pipe(gulp.dest("build/assests"));
});

gulp.task("gzip-clean", () => {
  return deleteSync([
    "build/assests/**/*.css",
    // "build/assests/**/*.png",
    // "build/assests/**/*.svg",
  ]);
});

gulp.task("gzip-convert", () => {
  return gulp
    .src("build/**/*.html")
    .pipe(replace(/(\.(svg|png|css))(\.gz)?/g, "$1.gz"))
    .pipe(gulp.dest("build"));
});

gulp.task("gzip-conversion", (done) => {
  runSequence("gzip", "gzip-convert", "gzip-clean", done);
});

gulp.task("robots-txt", function () {
  gulp
    .src("build/index*.html")
    .pipe(
      robots({
        useragent: "*",
        allow: ["/"],
      })
    )
    .pipe(gulp.dest("build"));
});

gulp.task("sitemap", function () {
  gulp
    .src("pages/*.html", {
      read: false,
    })
    .pipe(
      sitemap({
        siteUrl: "https://www.accbuddy.com",
      })
    )
    .pipe(gulp.dest("./build"));
});

gulp.task("copy-article-images", () =>
  gulp
    .src("assests/image/article/**/*")
    .pipe(gulp.dest("build/assests/image/article"))
);

gulp.task("copy-web-folder", () =>
  gulp.src("web/**/*").pipe(gulp.dest("build/web"))
);

gulp.task(
  "copy-folders",
  gulp.series("copy-article-images", "copy-web-folder")
);

gulp.task("npm-run-build", (done) =>
  runSequence(
    "initiate",
    "nunjucks",
    "convert-png",
    "svg-sprite-implement",
    "minify-css",
    "file-fingerprinting",
    // "gzip-conversion",
    "copy-folders",
    "robots-txt",
    "sitemap",
    done
  )
);

gulp.task("add-article", function () {
  return gulp
    .src("articles.html") // Replace 'index.html' with the path to your HTML file
    .pipe(
      cheerio(function ($) {
        // For User Input
        const articleTitle =
          "React JS websites have made it easy for businesses to sell their products online";
        const articleDescription =
          "Online sales also offer the advantage of tracking customer data and behaviour, helping businesses to better understand their target market and offer targeted promotions.";
        const redirectLink = "./article-details.html";
        const imageSource = "";
        // For User Input

        // DANGER-ZONE
        const container = $(".ab-article-content-wrapper"); // Select elements with the class 'ab-article-content-box'
        const lastElement = container.last(); // Select the last element with the class 'ab-article-content-box'
        // Append the HTML code to the last element
        lastElement.append(`
        <!-- article card start -->
        <div class="ab-article-card-items">
          <h6 class="ab-article-card-title"><a href="${redirectLink}">${articleTitle}</a></h6>
          ${
            imageSource &&
            `<img src="${imageSource}" width="426" height="213" alt="topic image" class="ab-article-image">`
          }
          <p class="ab-description">${articleDescription}</p>
          <button class="ab-button-style article-button">Read more</button>
        </div>
        <!-- [end] -->
      `);
      })
    )
    .pipe(gulp.dest("./")); // Replace 'dist' with the destination folder for the modified HTML file
});
