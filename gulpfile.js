var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');


gulp.task('default', ['build']);

gulp.task('build', ['copy', 'sass']);

gulp.task('sass', copyScssTask);

gulp.task('copy', copyTask);

gulp.task('clean', cleanUp);

function copyTask() {
    return gulp.src('src/assets/**')
        .pipe(gulp.dest('out/'));
}

function copyScssTask() {
    return gulp.src('src/styles/**')
        .pipe(sass())
        .pipe(gulp.dest('out/'));
}

function cleanUp() {
    return del('out/');
}