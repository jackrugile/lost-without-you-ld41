const BaseState = require('./base');

class LoseState extends BaseState {

  constructor(game, name) {
    super(game, name);
  }

  setupDOM() {
    super.setupDOM();
    this.dom.title = document.querySelector('.state-lose-title');
    this.dom.info = document.querySelector('.state-lose-info');
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
      newTitle = 'Mary and Zoey lost their light and couldn’t<br> find each other, or their way out.';
    }
    if(this.game.lastLevelPlayed === 'level2') {
      newTitle = 'As their light source depleted, so did <br>Zoey and Mary’s chance to survive.';
    }
    if(this.game.lastLevelPlayed === 'level3') {
      newTitle = 'Mary and Zoey were overwhelmed by the <br>darkness and couldn’t find safety.';
    }
    if(this.game.lastLevelPlayed === 'level4') {
      newTitle = 'Alone and lost in the dark, Mary and Zoey were unable to navigate to safety, and succumbed to this scary, dark place.';
    }
    this.dom.title.innerHTML = newTitle;

    // set info
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
    // this.tick++;
    // if(this.tick === this.tickMax) {
    //   this.game.stateManager.set('menu');
    // }
  }

}

module.exports = LoseState;
