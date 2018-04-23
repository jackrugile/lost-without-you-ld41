const BaseLevel = require('./base');
const Level1 = require('../data/level1.txt');

class AlphaLevel extends BaseLevel {

  constructor(game, name) {
    super(game, name);

    this.maze = Level1;
  }

  update() {
    super.update();
  }

}

module.exports = AlphaLevel;
