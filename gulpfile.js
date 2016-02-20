var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var through = require('through2');
var del = require('del');
var browserSync = require('browser-sync');

gulp.task('default', ['build']);

gulp.task('build', ['copy', 'sass']);
gulp.task('dev', ['watch'], setupBrowserSyncTask);

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
        .pipe(gulp.dest('out/'))
        .pipe(browserSync.stream());
}

function copyScssTask() {
    gutil.log("starting with scss files...");
    return gulp.src('src/styles/*.scss')
        .pipe(plumber(function (err) {
            gutil.log('error occurred in pipeline', err);
            this.push(null);
        }))
        .pipe(inspect())
        .pipe(sass())
        .pipe(plumber.stop())
        .pipe(through.obj(logging))
        .pipe(gulp.dest('out/'))
        .pipe(browserSync.stream());
}

function cleanUp() {
    return del('out/');
}

function logging(file, _, callback) {
    gutil.log("hi there");
    this.push(file);
    callback();
}

function inspect() {
    return through.obj(function (file, _, callback) {
        gutil.log('looking at the file', file);
        //this.emit('error', new Error('something broke'));
        this.push(file)
        callback();
    });
}

function setupBrowserSyncTask() {
    browserSync({
        server: {
            baseDir: 'out'
        },
        open: false
    });
}