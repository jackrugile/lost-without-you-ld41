const env = require('../env.js');
const Calc = require('../utils/calc');
const Ease = require('../utils/ease');

class Firefly {

  constructor(game, origin) {
    this.env = env;
    this.origin = origin;
    this.calc = new Calc();
    this.ease = new Ease();
    this.game = game;

    this.hue = 60;
    this.pulseRate = this.calc.rand(0.001, 0.005);
    this.pulseOffset = this.calc.rand(100);

    this.velocityBase = 0.005;
    this.range = 0.4;
    this.angle = this.calc.rand(Math.PI * 2);

    this.dead = false;

    this.observe();
    this.setupMesh();
    this.setupGlow();
    this.setupLights();
  }

  observe() {
    this.env.eventful.on('game-animate', (e) => this.update(e));
  }

  setupMesh() {
    this.mesh = new THREE.Mesh(this.game.fireflyGeometry, this.game.fireflyMaterial);
    this.mesh.position.copy(this.origin);
    this.mesh.bbox = new THREE.Box3();
    this.game.world.scene.add(this.mesh);
  }

  setupGlow() {
    this.glowMesh = new THREE.Sprite(this.game.fireflyGlowMaterial);
    this.glowScale = 0.15;
    this.glowMesh.scale.set(this.glowScale, this.glowScale, this.glowScale);
    this.glowMesh.position.set(0, 0, 0);
    this.mesh.add(this.glowMesh);
  }

  setupLights() {
    // this.light = new THREE.PointLight(new THREE.Color(`hsl(${this.hue}, 100%, 50%)`), 0.6, 1, 2);
    // this.light.castShadow = false;
    // this.light.position.set(0, 0.5, 0);
    // this.mesh.add(this.light);
  }

  move() {
    this.velocity = this.calc.map(Math.sin(Date.now() * 0.0025 + this.pulseOffset), -1, 1, this.velocityBase * 0.25, this.velocityBase);
    this.angle += this.calc.rand(-0.5, 0.5);
    this.mesh.position.x += Math.cos(this.angle) * this.velocity;
    this.mesh.position.z += Math.sin(this.angle) * this.velocity;

    if(this.mesh.position.x > this.origin.x + this.range) {
      this.mesh.position.x = this.origin.x + this.range;
      this.angle += Math.PI / 2;
    }
    if(this.mesh.position.x < this.origin.x - this.range) {
      this.mesh.position.x = this.origin.x - this.range;
      this.angle += Math.PI / 2;
    }
    if(this.mesh.position.z > this.origin.z + this.range) {
      this.mesh.position.z = this.origin.z + this.range;
      this.angle += Math.PI / 2;
    }
    if(this.mesh.position.z < this.origin.z - this.range) {
      this.mesh.position.z = this.origin.z - this.range;
      this.angle += Math.PI / 2;
    }
    this.mesh.bbox.setFromObject(this.mesh);
  }

  pulse() {
    let scale = this.calc.map(Math.sin(Date.now() * this.pulseRate + this.pulseOffset), -1, 1, 0.1, 0.4);
    this.glowMesh.scale.set(scale, scale, scale);

    // let distance = this.calc.map(Math.sin(Date.now() * this.pulseRate + this.pulseOffset), -1, 1, 0.75, 1);
    // this.light.distance = distance;
  }

  destroy() {
    this.dead = true;
    this.game.world.scene.remove(this.mesh);
    this.mesh = null;
    this.glowMesh = null;
  }

  update() {
    if(this.game.stateManager.current != 'play') {
      return;
    }
    if(!this.dead) {
      this.move();
      this.pulse();
    }
  }

}

module.exports = Firefly;
