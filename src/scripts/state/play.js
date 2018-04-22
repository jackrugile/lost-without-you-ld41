const BaseState = require('./base');

class PlayState extends BaseState {

  constructor(game, name) {
    super(game, name);

    setInterval(() => {
      this.switchHero();
    }, 5000);
  }

  switchHero() {
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
  }

}

module.exports = PlayState;
