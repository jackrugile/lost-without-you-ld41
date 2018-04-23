const BaseLevel = require('./base');
const Level3Data = require('../data/level3.txt');

class Level3 extends BaseLevel {

  constructor(game, name) {
    super(game, name);

    this.maze = Level3Data;
  }

  update() {
    super.update();
  }

}

module.exports = Level3;
