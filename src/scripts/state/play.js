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

    // set level title
    let levelNames = [
      'alpha',
      'beta',
      'gamma',
      'delta'
    ];
    this.dom.levelTitle.textContent = `Level ${(levelNames.indexOf(this.game.currentLevel) + 1)}`;
  }

  setupDOM() {
    super.setupDOM();

    this.dom.levelTitle = document.querySelector('.state-play-level-title');
    this.dom.levelTime = document.querySelector('.state-play-level-time');
    this.dom.heroAWrap = document.querySelector('.state-play-state-play-hero-a-wrap');
    this.dom.heroBWrap = document.querySelector('.state-play-state-play-hero-b-wrap');
    this.dom.heroAMeterLightBar = document.querySelector('.state-play-hero-a-meter-light-bar');
    this.dom.heroBMeterLightBar = document.querySelector('.state-play-hero-b-meter-light-bar');
    this.dom.heroAMeterTimeBar = document.querySelector('.state-play-hero-a-meter-time-bar');
    this.dom.heroBMeterTimeBar = document.querySelector('.state-play-hero-b-meter-time-bar');
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
