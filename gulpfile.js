var gulp = require('gulp');
var sass = require('gulp-sass');
var insert = require('gulp-insert');
var dateFormat = require('dateformat');
var watch = require('gulp-watch');

var now = new Date();
var outputDate = dateFormat(now, "yyyy/m/d");
var insertString = '/* Date:'+outputDate+' | ResExpress | (c) 2014 Digishot | Jay Hsu | license:ISC */\n';

gulp.task('default', ['font-awesome','angularjs-sortable','sass','update-package-for-demo']);

//move plugin to the project
/* font-awesome package */
gulp.task('font-awesome', function() {
    gulp.src('node_modules/font-awesome/css/*')
        .pipe(gulp.dest('plugin/font-awesome/css/'));

    gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('plugin/font-awesome/fonts/'));
});

/* angularjs sortable package */
gulp.task('angularjs-sortable', function() {
    gulp.src('node_modules/angular-ui-sortable/dist/*')
        .pipe(gulp.dest('plugin/angular-ui-sortable/'));
});

//build sass/minify
gulp.task('sass', function(end) {
  setTimeout(function() {end(); }, 1200); //make sure the process end

  gulp.src('sass/*.scss')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(insert.prepend(insertString))
      .pipe(gulp.dest('css/'));
});

/* update package for demo express page*/
gulp.task('update-package-for-demo', function() {

    /*response package*/
    gulp.src('plugin/response/*.css')
        .pipe(gulp.dest('css/'))
        .pipe(gulp.dest('demo/css/'));

    gulp.src('plugin/response/*.js')
        .pipe(gulp.dest('js/'))
        .pipe(gulp.dest('demo/js/'));

    gulp.src('plugin/response/*.txt')
        .pipe(gulp.dest('demo/'));

    gulp.src('plugin/response/fonts/*')
        .pipe(gulp.dest('css/fonts/'))
        .pipe(gulp.dest('demo/css/fonts/'));

    /*font-awesome package*/
    gulp.src('node_modules/font-awesome/css/*')
        .pipe(gulp.dest('demo/plugin/font-awesome/css/'));

    gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('demo/plugin/font-awesome/fonts/'));
});