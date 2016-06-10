//引入组件
var gulp = require('gulp'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev-append');

//less任务：编译压缩
gulp.task('less',function(){
    var lessSrc = './dev/css/*.less',
        lessDst = './dist/css';

    return gulp.src(lessSrc)
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest(lessDst));
});
//js任务
gulp.task('js',function () {
    var jsSrc = './dev/js/*.js',
        jsDst ='./dist/js';

    return gulp.src(jsSrc)
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(uglify())
        .pipe(gulp.dest(jsDst));
});
//版本号
gulp.task('rev',function(){
    return gulp.src('./dev/index.html')
        .pipe(rev())
        .pipe(gulp.dest('./dev'));
});
//watch
gulp.task('watch',function(){
    //less,rev
    gulp.watch('./dev/css/*.less', ['less','rev']);
    //js,rev
    gulp.watch('./dev/js/*.js', ['js','rev']);
});

// 默认预设任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default',function(){
    gulp.start('less','js','rev','watch');
});

