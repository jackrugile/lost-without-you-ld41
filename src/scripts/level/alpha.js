const BaseLevel = require('./base');

class AlphaLevel extends BaseLevel {

  constructor(game, name) {
    super(game, name);

    this.maze = `
      3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
      3 0 0 3 3 3 0 0 3 3 3 0 0 0 0 0 3 0 2 3
      3 0 0 3 3 0 0 0 0 3 3 0 0 3 3 3 3 0 0 3
      3 3 0 0 3 3 3 0 0 3 3 0 0 3 3 3 0 0 0 3
      3 3 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3
      3 3 0 0 0 0 0 3 0 0 3 3 3 3 3 3 3 3 0 3
      3 0 0 3 3 3 3 3 0 0 0 3 3 0 0 3 0 0 0 3
      3 0 0 0 0 3 3 3 0 0 0 3 0 0 3 3 3 3 3 3
      3 3 0 0 0 3 3 3 3 0 0 3 3 0 3 3 0 0 0 3
      3 3 0 0 0 3 0 0 0 0 0 0 0 0 3 3 0 0 3 3
      3 0 0 3 3 3 0 0 3 3 0 3 0 0 3 3 0 3 3 3
      3 0 0 3 0 0 0 0 3 3 0 3 0 3 3 3 0 0 0 3
      3 0 0 3 0 0 3 3 3 3 3 3 0 3 0 0 0 0 0 3
      3 3 0 0 0 0 3 3 3 3 0 0 0 0 0 3 3 0 0 3
      3 0 0 3 0 0 3 0 0 3 0 0 0 0 0 3 3 3 0 3
      3 0 3 3 3 3 3 0 0 3 3 3 0 0 3 3 0 0 0 3
      3 0 3 3 0 0 0 0 0 3 3 3 0 0 3 3 0 0 0 3
      3 0 0 0 0 3 0 0 0 0 0 3 0 0 3 3 3 0 0 3
      3 1 0 0 3 3 3 3 3 0 0 0 0 0 3 3 0 0 0 3
      3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
    `;

    this.ambientLight = new THREE.AmbientLight(0x111111);
    this.game.world.scene.add(this.ambientLight);
  }

  update() {
    super.update();
  }

}

module.exports = AlphaLevel;
