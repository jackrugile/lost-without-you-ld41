const gulp = require("gulp");

/*
------------------------------------------
| dist:void (-)
------------------------------------------ */
gulp.task("dist", gulp.series("clean", "scripts", "styles",  "markup",  "rev", "replace", "clean", "asset-minify", "cleanup"));
