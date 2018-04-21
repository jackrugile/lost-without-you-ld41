const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const config = require("../config");

/*
------------------------------------------
| asset-minify:void (-)
------------------------------------------ */
gulp.task("asset-minify", gulp.series(svg));

/*
------------------------------------------
| svg:stream
|
| Minify and compress svg.
------------------------------------------ */
function svg(){
  return gulp.src([ config.assetPath + "/assets/**/*" ])
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest(config.dev + '/'))
}
