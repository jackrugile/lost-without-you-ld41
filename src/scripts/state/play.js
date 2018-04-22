const BaseState = require('./base');

class PlayState extends BaseState {

  constructor(game, name) {
    super(game, name);
  }

  activate() {
    super.activate();
    this.reset();
  }

  reset() {
    this.game.levelManager.set(this.game.currentLevel);
    this.switchTick = 0;
    this.switchTickMax = 60 * 5;

    this.game.heroA.setActive(true);
    this.game.activeHero = this.game.heroA;
  }

  setupDOM() {
    super.setupDOM();
  }

  switchHero() {
    if(!this.isActive) {
      return;
    }
    if(this.game.heroA.isActive) {
      this.game.heroB.setActive(true);
      this.game.heroA.setActive(false);
      this.game.activeHero = this.game.heroB;
    } else {
      this.game.heroA.setActive(true);
      this.game.heroB.setActive(false);
      this.game.activeHero = this.game.heroA;
    }
  }

  update() {
    super.update();
    if(!this.isActive) {
      return;
    }
    this.switchTick++;
    if(this.switchTick >= this.switchTickMax) {
      this.switchHero();
      this.switchTick = 0;
    }
  }

}

module.exports = PlayState;
