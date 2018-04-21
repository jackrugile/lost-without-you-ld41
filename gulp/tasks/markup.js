const gulp = require("gulp");
const fs = require("fs");
const mustache = require("gulp-mustache");
const config = require("../config");

/*
------------------------------------------
| markup:void (-)
------------------------------------------ */
gulp.task("markup", gulp.series(compileHTML));

/*
------------------------------------------
| compileHTML:stream
|
| Compiles markup in mustache to static HTML.
------------------------------------------ */
function compileHTML(){
  return gulp.src(config.assetPath + "/markup/**/*.html")
    .pipe(mustache(config.meta, {
      extension: ".html"
    }))
    .pipe(gulp.dest( config.dev ))
}
