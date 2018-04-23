const BaseState = require('./base');

class WinState extends BaseState {

  constructor(game, name) {
    super(game, name);
  }

  setupDOM() {
    super.setupDOM();
    this.dom.info = document.querySelector('.state-win-info');
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
    this.dom.info.innerHTML = `Level ${this.game.levelManager.levelNames.indexOf(this.game.lastLevelPlayed) + 1} Complete<br><span>${this.utils.msToString(this.game.lastLevelTime)}</span>`;

    // increase times played
    let levelStorage = this.env.storage.get(this.game.lastLevelPlayed);
    levelStorage.timesPlayed++;
    this.env.storage.set(this.game.lastLevelPlayed, levelStorage);

    // set level to beaten status
    levelStorage = this.env.storage.get(this.game.lastLevelPlayed);
    levelStorage.beaten = true;
    this.env.storage.set(this.game.lastLevelPlayed, levelStorage);

    // check the best time
    levelStorage = this.env.storage.get(this.game.lastLevelPlayed);
    if(levelStorage.bestTime) {
      levelStorage.bestTime = Math.min(this.game.lastLevelTime, levelStorage.bestTime);
    } else {
      levelStorage.bestTime = this.game.lastLevelTime;
    }
    this.env.storage.set(this.game.lastLevelPlayed, levelStorage);

    // set next level to available
    levelStorage = this.env.storage.get(this.game.lastLevelPlayed);
    let currIndex = levelStorage.index;
    if(currIndex < 3) {
      let nextIndex = currIndex + 2;
      let nextLevelStorage = this.env.storage.get(`level${nextIndex}`);
      nextLevelStorage.available = true;
      this.env.storage.set(`level${nextIndex}`, nextLevelStorage);
    }
  }

  update() {
    super.update();
    if(!this.isActive) {
      return;
    }
    this.tick++;
    if(this.tick === this.tickMax) {
      this.game.stateManager.set('menu');
    }
  }

}

module.exports = WinState;
