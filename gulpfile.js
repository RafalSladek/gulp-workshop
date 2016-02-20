var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var through = require('through2');
var del = require('del');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['build']);

gulp.task('build', ['build:copy', 'build:sass', 'build:scripts']);

gulp.task('dev', ['watch'], setupBrowserSyncTask);

// See https://www.npmjs.com/package/gulp-sequence
// to make this sequential
gulp.task('watch', ['build', 'watch:scss', 'watch:copy', 'watch:scripts']);
gulp.task('watch:scss', watchScssTask);
gulp.task('watch:copy', watchCopyTask);
gulp.task('watch:scripts', watchScriptsTask);

gulp.task('build:sass', copyScssTask);
gulp.task('build:scripts', buildScritpsTask);

gulp.task('build:copy', copyTask);

gulp.task('clean', cleanUp);


function watchScssTask() {
    gulp.watch('src/styles/*.scss', {}, ['build:sass'])
}

function watchScriptsTask() {
    gulp.watch('src/scripts/*.js', {}, ['build:scripts'])
}

function watchCopyTask() {
    gulp.watch('src/assets/**', {}, ['build:copy'])
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
            gutil.log('error occurred in scripts', err);
            this.push(null);
        }))
        .pipe(inspect())
        .pipe(sass())
        .pipe(plumber.stop())
        .pipe(through.obj(logging))
        .pipe(gulp.dest('out/'))
        .pipe(browserSync.stream())
}

function buildScritpsTask() {
    return browserify('src/scripts/main.js', {
        debug: true
    })
        .bundle()
        .on('error', function (err) {
            gutil.log('error occurred in scripts', err);
            this.push(null);
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('out/'))
        .pipe(browserSync.stream())
}

function cleanUp() {
    return del('out/');
}

function logging(file, _, callback) {
    gutil.log("hi there");
    this.push(file);
    callback();
}


function onError(err) {
    gutil.log('error occurred in scripts', err);
    this.push(null);
    // with push null to the current stream which has error, so the other streams can work properly
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