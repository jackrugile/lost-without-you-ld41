const BaseLevel = require('./base');
const Level3 = require('../data/level3.txt');

class GammaLevel extends BaseLevel {

  constructor(game, name) {
    super(game, name);

    this.maze = Level3;
  }

  update() {
    super.update();
  }

}

module.exports = GammaLevel;
