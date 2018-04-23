const BaseLevel = require('./base');
const Level4 = require('../data/level4.txt');

class DeltaLevel extends BaseLevel {

  constructor(game, name) {
    super(game, name);

    this.maze = Level4;
  }

  update() {
    super.update();
  }

}

module.exports = DeltaLevel;
