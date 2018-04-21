const gulp = require("gulp");
const config  = require("../config");

/*
------------------------------------------
| watch:void (-)
------------------------------------------ */
gulp.task("watch", function(){
  gulp.watch( config.watchPath + "/scripts/**/**/*.js", gulp.parallel("scripts") );
  gulp.watch( config.watchPath + "/templates/**/**/*.html", gulp.parallel("scripts") );
  gulp.watch( config.watchPath + "/styles/**/**/*.sass", gulp.parallel("styles") );
  gulp.watch( config.watchPath + "/markup/**/**/*", gulp.parallel("markup") );
  gulp.watch( config.watchPath + "/assets/**/**/*", gulp.parallel("copy") );
});
