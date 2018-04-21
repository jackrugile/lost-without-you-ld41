const BaseLevel = require('./base');

class AlphaLevel extends BaseLevel {

  constructor(game, name) {
    super(game, name);

    this.maze = `
      3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
      3 0 0 3 3 3 0 0 3 3 3 0 0 0 0 0 3 0 0 3
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
      3 0 0 0 3 3 3 3 3 0 0 0 0 0 3 3 0 0 0 3
      3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
    `;

    //this.ambientLight = new THREE.AmbientLight(0x111111);
    //this.game.world.scene.add(this.ambientLight);

    this.pointLight = new THREE.PointLight(0xffffff, 1, 10, 2);
    this.pointLight.position.set(0, 3, 0);
    this.pointLight.castShadow = true;
    this.game.world.scene.add(this.pointLight);
  }

  update() {
    super.update();

    let timeOffset = this.game.time.em * 0.0005;
    let x = Math.cos(timeOffset) * this.mazeCols / 4;
    let y = 3;
    let z = Math.sin(timeOffset) * this.mazeCols / 4;
    this.pointLight.position.set(x, y, z);
  }

}

module.exports = AlphaLevel;
