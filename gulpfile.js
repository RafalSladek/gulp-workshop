var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var through = require('through2');
var del = require('del');

gulp.task('default', ['build']);

gulp.task('build', ['copy', 'sass']);

// See https://www.npmjs.com/package/gulp-sequence
// to make this sequential
gulp.task('watch', ['build', 'watch:scss', 'watch:copy']);
gulp.task('watch:scss', watchScssTask);
gulp.task('watch:copy', watchCopyTask);

gulp.task('sass', copyScssTask);

gulp.task('copy', copyTask);

gulp.task('clean', cleanUp);


function watchScssTask() {
    gulp.watch('src/styles/*.scss', {}, ['sass'])
}

function watchCopyTask() {
    gulp.watch('src/assets/**', {}, ['copy'])
}

function copyTask() {
    return gulp.src('src/assets/**')
        .pipe(gulp.dest('out/'));
}

function copyScssTask() {
    gutil.log("starting with scss files...");
    return gulp.src('src/styles/*.scss')
        .pipe(sass())
        .on('error', function(err){
            gutil.log('error occured', err)
            this.push(null)
        })
        .pipe(through.obj(logging))
        .pipe(gulp.dest('out/'));
}

function cleanUp() {
    return del('out/');
}

function logging(file, _, callback) {
    gutil.log("hi there");
    this.push(file);
    callback();
}