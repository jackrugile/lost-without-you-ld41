const BaseLevel = require('./base');
const Level4Data = require('../data/level4.txt');

class Level4 extends BaseLevel {

  constructor(game, name) {
    super(game, name);

    this.maze = Level4Data;
  }

  update() {
    super.update();
  }

}

module.exports = Level4;
