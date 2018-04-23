const BaseState = require('./base');

class InstructionsState extends BaseState {

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
    this.game.sounds.button.play();
    this.game.stateManager.set('play');
  }

  activate() {
    super.activate();
    this.tick = 0;
    this.tickMax = 60 * 20;
  }

  update() {
    super.update();
    if(!this.isActive) {
      return;
    }
    // this.tick++;
    // if(this.tick === this.tickMax) {
    //   this.game.stateManager.set('play');
    // }
  }

}

module.exports = InstructionsState;
