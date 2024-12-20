const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

// Função que compila o SCSS para CSS
function styles() {
    return gulp.src('./src/styles/*.scss')  // Caminho dos arquivos SCSS
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))  // Compilando e tratando erros
    .pipe(gulp.dest('./dist/css'));  // Pasta de destino do CSS compilado
}

// Tarefa padrão
exports.default = styles;
exports.watch = function() {
    gulp.watch('./src/styles/*.scss', gulp.parallel(styles))
}