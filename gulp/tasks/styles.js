const gulp = require("gulp");
const path = require("path");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sassLint = require("gulp-sass-lint");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const handleErrors = require("../utils/handle-errors");
const config = require("../config");

/*
------------------------------------------
| styles:void (-)
------------------------------------------ */
gulp.task("styles", gulp.series(lint, build, minify));

/*
------------------------------------------
| lint:stream
|
| Lint the sass.
------------------------------------------ */
function lint(){
  return gulp.src( config.assetPath + "/styles/**/*.sass")
    .pipe(sassLint({
      options: {
        configFile: path.resolve(__dirname,"..","..") + "/.sass-lint.yml",
        formatter: "stylish"
      }
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
}

/*
------------------------------------------
| build:stream
|
| Build the sass into css with sourcemaps
------------------------------------------ */
function build(){
  return gulp.src( config.assetPath + "/styles/**/*.sass")
    .pipe(sourcemaps.init())
    .pipe(sass({"style": "expanded"}))
    .on("error", handleErrors)
    .pipe(autoprefixer({
      "browsers": config.build.browserlist,
      "cascade": false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest( config.dev + "/css" ))
}

/*
------------------------------------------
| minify:stream
|
| Check if production and minify.
| If not return stream.
------------------------------------------ */
function minify(){
  let minify = gulp.src(config.dev + "/css/*.css");
  if( process.env.NODE_ENV == "production" ){
    minify = gulp.src(config.dev + "/css/*.css")
      .pipe(cleanCSS())
      .pipe(gulp.dest(config.dev + "/css"))
  }

  return minify;
}
