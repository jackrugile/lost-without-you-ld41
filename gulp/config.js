const path = require("path");

module.exports = {
  "port": "4000", // Port to run on
  "root": path.resolve("./public"), // Where to serve from
  "dev": "./public", // Directory for dev assets to compile to
  "prod": "tmp", // Directory for tmp build assets to compile to
  "sources": [], // Empty holder
  "assetPath": "./src", // Source
  "watchPath": "./src", // Watch source

  // Build specific settings
  "build": {
    "browserlist": ["> 0.5%", "last 2 versions", "Firefox ESR", "Opera 12.1"]
  },

  // AWS settings
  "aws": {
    "staging": {
      "identity": "",
      "bucket": "",
      "region": "",
      "cloudfrontID": ""
    },
    "production": {
      "identity": "",
      "bucket": "",
      "region": "",
      "cloudfrontID": ""
    }
  },

  // Meta for frontend static templates
  "meta": {
    "google_analytics": "5693606-7",
    "site_title": "Lost Without You",
    "site_description": "Lost Without You is a turn-based action puzzler. Help two friends find each other in the dark before they run out of light. Alternate between each friend to navigate through the darkness in a mysterious labyrinth. Can you help them escape?",
    "site_keywords": "ludum dare, game, lost without you, indie game, game jam",
    "robots": () => {
      if( process.env.NODE_ENV == "production" ) {
        return "<meta name='robots' content='index, follow'>";
      } else {
        return "<meta name='robots' content='noindex, nofollow'>";
      }
    }
  }
};
