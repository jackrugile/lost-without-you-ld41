const BaseLevel = require('./base');
const Level2 = require('../data/level2.txt');

class BetaLevel extends BaseLevel {

  constructor(game, name) {
    super(game, name);

    this.maze = Level2;
  }

  update() {
    super.update();
  }

}

module.exports = BetaLevel;
