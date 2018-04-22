const env = require('../env.js');
const Firefly = require('../entities/firefly');
const Hero = require('../entities/hero');

class BaseLevel {

  constructor(game, name) {
    this.env = env;
    this.game = game;
    this.name = name;
    this.observe();
  }

  observe() {
    this.env.eventful.on('game-animate', (e) => this.update(e));
  }

  build() {
    this.parseMaze();
    this.setupGround();
    this.setupWalls();
    this.setupHeros();
    this.setupFireflies();
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

  setupGround() {
    let geometry = new THREE.PlaneBufferGeometry(this.mazeRows, this.mazeCols);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    let material = new THREE.MeshPhongMaterial({
      color: 0x666666,
      specular: 0x333333,
      shininess: 30
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.position.set(0, 0, 0);
    this.game.world.scene.add(mesh);
  }

  setupWalls() {
    this.wallGroup = new THREE.Object3D();
    this.game.world.scene.add(this.wallGroup);
    this.walls = [];
    this.mazeArray.forEach((line, i) => {
      line.forEach((item, j) => {
        if(item === 3) {
          let x = j - this.mazeCols / 2;
          let z = i - this.mazeRows / 2;
          let mesh = new THREE.Mesh(this.game.wallGeometry, this.game.wallMaterial);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.position.set(x + 0.5, 0.5, z + 0.5);
          mesh.bbox = new THREE.Box3();
          mesh.bbox.setFromObject(mesh);
          this.walls.push(mesh);
          this.game.world.scene.add(mesh);
        }
      });
    });
  }

  setupHeros() {
    this.mazeArray.forEach((line, i) => {
      line.forEach((item, j) => {
        if(item === 1 || item === 2) {
          let x = j - this.mazeCols / 2;
          let y = 0;
          let z = i - this.mazeRows / 2;
          let origin = new THREE.Vector3(x + 0.5, y, z + 0.5);
          if(item === 1) {
            this.game.heroA = new Hero(this.game, 'a', origin);
          }
          if(item === 2) {
            this.game.heroB = new Hero(this.game, 'b', origin);
          }
        }
      });
    });
  }

  setupFireflies() {
    this.mazeArray.forEach((line, i) => {
      line.forEach((item, j) => {
        let off = (i % 6 === 0) ? 1 : 0;
        if(item === 0 && (i % 3) === 0 && ((j + off) % 3) === 0) {
          let x = j - this.mazeCols / 2 + 0.5;
          let y = 0.5;
          let z = i - this.mazeRows / 2 + 0.5;
          this.game.fireflies.push(new Firefly(this.game, new THREE.Vector3(x, y, z)));
        }
      });
    });
  }

  update() {
  }

}

module.exports = BaseLevel;
