var gulp = require('gulp');
var sass = require('gulp-sass');
var insert = require('gulp-insert');
var connect = require('gulp-connect');
var dateFormat = require('dateformat');
var watch = require('gulp-watch');
var jade = require('gulp-jade');

var now = new Date();
var outputDate = dateFormat(now, "yyyy/m/d");
var insertString = '/* Date:'+outputDate+' | ResExpress | (c) 2014 Digishot | Jay Hsu | license:ISC */\n';

gulp.task('default', ['font-awesome','response','jade','watch']);

//liveload
gulp.task('server', function () {
  connect.server({
    host: 'localhost',
    post: 8888,
    livereload: true
  });
});

//move plugin to the project
/* font-awesome package */
gulp.task('font-awesome', function() {
    gulp.src('node_modules/font-awesome/css/*')
        .pipe(gulp.dest('plugin/font-awesome/css/'));

    gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('plugin/font-awesome/fonts/'));
});

/* response package*/
gulp.task('response', function() {

    /*response package*/
    gulp.src('response/dist/response/response.min.css')
        .pipe(gulp.dest('css/'));

    gulp.src('response/dist/response/response.min.js')
        .pipe(gulp.dest('js/'));

    gulp.src('response/dist/response/readme.txt')
        .pipe(gulp.dest(''));

    gulp.src('response/dist/response/fonts/*')
        .pipe(gulp.dest('css/fonts/'));

    /*font-awesome package*/
    gulp.src('node_modules/font-awesome/css/*')
        .pipe(gulp.dest('plugin/font-awesome/css/'));

    gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('plugin/font-awesome/fonts/'));
});

// jade
gulp.task('jade', function(){
  return gulp.src(['jade/*.jade', '!jade/tpl/*.jade'])
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(''))
})

//watch
gulp.task('watch', function() {
    gulp.watch('jade/*.jade', ['jade']);
})