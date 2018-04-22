const BaseState = require('./base');

class MenuState extends BaseState {

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
    this.game.stateManager.set('play');
  }

  update() {
    super.update();
  }

}

module.exports = MenuState;
