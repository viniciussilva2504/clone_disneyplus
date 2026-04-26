const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();

// ─── Paths ────────────────────────────────────────────────────
const paths = {
  scss: { src: "src/scss/**/*.scss", dest: "dist/css" },
  js: { src: "src/scripts/**/*.js", dest: "dist/js" },
  images: { src: "src/images/**/*", dest: "dist/images" },
  html: { src: "*.html" },
};

// ─── SCSS → CSS ───────────────────────────────────────────────
function styles() {
  return src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      }),
    )
    .pipe(cleanCSS({ compatibility: "ie11" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// ─── JavaScript ───────────────────────────────────────────────
function scripts() {
  return src(paths.js.src)
    .pipe(uglify())
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// ─── Imagens ──────────────────────────────────────────────────
function images() {
  return src(paths.images.src)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
      ]),
    )
    .pipe(dest(paths.images.dest));
}

// ─── BrowserSync ──────────────────────────────────────────────
function serve() {
  browserSync.init({ server: { baseDir: "./" }, notify: false });
  watch(paths.scss.src, styles);
  watch(paths.js.src, scripts);
  watch(paths.html.src).on("change", browserSync.reload);
}

// ─── Exports ──────────────────────────────────────────────────
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.default = series(parallel(styles, scripts, images));
exports.watch = serve;
