const project_folder = "dist";
const source_folder = "#src";

const path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp|mp4)",
    fonts: source_folder + "/fonts/**/*.*",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp|mp4)",
    fonts: source_folder + "/fonts/**/*.*",
  },
  clean: "./" + project_folder + "/",
};

const { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  fileInclude = require("gulp-file-include"),
  del = require("del"),
  sass = require("gulp-sass")(require("sass")),
  autoprefixer = require("gulp-autoprefixer"),
  media_queries = require("gulp-group-css-media-queries"),
  clean_css = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify-es").default,
  imagemin = require("gulp-image-sans-guetzli");

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },
    port: 3000,
    notify: false,
  });
}
/* Dev */
function html() {
  return (
    src(path.src.html)
      .pipe(fileInclude())

      //.pipe(webphtml())
      //.pipe(pug())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
  );
}
function htmlProd() {
  return src(path.src.html).pipe(fileInclude()).pipe(dest(path.build.html));
}
function css() {
  return src(path.src.css)
    .pipe(
      sass({
        outputStyle: "expanded",
      })
    )
    .pipe(media_queries())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}
function cssProd() {
  return src(path.src.css)
    .pipe(
      sass({
        outputStyle: "expanded",
      })
    )
    .pipe(media_queries())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true,
      })
    )

    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}
function js() {
  return (
    src(path.src.js)
      /*.pipe(uglify())
      .pipe(
      rename({
        extname: ".min.js",
      })
    ) */
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
  );
}
function jsProd() {
  return src(path.src.js)
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest(path.build.js));
}
function images() {
  return src(path.src.img)
    .pipe(
      imagemin({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        gifsicle: true,
        svgo: true,
        concurrent: 7,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}
function imagesProd() {
  return src(path.src.img)
    .pipe(
      imagemin({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        gifsicle: true,
        svgo: true,
        concurrent: 7,
      })
    )
    .pipe(dest(path.build.img));
}
function fonts() {
  return src(path.src.fonts).pipe(dest(path.build.fonts));
}
/* Prod */
function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
  gulp.watch([path.watch.fonts], fonts);
}
function clean() {
  return del(path.clean);
}
/* For development */
const build = gulp.series(clean, gulp.parallel(css, html, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);

/* For production */
const prod = gulp.series(
  clean,
  gulp.parallel(cssProd, htmlProd, jsProd, imagesProd, fonts)
);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

exports.prod = prod;
