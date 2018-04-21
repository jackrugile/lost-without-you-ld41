const gulp = require("gulp");
const gutil = require("gulp-util");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const config = require("../config");
const scriptManifest = require("../utils/script-manifest");
const handleErrors = require("../utils/handle-errors");

let manifest = {};
let webpackConfig = {};
let srcs = [];

/*
------------------------------------------
| scripts:void (-)
------------------------------------------ */
gulp.task("scripts", gulp.series(setConfiguration, getManifest, compileScripts));

/*
------------------------------------------
| setConfiguration:webpackConfiguation
|
| Determines the current configuration
| to load for webpack based on env
------------------------------------------ */
function setConfiguration(done){
  webpackConfig = process.env.NODE_ENV == "production" ? require("../webpack/webpack.prod.js") : require("../webpack/webpack.dev.js");
  done();
}

/*
------------------------------------------
| getManifest:obj
|
| Gets the current manifest of scripts to load.
| Resolves as a promise
------------------------------------------ */
function getManifest(done){
  return new Promise( (resolve, reject) => {
    scriptManifest.sources( ( sources ) => {
      for( let i = 0; i < sources.length; i++ ){
        let _s = sources[i];
        manifest[_s] = config.assetPath + "/scripts/" + _s + ".js";
        srcs.push(config.assetPath + "/scripts/" + _s + ".js");
      }
      resolve();
    });
  });
}

/*
------------------------------------------
| compileScripts:promise
|
| Compiles scripts using webpackConfig.
| Resolves as a promise
------------------------------------------ */
function compileScripts(){
  // Set the entry based on manifest
  webpackConfig.entry = manifest;

  return new Promise( (resolve, reject) => {
    gulp.src(srcs, {since: gulp.lastRun(compileScripts)} )
      .pipe(webpackStream(webpackConfig, null, (err, stats) => {
          logResults(stats);
          resolve();
        }
      ))
      .on("error", handleErrors)
      .pipe(gulp.dest( config.dev + "/scripts" ))
  });
}

/*
------------------------------------------
| logResults:void (-)
|
| Logs out the return from webpack build.
| Indicates budles created and weights.
------------------------------------------ */
function logResults(stats){

  // Default options inside of webpack
  let defaultStatsOptions = {
    colors: gutil.colors.supportsColor,
    timings: false,
    chunks: false,
    chunkModules: false,
    modules: false,
    children: true,
    version: true,
    cached: false,
    cachedAssets: false,
    reasons: false,
    source: false,
    errorDetails: false
  },
  statsOptions = stats || {};

  // Loop the keys and define
  Object.keys(defaultStatsOptions).forEach( (key) => {
    if (typeof statsOptions[key] === "undefined") {
      statsOptions[key] = defaultStatsOptions[key];
    }
  });

  // Log out
  gutil.log(stats.toString(statsOptions));
}
