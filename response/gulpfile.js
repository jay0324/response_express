var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var sass = require('gulp-sass');
 
//compress js file
gulp.task('uglify', function() {
  gulp.src(['_js/plugin/*.js','_js/main/*.js'])
    .pipe(uglify('response.min.js', {
      //outSourceMap: false,
      //wrap: false
    }))
    .pipe(gulp.dest(''))
});

//build sass/minify
gulp.task('sass', function() {
    gulp.src('_sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('_css/'));
});

gulp.task('default', ['uglify']);