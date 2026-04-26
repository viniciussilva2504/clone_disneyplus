const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const through2 = require('through2');
const sharp = require('sharp');
const path = require('path');
const browserSync = require('browser-sync').create();

// ─── Paths ────────────────────────────────────────────────────
const paths = {
  scss: { src: 'src/scss/**/*.scss', dest: 'dist/css' },
  js: { src: 'src/scripts/**/*.js', dest: 'dist/js' },
  images: { src: ['src/images/**/*', '!src/images/**/__MACOSX/**'], dest: 'dist/images' },
  fonts: { src: 'src/fonts/**/*.{woff,woff2}', dest: 'dist/fonts' },
  html: { src: '*.html' },
};

// ─── SCSS → CSS ───────────────────────────────────────────────
function styles() {
  return src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false,
      })
    )
    .pipe(cleanCSS({ compatibility: 'ie11' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// ─── JavaScript ───────────────────────────────────────────────
function scripts() {
  return src(paths.js.src).pipe(uglify()).pipe(dest(paths.js.dest)).pipe(browserSync.stream());
}

// ─── Imagens ──────────────────────────────────────────────────
function sharpOptimize() {
  return through2.obj(function (file, _, cb) {
    if (file.isNull() || file.isDirectory()) return cb(null, file);

    const ext = path.extname(file.path).toLowerCase();
    const handlers = {
      '.jpg': () => sharp(file.contents).jpeg({ quality: 80, progressive: true }).toBuffer(),
      '.jpeg': () => sharp(file.contents).jpeg({ quality: 80, progressive: true }).toBuffer(),
      '.png': () => sharp(file.contents).png({ compressionLevel: 8 }).toBuffer(),
      '.webp': () => sharp(file.contents).webp({ quality: 80 }).toBuffer(),
    };

    const handler = handlers[ext];
    if (!handler) return cb(null, file); // SVGs and other formats pass through unchanged

    handler()
      .then((buffer) => {
        file.contents = buffer;
        cb(null, file);
      })
      .catch(() => cb(null, file)); // pass through unprocessable files unchanged
  });
}

function images() {
  return src(paths.images.src).pipe(sharpOptimize()).pipe(dest(paths.images.dest));
}

// ─── WebP ─────────────────────────────────────────────────────
const fs = require('fs');

function webp(done) {
  const srcBase = 'src/images';
  const destBase = paths.images.dest;

  // Walk all JPG/JPEG/PNG under src/images (excluding __MACOSX)
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const e of entries) {
      if (e.name === '__MACOSX') continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) files.push(...walk(full));
      else if (/\.(jpe?g|png)$/i.test(e.name)) files.push(full);
    }
    return files;
  }

  const files = walk(srcBase);
  const tasks = files.map((srcPath) => {
    const rel = path.relative(srcBase, srcPath);
    const destPath = path.join(destBase, rel.replace(/\.(jpe?g|png)$/i, '.webp'));
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    return sharp(srcPath).webp({ quality: 80 }).toFile(destPath).catch(() => {});
  });

  return Promise.all(tasks).then(() => done());
}

// ─── BrowserSync ──────────────────────────────────────────────
function serve() {
  browserSync.init({ server: { baseDir: './' }, notify: false });
  watch(paths.scss.src, styles);
  watch(paths.js.src, scripts);
  watch(paths.html.src).on('change', browserSync.reload);
}

// ─── Fontes ───────────────────────────────────────────────────
function fonts() {
  return src(paths.fonts.src).pipe(dest(paths.fonts.dest));
}

// ─── Exports ──────────────────────────────────────────────────
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.webp = webp;
exports.fonts = fonts;
exports.default = series(parallel(styles, scripts, images, webp, fonts));
exports.watch = serve;
