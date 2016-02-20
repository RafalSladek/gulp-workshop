var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var through = require('through2');
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
    gutil.log("starting with scss files...");
    return gulp.src('src/styles/*.scss')
        .pipe(sass())
        .pipe(through.obj(logging))
        .pipe(gulp.dest('out/'));
}

function cleanUp() {
    return del('out/');
}

function logging(file,_, callback){
    gutil.log("hi there");
    this.push(file);
    callback();
}