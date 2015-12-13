var gulp = require("gulp");
var ts = require("gulp-typescript");
var shell = require("gulp-shell");
var clean = require('gulp-clean');
var glob = require("glob");
var gulpsync = require('gulp-sync')(gulp);
//var colony = require("js-to-lua");

gulp.task("test", function(){
	var stuff = glob.sync("src/**/*.js");
	console.log(stuff);
});

var compilerPath = "node node_modules/js-to-lua/colony.js";


gulp.task('clean-js', function () {
	return gulp.src('src/**/*.js', {read: false})
		.pipe(clean());
});

gulp.task('clean-lua', function () {
	return gulp.src('src/**/*.lua', {read: false})
		.pipe(clean());
});

gulp.task('clean-dist', function () {
	return gulp.src('dist/**/*.*', {read: false})
		.pipe(clean());
});

gulp.task("ts", function(){
	return gulp.src('src/**/*.ts')
    	.pipe(ts({
		module: 'commonjs',
		target: 'ES5'
		}))
    	.pipe(gulp.dest('src'));
});

gulp.task("lua", shell.task(
	glob.sync("src/**/*.js").map(function(path){
		return compilerPath + " " + path;// + " " + path.replace("src/", "bin/");
	})
	));
	
gulp.task("dist-lib", function(){
	return gulp.src("node_modules/js-to-lua/colony-lib.lua")
		.pipe(gulp.dest("dist"));
});

gulp.task("dist-opt", function(){
	return gulp.src("src/**/*.lua")
		.pipe(gulp.dest("dist"));
});

gulp.task("clean", ["clean-lua", "clean-js", "clean-dist"]);
gulp.task("dist", ["dist-lib", "dist-opt"]);

gulp.task("default", gulpsync.sync(['clean', 'ts', 'lua', 'dist']));
