var gulp = require('gulp'),
    config = require('../config'),
    htmlReplace = require('gulp-html-replace'),
    filenames = require('gulp-filenames'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

gulp.task('dev:jsLib',function(){
  config.loadSrc.jsLib = config.jsLib.length == 0 ? "" : "<script src='/app/" + config.jsLib.join("'></script>"+"\r\t\t"+"<script src='/app/") + "'></script>";
});

gulp.task('jsAppFileNames',function(){
  config.jsAppFlag = Date.parse(new Date()).toString()+ Math.floor(Math.random()*(100)).toString();
  return gulp.src(['src/**/*.js','!src/bower_components/**/*.*']).pipe(filenames(config.jsAppFlag));
});
gulp.task('dev:jsApp',['jsAppFileNames'],function(){
  var jsStr = "<script src='/app/" + filenames.get(config.jsAppFlag).join("'></script>"+"\r\t\t"+"<script src='/app/") + "'></script>";
  config.loadSrc.jsApp = jsStr;
});

gulp.task('dev:cssLib',function(){
  config.loadSrc.cssLib = config.cssLib.length == 0 ? "" : "<link rel='stylesheet' href='/app/" + config.cssLib.join("'/>"+"\r\t\t"+"<link rel='stylesheet' href='/app/") + "'/>";
});

gulp.task('dev:cssApp',['build:less'], function(){
  var cssStr = "<link rel='stylesheet' href='/app/index.css'>\r";
  config.loadSrc.cssApp = cssStr;
});

gulp.task('dev:files',function(){
  gulp.src(['src/**/*.*']).pipe(gulp.dest('app/'));
}); 

gulp.task('dev:app',['dev:files','dev:jsLib','dev:jsApp','dev:cssLib','dev:cssApp', 'browser-sync'],function(){
  gulp.src('src/modules/index/index.html').pipe(htmlReplace({
    'cssLib': config.loadSrc.cssLib,
    'cssApp': config.loadSrc.cssApp,
    'jsLib': config.loadSrc.jsLib,
    'jsApp': config.loadSrc.jsApp
  })).pipe(gulp.dest('app/'));
});