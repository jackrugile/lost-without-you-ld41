const BaseState = require('./base');
const LevelManager = require('../level/manager');

class PlayState extends BaseState {

  constructor(game, name) {
    super(game, name);

    this.levelManager = new LevelManager(this.game);
    this.levelManager.build('alpha');
  }

  update() {
    super.update();
  }

}

module.exports = PlayState;
