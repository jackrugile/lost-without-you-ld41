const BaseState = require('./base');

class WinState extends BaseState {

  constructor(game, name) {
    super(game, name);
  }

  setupDOM() {
    super.setupDOM();
    this.dom.title = document.querySelector('.state-win-title');
    this.dom.info = document.querySelector('.state-win-info');
  }

  observe() {
    super.observe();
    this.dom.state.addEventListener('click', (e) => this.onClick(e));
  }

  onClick() {
    this.game.sounds.button.play();
    this.game.stateManager.set('menu');
  }

  activate() {
    super.activate();
    this.tick = 0;
    this.tickMax = 60 * 5;

    // set level corresponding dialogue
    let newTitle = null;
    if(this.game.lastLevelPlayed === 'level1') {
      newTitle = 'Together, <span>Mary</span> and <span>Zoey</span> were able to find their way out.';
    }
    if(this.game.lastLevelPlayed === 'level2') {
      newTitle = '<span>Mary</span> and <span>Zoey</span> escaped safely, once again.';
    }
    if(this.game.lastLevelPlayed === 'level3') {
      newTitle = '<span>Mary</span> and <span>Zoey</span>, now feeling skilled at navigating dark, scary places, were able to reunite once again.';
    }
    if(this.game.lastLevelPlayed === 'level4') {
      newTitle = 'Overcoming their hopelessness, <span>Mary</span> and <span>Zoey</span> found each other once more and were finally able to conquer the darkness... or did they?';
    }
    this.dom.title.innerHTML = newTitle;

    // set info
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
    // this.tick++;
    // if(this.tick === this.tickMax) {
    //   this.game.stateManager.set('menu');
    // }
  }

}

module.exports = WinState;
