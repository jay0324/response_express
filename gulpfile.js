var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var sass = require('gulp-sass');
 
//compress js file
gulp.task('uglify', function() {
  gulp.src(['js/plugin/*.js',
  	'js/main/response.js',
  	'js/func/JSlideImg.js',
  	'js/func/JResScrollSticker.js',
  	'js/func/JResOverflow.js',
  	'js/func/JResMenu.js',
  	'js/func/JResMarquee.js',
  	'js/func/JResLadderObj.js',
  	'js/func/JResFollowObj.js',
  	'js/func/JResEnlarge.js',
  	'js/func/JResDelayLoader.js',
  	'js/func/JResContentTab.js',
  	'js/func/JResContentSlider.js',
    'js/func/JResAccordion.js',
    'js/func/JResWrapper.js'
  	])
    .pipe(uglify('js/response.min.js', {
      //outSourceMap: false,
      //wrap: false
    }))
    .pipe(gulp.dest(''))
});

//build sass/minify
gulp.task('sass', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('css/'));
});

gulp.task('default', ['uglify']);