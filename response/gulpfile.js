var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var sass = require('gulp-sass');
 
//compress js file
gulp.task('uglify', function() {
  gulp.src(['_js/plugin/*.js',
  	'_js/main/response.js',
  	'_js/func/JSlideImg.js',
  	'_js/func/JResScrollSticker.js',
  	'_js/func/JResOverflow.js',
  	'_js/func/JResMenu.js',
  	'_js/func/JResMarquee.js',
  	//'_js/func/JResLadderObj.js',
  	//'_js/func/JResFollowObj.js',
  	'_js/func/JResEnlarge.js',
  	'_js/func/JResDelayLoader.js',
  	'_js/func/JResContentTab.js',
  	'_js/func/JResContentSlider.js',
    //'_js/func/JResAccordion.js',
    //'_js/func/JResWrapper.js'
  	])
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