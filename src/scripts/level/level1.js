const BaseLevel = require('./base');
const Level1Data = require('../data/level1.txt');

class Level1 extends BaseLevel {

  constructor(game, name) {
    super(game, name);

    this.maze = Level1Data;
  }

  update() {
    super.update();
  }

}

module.exports = Level1;
