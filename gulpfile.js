'use strict';

//improved require()
var path = '';
function r (module) {
	return require( path + module);
}




// Include gulp
var gulp = r('gulp');
var runSequence = r('run-sequence');
var del = r('del');

var concat = r('gulp-concat');
var uglify = r('gulp-uglify');
var rename = r('gulp-rename');
var sass = r('gulp-sass');
var minifyCSS = r('gulp-minify-css');
var autoprefixer = r('gulp-autoprefixer');
var jade = r('gulp-jade');
var stripDebug = r('gulp-strip-debug');
var beautify = r('gulp-jsbeautify');
var todo = require('gulp-todo');

//mmm image stuff
var imagemin = r('gulp-imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var cache = r('gulp-cache');

//user facing conveniences
var notify = r("gulp-notify");
var watch = r('gulp-watch');














//js processing
var scriptsSRC = [
					'src/scripts/prepend/**/*.js',
					'src/scripts/main.js',
					'src/scripts/append/**/*.js',
					'!src/scripts/**/*--ignore.js'
				];
gulp.task('scripts', function() {
	gulp.src(scriptsSRC)
		.pipe(concat('main.js'))
			.pipe(gulp.dest('build/js'))
			.pipe(stripDebug())
			.pipe(rename({suffix: '.min'}))
			.pipe(uglify())
			.pipe(gulp.dest('deploy'))
			.pipe(notify({ title: 'JS Concatenated', message: 'All looks good.', onLast: true }));
});
gulp.task('scripts:todo', function() {
	gulp.src(scriptsSRC, { base: 'src/' })
			.pipe(todo({ fileName: 'scripts-todo.md' }))
			.pipe(gulp.dest('todo/'));
});
gulp.task('scripts:clean', function(cb) {
	del(['build/js/*', 'deploy/js/*'], cb);
});
gulp.task('scripts:build', function (cb) {
	runSequence('scripts:clean', 'scripts', cb);
});


//css processing
var scssSRC = ['src/scss/**/*.scss']
gulp.task('scss', function () {
	gulp.src(scssSRC)
		.pipe(sass({ style: 'expanded'}))
		.pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9', 'ios 6', 'android 4'],
            cascade: false
        }))
        .pipe(gulp.dest('build/css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('deploy'))
		.pipe(notify({ title: 'CSS Compiled', message: 'Look at dat css.', onLast: true }));
});
gulp.task('scss:todo', function() {
	gulp.src(scssSRC, { base: 'src/' })
			.pipe(todo({ fileName: 'scss-todo.md' }))
			.pipe(gulp.dest('todo/'));
});
gulp.task('scss:clean', function(cb) {
	del(['build/css/*', 'deploy/css/*'], cb);
});
gulp.task('scss:build', function (cb) {
	runSequence('scss:clean', ['scss'], cb);
});


//jade processing
var jadeSRC = [
				'src/jade/**/*.jade',
				'!src/jade/inc/**/*.jade',
				'!src/jade/templates/**/*.jade'
			];
gulp.task('jade', function() {
	gulp.src(jadeSRC)
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('build/html'))
		.pipe(notify({ title: 'JADE Compiled', message: 'Pikachu, I choose you!', onLast: true }));
});
gulp.task('jade:todo', function() {
	gulp.src('src/jade/**/*.jade', { base: 'src/' })
			.pipe(todo({ fileName: 'jade-todo.md' }))
			.pipe(gulp.dest('todo/'));
});
gulp.task('jade:clean', function(cb) {
	del(['build/html/*'], cb);
});
gulp.task('jade:build', function (cb) {
	runSequence('jade:clean', ['jade'], cb);
});




//image compressing
gulp.task('jpg', function() {
	gulp.src(['src/img/**/*.jpg', '!src/img/**/*--ignore.jpg'])
		.pipe(imageminJpegRecompress({loops: 3})())
		.pipe(gulp.dest('build/img'))
		.pipe(notify({ title:'JPG Squisher', message: 'Everything is squished.', onLast: true }));
});
gulp.task('jpg:ignore', function() {
	gulp.src('src/img/**/*--ignore.jpg')
		.pipe(gulp.dest('build/img'));
});
gulp.task('jpg:clean', function(cb) {
	del(['build/img/**/*.jpg'], cb);
});
gulp.task('jpg:build', function (cb) {
	runSequence('jpg:clean', ['jpg', 'jpg:ignore'], cb);
});



gulp.task('watch', function() {
	// Watch scripts
	gulp.watch('src/scripts/**/*', ['scripts:build', 'scripts:todo']);
	// Watch scss
	gulp.watch('src/scss/**/*', ['scss:build', 'scss:todo']);
	// Watch jade
	gulp.watch('src/jade/**/*', ['jade:build', 'jade:todo']);
	// Watch image files
	gulp.watch('src/img/**/*.jpg', ['jpg:build']);
 });


//gulp.task('default', ['build', 'images']);
gulp.task('default', function() {
	runSequence(
		['scripts:build', 'scss:build', 'jade:build', 'jpg:build'],
		['scripts:todo', 'scss:todo'],
		'watch'
	);
});







