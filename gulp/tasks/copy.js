const gulp = require("gulp");
const config  = require("../config");

/*
------------------------------------------
| copy:void (-)
------------------------------------------ */
gulp.task("copy", gulp.series(copyFiles));

/*
------------------------------------------
| copy:stream (-)
|
| Copies fiels from the specified below.
------------------------------------------ */
function copyFiles(){
  return gulp.src([
    config.assetPath + "/assets/**/*"
  ])
  .pipe(gulp.dest(config.dev));
}
