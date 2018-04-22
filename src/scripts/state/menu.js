const BaseState = require('./base');

class MenuState extends BaseState {

  constructor(game, name) {
    super(game, name);
  }

  setupDOM() {
    super.setupDOM();
    this.dom.levels = document.querySelectorAll('.state-menu-level');
  }

  observe() {
    super.observe();
    for(let i = 0, len = this.dom.levels.length; i < len; i++) {
      let levelElem = this.dom.levels[i];
      let name = levelElem.getAttribute('data-name');
      levelElem.addEventListener('click', () => {
        this.game.currentLevel = name;
        this.game.stateManager.set('play');
      });
    }
  }

  update() {
    super.update();
  }

}

module.exports = MenuState;
