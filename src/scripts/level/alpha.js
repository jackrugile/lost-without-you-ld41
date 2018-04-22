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

    // this.pointLight1 = new THREE.PointLight(0xffffff, 0.75, 10, 2);
    // this.pointLight1.castShadow = false;
    // this.game.world.scene.add(this.pointLight1);

    // this.pointLight2 = new THREE.PointLight(0xffffff, 0.25, 10, 2);
    // this.pointLight2.castShadow = true;
    // this.game.world.scene.add(this.pointLight2);
  }

  update() {
    super.update();

    // let timeOffset = this.game.time.em * 0.0005;
    // let x = Math.cos(timeOffset) * this.mazeCols / 4;
    // let y = 5;
    // let z = Math.sin(timeOffset) * this.mazeCols / 4;
    // this.pointLight1.position.set(x, y, z);
    // this.pointLight2.position.set(x, y, z);
  }

}

module.exports = AlphaLevel;
