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

    this.flashOpacity = 0;

    this.switchTime = 0;
    this.switchTimeMax = 6000;

    this.dom.levelTitle.textContent = `Level ${(this.game.levelManager.levelNames.indexOf(this.game.currentLevel) + 1)}`;

    this.game.isPlaying = false;
    this.game.isEnding = false;

    this.game.sounds.levelIntro.rate(0.5);
    this.game.sounds.levelIntro.play();

    this.showMaryDialog();

    this.env.eventful.trigger('play-reset');
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
    this.dom.dialog = document.querySelector('.state-play-dialog');
  }

  observe() {
    super.observe();
    this.env.eventful.on('unite', (e) => this.startEnd(e));
  }

  switchHero() {
    if(!this.isActive || this.game.isEnding) {
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
    this.game.sounds.switch.play();
  }

  showMaryDialog() {
    setTimeout(() => {
      this.game.sounds.mary.play();
    }, 1500);

    this.game.heroA.setActive(true);
    this.game.activeHero = this.game.heroA;
    this.dom.heroAWrap.classList.add('state-play-hero-wrap-active');
    this.dom.heroBWrap.classList.remove('state-play-hero-wrap-active');

    let dialog = null;
    if(this.game.currentLevel === 'level1') {
      dialog = '<span>Mary:</span> What is this place?';
    }
    if(this.game.currentLevel === 'level2') {
      dialog = '<span>Mary:</span> Where are you, Zoey?';
    }
    if(this.game.currentLevel === 'level3') {
      dialog = '<span>Mary:</span> Why are we always getting lost?';
    }
    if(this.game.currentLevel === 'level4') {
      dialog = '<span>Mary:</span> Again?! Is this real life?';
    }

    this.dom.dialog.innerHTML = dialog;
    setTimeout(() => {
      this.dom.dialog.classList.add('state-play-dialog-active');
    }, 1500);

    this.dom.dialog.classList.remove('state-play-dialog-b');
    this.dom.dialog.classList.add('state-play-dialog-a');

    setTimeout(() => {
      this.hideMaryDialog();
    }, 2500);

  }

  hideMaryDialog() {
    this.dom.dialog.classList.remove('state-play-dialog-active');

    setTimeout(() => {
      this.showZoeyDialog();
    }, 500);
  }

  showZoeyDialog() {
    setTimeout(() => {
      this.game.sounds.zoey.play();
    }, 1200);

    // setTimeout(() => {
    //   this.game.sounds.levelIntro.rate(0.7);
    //   this.game.sounds.levelIntro.play();
    // }, 750);

    this.game.heroA.setActive(false);
    this.game.heroB.setActive(true);
    this.game.activeHero = this.game.heroB;
    this.dom.heroAWrap.classList.remove('state-play-hero-wrap-active');
    this.dom.heroBWrap.classList.add('state-play-hero-wrap-active');

    let dialog = null;
    if(this.game.currentLevel === 'level1') {
      dialog = '<span>Zoey:</span> It’s so dark...';
    }
    if(this.game.currentLevel === 'level2') {
      dialog = '<span>Zoey:</span> I’m scared!';
    }
    if(this.game.currentLevel === 'level3') {
      dialog = '<span>Zoey:</span> We’ve gotta stop losing each other, Mary...';
    }
    if(this.game.currentLevel === 'level4') {
      dialog = '<span>Zoey:</span> I think I can hear you!';
    }

    this.dom.dialog.innerHTML = dialog;
    setTimeout(() => {
      this.dom.dialog.classList.add('state-play-dialog-active');
    }, 1000);

    this.dom.dialog.classList.remove('state-play-dialog-a');
    this.dom.dialog.classList.add('state-play-dialog-b');

    setTimeout(() => {
      this.hideZoeyDialog();
    }, 2500);
  }

  hideZoeyDialog() {
    this.dom.dialog.classList.remove('state-play-dialog-active');

    setTimeout(() => {
      this.startPlay();
    }, 500);
  }

  startPlay() {
    this.game.isPlaying = true;

    this.game.heroB.setActive(false);
    this.game.heroA.setActive(true);
    this.game.activeHero = this.game.heroA;
    this.dom.heroAWrap.classList.add('state-play-hero-wrap-active');
    this.dom.heroBWrap.classList.remove('state-play-hero-wrap-active');

    this.nowTime = Date.now();
    this.startTime = this.nowTime;
    this.oldTime = this.nowTime;
    this.elapsedTime = 0;
    this.deltaTime = 0;

    setTimeout(() => {
      this.game.sounds.music.stop();
      this.game.sounds.music.volume(0.3);
      this.game.sounds.music.play();
      //this.game.sounds.music.fade(0, 0.3, 500);
    }, 1200);
  }

  startEnd() {
    this.game.isEnding = true;
    this.endTick = 0;
    this.endTickMax = 60 * 1.5;
    this.game.sounds.music.fade(0.3, 0, 3000);
    //this.game.sounds.music.stop();
  }

  update() {
    super.update();
    if(!this.isActive) {
      return;
    }

    if(this.game.isPlaying) {
      this.nowTime = Date.now();
      this.deltaTime = this.nowTime - this.oldTime;
      this.elapsedTime = this.nowTime - this.startTime;
      this.oldTime = this.nowTime;
      this.dom.levelTime.textContent = this.utils.msToString(this.elapsedTime);
    }

    if(this.game.isPlaying) {
      this.switchTime += this.deltaTime;
      if(this.switchTime >= this.switchTimeMax) {
        this.switchHero();
        this.switchTime = this.switchTime - this.switchTimeMax;
      }
    }

    this.dom.heroAMeterLightBar.style.transform = `scaleX(${this.game.heroA.life})`;
    this.dom.heroBMeterLightBar.style.transform = `scaleX(${this.game.heroB.life})`;

    if(this.game.heroA.isActive) {
      this.dom.heroAMeterTimeBar.style.transform = `scaleX(${1 - this.switchTime / this.switchTimeMax})`;
      this.dom.heroBMeterTimeBar.style.transform = 'scaleX(1)';
    } else {
      this.dom.heroAMeterTimeBar.style.transform = 'scaleX(1)';
      this.dom.heroBMeterTimeBar.style.transform = `scaleX(${1 - this.switchTime / this.switchTimeMax})`;
    }

    if(this.game.isEnding) {
      this.endTick++;
      this.env.eventful.trigger('end-tick', { prog: this.endTick / this.endTickMax});
      if(this.endTick >= this.endTickMax) {
        this.game.stateManager.set('win');
      }
    }
  }

}

module.exports = PlayState;
