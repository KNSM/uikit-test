const gulp = require('gulp')
const gulpFileInclude = require('gulp-file-include')
const sass = require('gulp-sass')(require('sass'))
const cleanCSS = require('gulp-clean-css')
const server = require('gulp-server-livereload')
const clean = require('gulp-clean')
const fs = require('fs')
const sourceMaps = require('gulp-sourcemaps')
const minifyJs = require('gulp-minify')
const rename = require('gulp-rename')


gulp.task('html', function () {
    return gulp
        .src('./src/*.html')
        .pipe(gulpFileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./public/'))
})

gulp.task('js', function () {
    return gulp
        .src('./src/js/**/*.js')
        .pipe(minifyJs({
            ext: {
                min: '.js' // Set the file extension for minified files to just .js
            },
            noSource: true // Don’t output a copy of the source file
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/js/'))
})

gulp.task('jsLibs', function () {
    return gulp
        .src('./node_modules/uikit/dist/js/uikit.min.js')
        .pipe(gulp.dest('./public/js/libs/'))
})

gulp.task('scss', function () {
    return gulp
        .src('./src/scss/main.scss')
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(sourceMaps.write())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/css'))
})

gulp.task('server', function () {
    return gulp
        .src('./public/')
        .pipe(server({
            livereload: true,
            open: true
        }));
})

gulp.task('images', function () {
    return gulp
        .src('./src/img/**/*')
        .pipe(gulp.dest('./public/img/'))
})

gulp.task('fonts', function () {
    return gulp
        .src('./src/fonts/**/*')
        .pipe(gulp.dest('./public/fonts/'))
})


gulp.task('clean', function (done) {
    if (fs.existsSync('./public/')) {
        return gulp
            .src('./public/', {read: false})
            .pipe(clean());
    }

    done();
})


gulp.task('watch', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss'))
    gulp.watch('./src/**/*.html', gulp.parallel('html'))
    gulp.watch('./src/img/**/*', gulp.parallel('images'))
    gulp.watch('./src/js/*.js', gulp.parallel('js'))
})

gulp.task('start', gulp.series(
    'clean',
    gulp.parallel('html', 'scss', 'images', 'fonts', 'js', 'jsLibs'),
    gulp.parallel('server', 'watch')
))

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('html', 'scss', 'images', 'fonts', 'js', 'jsLibs'),
))