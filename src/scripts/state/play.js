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

    this.switchTime = 0;
    this.switchTimeMax = 6000;

    this.game.heroA.setActive(true);
    this.game.activeHero = this.game.heroA;
    this.dom.heroAWrap.classList.add('state-play-hero-wrap-active');
    this.dom.heroBWrap.classList.remove('state-play-hero-wrap-active');

    this.nowTime = Date.now();
    this.startTime = this.nowTime;
    this.oldTime = this.nowTime;
    this.elapsedTime = 0;
    this.deltaTime = 0;

    this.dom.levelTitle.textContent = `Level ${(this.game.levelManager.levelNames.indexOf(this.game.currentLevel) + 1)}`;
  }

  setupDOM() {
    super.setupDOM();

    this.dom.levelTitle = document.querySelector('.state-play-level-title');
    this.dom.levelTime = document.querySelector('.state-play-level-time');
    this.dom.heroAWrap = document.querySelector('.state-play-hero-a-wrap');
    this.dom.heroBWrap = document.querySelector('.state-play-hero-b-wrap');
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
      this.dom.heroAWrap.classList.remove('state-play-hero-wrap-active');
      this.dom.heroBWrap.classList.add('state-play-hero-wrap-active');
    } else {
      this.game.heroA.setActive(true);
      this.game.heroB.setActive(false);
      this.game.activeHero = this.game.heroA;
      this.dom.heroAWrap.classList.add('state-play-hero-wrap-active');
      this.dom.heroBWrap.classList.remove('state-play-hero-wrap-active');
    }
  }

  update() {
    super.update();
    if(!this.isActive) {
      return;
    }

    this.nowTime = Date.now();
    this.deltaTime = this.nowTime - this.oldTime;
    this.elapsedTime = this.nowTime - this.startTime;
    this.oldTime = this.nowTime;
    this.dom.levelTime.textContent = this.utils.msToString(this.elapsedTime);

    this.switchTime += this.deltaTime;
    if(this.switchTime >= this.switchTimeMax) {
      this.switchHero();
      this.switchTime = this.switchTime - this.switchTimeMax;
    }

    this.dom.heroAMeterLightBar.style.transform = `translate3d(${(1 - this.game.heroA.life) * -100}%, 0, 0)`;
    this.dom.heroBMeterLightBar.style.transform = `translate3d(${(1 - this.game.heroB.life) * -100}%, 0, 0)`;

    if(this.game.heroA.isActive) {
      this.dom.heroAMeterTimeBar.style.transform = `translate3d(${(this.switchTime / this.switchTimeMax) * -100}%, 0, 0)`;
      this.dom.heroBMeterTimeBar.style.transform = 'translate3d(0%, 0, 0)';
    } else {
      this.dom.heroAMeterTimeBar.style.transform = 'translate3d(0%, 0, 0)';
      this.dom.heroBMeterTimeBar.style.transform = `translate3d(${(this.switchTime / this.switchTimeMax) * -100}%, 0, 0)`;
    }
  }

}

module.exports = PlayState;
