const gulp  = require("gulp");
const glob  = require("glob");
const path  = require("path");
const tasks = glob.sync(path.join(__dirname, "./tasks/*.js"));
const args  = process.argv.slice(2);

process.env.NODE_ENV = args[1] === "-e" && args[2] === "production" ? "production" : "development";

tasks.forEach( (task) => {
  require(task);
});
