const gulp = require("gulp");
const revReplace = require("gulp-rev-replace");
const config = require("../config");

/*
------------------------------------------
| rev:void (-)
------------------------------------------ */
gulp.task("replace", gulp.series(replaceRefs));

/*
------------------------------------------
| replace:stream
|
| Replaces all references to rev"d files in
| static compiled html.
------------------------------------------ */
function replaceRefs(){
  let scripts_manifest = gulp.src(config.prod + "/scripts/rev-manifest.json");
  let css_manifest = gulp.src(config.prod + "/css/rev-manifest.json");
  return new Promise( (resolve, reject) => {
    gulp.src([config.dev + "/**/*.html"])
      .pipe(revReplace({manifest: scripts_manifest}))
      .pipe(revReplace({manifest: css_manifest}))
      .pipe(gulp.dest(config.prod))
      .on('finish', () => {
        resolve();
      })
  })
}
