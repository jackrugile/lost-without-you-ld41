const env = require('../env.js');

class BaseLevel {

  constructor(game, name) {
    this.env = env;
    this.game = game;
    this.name = name;
  }

  build() {
    this.parseMaze();
    this.createGround();
    this.createWalls();
  }

  parseMaze() {
    this.mazeTrimmed = _.trim(this.maze);
    this.mazeLines = this.mazeTrimmed.split('\n');
    this.mazeArray = [];
    this.mazeLines.forEach((line) => {
      this.mazeArray.push(_.trim(line).split(' '));
    });
    this.mazeArray.forEach((line) => {
      line.forEach((item, i, arr) => {
        arr[i] = parseInt(item, 10);
      });
    });
    this.mazeRows = this.mazeArray[0].length;
    this.mazeCols = this.mazeArray.length;
  }

  createGround() {
    let geometry = new THREE.PlaneBufferGeometry(this.mazeRows, this.mazeCols);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    let material = new THREE.MeshBasicMaterial({
      color: 0x333333,
      side: THREE.DoubleSide
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    this.game.world.scene.add(mesh);
  }

  createWalls() {
    this.wallGroup = new THREE.Object3D();
    this.game.world.scene.add(this.wallGroup);
    this.walls = [];
    this.mazeArray.forEach((line, i) => {
      line.forEach((item, j) => {
        if(item === 3) {
          let x = j - this.mazeCols / 2;
          let z = i - this.mazeRows / 2;
          let geometry = new THREE.BoxBufferGeometry(1, 1, 1);
          let material = new THREE.MeshNormalMaterial();
          let mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(x + 0.5, 0.5, z + 0.5);
          this.walls.push(mesh);
          this.game.world.scene.add(mesh);
        }
      });
    });
  }

}

module.exports = BaseLevel;
