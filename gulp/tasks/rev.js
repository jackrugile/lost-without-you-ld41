const gulp = require("gulp");
const rev = require("gulp-rev");
const config = require("../config");

/*
------------------------------------------
| rev:void (-)
------------------------------------------ */
gulp.task("rev", gulp.series(revScripts, copySourceMaps, revStyles));

/*
------------------------------------------
| revScripts:stream
|
| Revs scripts.
------------------------------------------ */
function revScripts(){
  return gulp.src(config.dev + "/scripts/*.js")
    .pipe(rev())
    .pipe(gulp.dest(config.prod + "/scripts/"))
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.prod + "/scripts/"));
}

/*
------------------------------------------
| copySourceMaps:void (-)
|
| Copy source maps.
------------------------------------------ */
function copySourceMaps(){
  return gulp.src([config.dev + "/scripts/*.map"])
    .pipe(gulp.dest(config.prod + "/scripts/"))
}

/*
------------------------------------------
| revStyles:stream
|
| Revs styles.
------------------------------------------ */
function revStyles(){
  return gulp.src(config.dev + "/css/*.css")
    .pipe(rev())
    .pipe(gulp.dest(config.prod + "/css/"))
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.prod + "/css/"));
}
