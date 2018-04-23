const BaseLevel = require('./base');
const Level2Data = require('../data/level2.txt');

class Level2 extends BaseLevel {

  constructor(game, name) {
    super(game, name);

    this.maze = Level2Data;
  }

  update() {
    super.update();
  }

}

module.exports = Level2;
