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

  move() {
    let distHeroThreshold = 1;
    let distToHeroA = this.mesh.position.distanceTo(this.game.heroA.mesh.position);
    let distToHeroB = this.mesh.position.distanceTo(this.game.heroB.mesh.position);
    let refHero = this.game.heroA;
    let refDist = distToHeroA;
    if(distToHeroA > distToHeroB) {
      refHero = this.game.heroB;
      refDist = distToHeroB;
    }

    if(refDist < distHeroThreshold && this.game.isPlaying) {
      let dz = this.mesh.position.z - refHero.mesh.position.z;
      let dx = this.mesh.position.x - refHero.mesh.position.x;
      this.angle = Math.atan2(dz, dx) + Math.PI;
      this.velocity = 0.05 * (distHeroThreshold - refDist);
    } else {
      this.velocity = this.calc.map(Math.sin(Date.now() * 0.0025 + this.pulseOffset), -1, 1, this.velocityBase * 0.25, this.velocityBase);
      this.angle += this.calc.rand(-0.5, 0.5);
      if(this.mesh.position.distanceTo(this.origin) > this.range) {
        let dz = this.mesh.position.z - this.origin.z;
        let dx = this.mesh.position.x - this.origin.x;
        this.angle = Math.atan2(dz, dx) + Math.PI;
      }
    }

    this.mesh.position.x += Math.cos(this.angle) * this.velocity * this.game.time.dtn;
    this.mesh.position.z += Math.sin(this.angle) * this.velocity * this.game.time.dtn;

    this.mesh.bbox.setFromObject(this.mesh);
  }

  pulse() {
    let scale = this.calc.map(Math.sin(Date.now() * this.pulseRate + this.pulseOffset), -1, 1, 0.1, 0.4);
    this.glowMesh.scale.set(scale, scale, scale);
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
