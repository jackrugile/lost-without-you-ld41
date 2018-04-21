const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const browserSyncReuseTab = require("browser-sync-reuse-tab")(browserSync);
const config = require("../config");

/*
------------------------------------------
| server:server (-)
|
| Sets up a browsersync server.
| Will attempt to focus on already open windows
| if the app is shut down and restarted.
------------------------------------------ */
gulp.task("server", function() {
  return browserSync.init({
    server: {
      baseDir: config.root,
    },
    files: [
      config.dev + "/css/**/*.css",
      config.dev + "/scripts/**/*.js"],
    port: config.port,
    open: false,
    ghostMode: false
  }, browserSyncReuseTab);
});
