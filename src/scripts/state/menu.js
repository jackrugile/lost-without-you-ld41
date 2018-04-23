const BaseState = require('./base');

class MenuState extends BaseState {

  constructor(game, name) {
    super(game, name);
  }

  setupDOM() {
    super.setupDOM();
    this.dom.levels = document.querySelectorAll('.state-menu-level');

    this.dom.level1 = document.querySelector('.state-menu-level-1');
    this.dom.level2 = document.querySelector('.state-menu-level-2');
    this.dom.level3 = document.querySelector('.state-menu-level-3');
    this.dom.level4 = document.querySelector('.state-menu-level-4');

    this.dom.level1Time = document.querySelector('.state-menu-level-1-time');
    this.dom.level2Time = document.querySelector('.state-menu-level-2-time');
    this.dom.level3Time = document.querySelector('.state-menu-level-3-time');
    this.dom.level4Time = document.querySelector('.state-menu-level-4-time');
  }

  observe() {
    super.observe();
    for(let i = 0, len = this.dom.levels.length; i < len; i++) {
      let levelElem = this.dom.levels[i];
      let name = levelElem.getAttribute('data-name');
      levelElem.addEventListener('click', () => {
        if(this.env.storage.get(name).available || location.href.indexOf('debug') > -1) {
          this.game.sounds.button.play();
          this.game.currentLevel = name;
          if(name === 'level1') {
            this.game.stateManager.set('instructions');
          } else {
            this.game.stateManager.set('play');
          }
        }
      });
    }
  }

  activate() {
    super.activate();
    this.updateLevelDOM();
  }

  updateLevelDOM() {
    let level1 = this.env.storage.get('level1');
    if(level1.available) {
      this.dom.level1.classList.add('state-menu-level-available');
    } else {
      this.dom.level1.classList.remove('state-menu-level-available');
    }
    if(level1.beaten) {
      this.dom.level1.classList.add('state-menu-level-beaten');
    } else {
      this.dom.level1.classList.remove('state-menu-level-beaten');
    }
    if(level1.bestTime) {
      this.dom.level1Time.textContent = this.utils.msToString(level1.bestTime);
    }

    let level2 = this.env.storage.get('level2');
    if(level2.available) {
      this.dom.level2.classList.add('state-menu-level-available');
    } else {
      this.dom.level2.classList.remove('state-menu-level-available');
    }
    if(level2.beaten) {
      this.dom.level2.classList.add('state-menu-level-beaten');
    } else {
      this.dom.level2.classList.remove('state-menu-level-beaten');
    }
    if(level2.bestTime) {
      this.dom.level2Time.textContent = this.utils.msToString(level2.bestTime);
    }

    let level3 = this.env.storage.get('level3');
    if(level3.available) {
      this.dom.level3.classList.add('state-menu-level-available');
    } else {
      this.dom.level3.classList.remove('state-menu-level-available');
    }
    if(level3.beaten) {
      this.dom.level3.classList.add('state-menu-level-beaten');
    } else {
      this.dom.level3.classList.remove('state-menu-level-beaten');
    }
    if(level3.bestTime) {
      this.dom.level3Time.textContent = this.utils.msToString(level3.bestTime);
    }

    let level4 = this.env.storage.get('level4');
    if(level4.available) {
      this.dom.level4.classList.add('state-menu-level-available');
    } else {
      this.dom.level4.classList.remove('state-menu-level-available');
    }
    if(level4.beaten) {
      this.dom.level4.classList.add('state-menu-level-beaten');
    } else {
      this.dom.level4.classList.remove('state-menu-level-beaten');
    }
    if(level4.bestTime) {
      this.dom.level4Time.textContent = this.utils.msToString(level4.bestTime);
    }
  }

  update() {
    super.update();
    if(!this.isActive) {
      return;
    }
  }

}

module.exports = MenuState;
