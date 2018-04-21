const gulp  = require("gulp");
const hub   = require("gulp-hub")(["tasks/*.js"]);

gulp.registry(hub);

/*
------------------------------------------
| default:void (-)
------------------------------------------ */
gulp.task("default", gulp.series("clean", "scripts", "styles", "markup", "copy", gulp.parallel("watch", "server")));
