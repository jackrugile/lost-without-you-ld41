const BaseState = require('./base');

class LoseState extends BaseState {

  constructor(game, name) {
    super(game, name);
  }

  setupDOM() {
    super.setupDOM();
    this.dom.info = document.querySelector('.state-lose-info');
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
    this.tick = 0;
    this.tickMax = 60 * 5;
    this.dom.info.innerHTML = `Level ${this.game.levelManager.levelNames.indexOf(this.game.lastLevelPlayed) + 1} Failed<br><span>${this.utils.msToString(this.game.lastLevelTime)}</span>`;

    let levelStorage = this.env.storage.get(this.game.lastLevelPlayed);
    levelStorage.timesPlayed++;
    this.env.storage.set(this.game.lastLevelPlayed, levelStorage);
  }

  update() {
    super.update();
    if(!this.isActive) {
      return;
    }
    this.tick++;
    console.log(this.tick);
    if(this.tick === this.tickMax) {
      this.game.stateManager.set('menu');
    }
  }

}

module.exports = LoseState;
