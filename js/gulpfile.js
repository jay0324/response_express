//var gulp = require('gulp');
var gulp = require('gulp-run-seq');
var uglify = require('gulp-uglifyjs');
var sass = require('gulp-sass');
var cssBase64 = require('gulp-css-base64'); //convert into base64 uri
var rename = require('gulp-rename');
var insert = require('gulp-insert');
var dateFormat = require('dateformat');
var watch = require('gulp-watch');

var now = new Date();
var outputDate = dateFormat(now, "yyyy/m/d");
var insertString = '/* Date:'+outputDate+' | JResponsive.js | (c) 2014 Digishot | Jay Hsu | license:ISC */\n';

//default task
gulp.task('default', [[['uglify','sass'], 'dist']]);

//compress js file
gulp.task('uglify', function(end) {
  setTimeout(function() {end(); }, 1200); //make sure the process end

  gulp.src([
      'js/plugin/*.js',
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
      .pipe(insert.prepend(insertString))
      .pipe(gulp.dest(''));
});

//build sass/minify
gulp.task('sass', function(end) {
  setTimeout(function() {end(); }, 1200); //make sure the process end

  //outputStyle: nested, expanded, compact, compressed
  gulp.src('sass/*.scss')
      .pipe(rename({basename:'response'}))
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(insert.prepend(insertString))
      .pipe(gulp.dest('css/'));
});

//build for dist
gulp.task('dist', function(end) {
  setTimeout(function() {end(); }, 1000); //make sure the process end

  //rebuild the css with image inline
  gulp.src('css/*.css')
      .pipe(cssBase64({
        baseDir: "",
        //maxWeightResource: 100,
        extensionsAllowed: ['.jpg', '.png']
      }))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(gulp.dest('./dist/response'));

  //rebuild the response.js
  gulp.src(['js/response.min.js'])
      .pipe(uglify('response.min.js', {
        outSourceMap: false,
        wrap: false
      }))
      .pipe(insert.prepend(insertString))
      .pipe(gulp.dest('./dist/response'));

  //put fonts to dist
  gulp.src('fonts/*')
    .pipe(gulp.dest('./dist/response/fonts/'));
    
});