const env = require('../env.js');
const AlphaLevel = require('./alpha.js');

class LevelManager {

  constructor(game) {
    this.env = env;
    this.game = game;
    this.levels = {
      alpha: new AlphaLevel(this.game, 'alpha')
    };
  }

  build(level) {
    this.levels[level].build();
  }

}

module.exports = LevelManager;
