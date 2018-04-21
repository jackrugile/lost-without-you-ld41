const gulp = require("gulp");
const del = require("del");
const config = require("../config");

/*
------------------------------------------
| cleanup:void (-)
------------------------------------------ */
gulp.task("cleanup", gulp.series(copyProd, destroy));

/*
------------------------------------------
| copyProd:void (-)
|
| Copy files from TMP.
------------------------------------------ */
function copyProd(){
  return gulp.src([
    config.prod + "/**/*",
    "!" + config.prod + "/**/*.json"
  ])
  .pipe(gulp.dest( config.dev ))
}

/*
------------------------------------------
| destroy:destruction (-)
|
| Copies everything from TMP while disting,
| but leaves any manifests and other junk.
|
| Once moved delete the directory.
------------------------------------------ */
function destroy(done){
  return del(config.prod,{ force: true });
}
