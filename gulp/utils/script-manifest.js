const fs = require("fs");
const config = require("../config");

module.exports = {
  sources: function( callback ){
    var _sources = [];

    fs.readdir(config.assetPath + "/scripts/", function(err, files) {
      files.forEach( function(file) {
        if( file.indexOf(".js") > 0 ){
          _sources.push(file.replace(".js", ""))
        }
      });

      callback( _sources );
    })
  }
}
