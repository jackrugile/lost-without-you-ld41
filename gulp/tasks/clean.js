const gulp = require("gulp");
const del = require("del");
const config = require("../config");

/*
------------------------------------------
| clean:void (-)
------------------------------------------ */
gulp.task("clean", gulp.series(remove));

/*
------------------------------------------
| del:void (-)
|
| Deletes everything in specified directories.
------------------------------------------ */
function remove(done){
  return del( config.dev, { force: true });
}
