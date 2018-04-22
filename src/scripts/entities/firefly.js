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
    this.pulse = 0;
    this.pulseRate = this.calc.rand(0.005, 0.01);
    this.pulseOffset = this.calc.rand(100);

    this.observe();
    this.setupMesh();
    this.setupGlow();
    this.setupLights();
  }

  observe() {
    this.env.eventful.on('game-animate', (e) => this.update(e));
  }

  setupMesh() {
    this.geometry = new THREE.SphereBufferGeometry(0.01, 0.01, 72, 72);
    this.material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(`hsl(${this.hue}, 100%, 100%)`),
      emissive: new THREE.Color(`hsl(${this.hue}, 100%, 100%)`),
      specular: new THREE.Color(`hsl(${this.hue}, 100%, 100%)`),
      shininess: 100,
      //flatShading: true
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.origin);
    //this.mesh.castShadow = true;
    //this.mesh.receiveShadow = true;
    this.mesh.bbox = new THREE.Box3();
    this.game.world.scene.add(this.mesh);
  }

  setupGlow() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let size = 512;
    canvas.width = size;
    canvas.height = size;
    let glow_gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    let steps = 20;
    for(let i = 0; i < steps; i++) {
      let p = i / (steps - 1);
      let a = this.calc.map(this.ease.inOutQuad(p, 0, 1, 1), 0, 1, 0.5, 0);
      glow_gradient.addColorStop(p, `hsla(${this.hue}, 100%, 40%, ${a})`);
    }
    ctx.fillStyle = glow_gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    this.glowGeometry = new THREE.PlaneGeometry(1, 1);
    // this.glowMaterial = new THREE.MeshBasicMaterial({
    //   map: texture,
    //   transparent: true,
    //   blending: THREE.AdditiveBlending
    // });
    // this.glowMesh = new THREE.Mesh(this.glowGeometry, this.glowMaterial);
    this.glowMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    this.glowMesh = new THREE.Sprite(this.glowMaterial);
    this.glowScale = 0.15;
    this.glowMesh.scale.set(this.glowScale, this.glowScale, this.glowScale);
    this.glowMesh.position.set(0, 0, 0);
    this.mesh.add(this.glowMesh);
  }

  setupLights() {
    this.light = new THREE.PointLight(new THREE.Color(`hsl(${this.hue}, 100%, 50%)`), 0.6, 1, 2);
    this.light.castShadow = false;
    this.light.position.set(0, 0.5, 0);
    this.mesh.add(this.light);
  }

  move() {
  }

  update() {
    //this.move();
    //this.glowMesh.position.copy(this.mesh.position.clone().multiplyScalar(1));

    let scale = this.calc.map(Math.sin(Date.now() * this.pulseRate + this.pulseOffset), -1, 1, 0.1, 0.15);
    this.glowMesh.scale.set(scale, scale, scale);

    let distance = this.calc.map(Math.sin(Date.now() * this.pulseRate + this.pulseOffset), -1, 1, 0.75, 1);
    this.light.distance = distance;
  }

}

module.exports = Firefly;
