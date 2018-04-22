const BaseState = require('./base');
const Firefly = require('../entities/firefly');

class PlayState extends BaseState {

  constructor(game, name) {
    super(game, name);

    // setInterval(() => {
    //   this.switchHero();
    // }, 5000);

    this.setupFireflies();
  }

  setupFireflies() {
    this.fireflies = [];
    this.fireflies.push(new Firefly(this.game, new THREE.Vector3(-7.5, 0.15, 7.5)));
    this.fireflies.push(new Firefly(this.game, new THREE.Vector3(-7, 0.15, 7.5)));

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
