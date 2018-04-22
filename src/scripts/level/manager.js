const env = require('../env.js');
const AlphaLevel = require('./alpha.js');
const BetaLevel = require('./beta.js');
const GammaLevel = require('./gamma.js');
const DeltaLevel = require('./delta.js');

class LevelManager {

  constructor(game) {
    this.env = env;
    this.game = game;
    this.levels = {
      alpha: new AlphaLevel(this.game, 'alpha'),
      beta: new BetaLevel(this.game, 'beta'),
      gamma: new GammaLevel(this.game, 'gamma'),
      delta: new DeltaLevel(this.game, 'delta')
    };
  }

  set(level) {
    if(this.current) {
      this.current.destroy();
    }
    this.build(level);
  }

  build(level) {
    this.current = this.levels[level];
    this.current.build();
  }

}

module.exports = LevelManager;
