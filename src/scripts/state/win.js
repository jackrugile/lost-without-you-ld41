const BaseState = require('./base');

class WinState extends BaseState {

  constructor(game, name) {
    super(game, name);
  }

  setupDOM() {
    super.setupDOM();
  }

  observe() {
    super.observe();
    this.dom.state.addEventListener('click', (e) => this.onClick(e));
  }

  onClick() {
    this.game.stateManager.set('menu');
  }

  activate() {
    super.activate();
    console.log(this.game.lastLevelPlayed, this.game.lastLevelTime);
  }

  update() {
    super.update();
  }

}

module.exports = WinState;
