const env = require('../env.js');
const Calc = require('../utils/calc');
const Ease = require('../utils/ease');
const FastSimplexNoise = require('fast-simplex-noise').default;

class ParticleSystem {

  constructor(game, parent, hero, hue) {
    this.env = env;
    this.calc = new Calc();
    this.ease = new Ease();
    this.game = game;
    this.parent = parent;
    this.hero = hero;
    this.hue = hue;

    this.particles = [];
    this.particleGroup = new THREE.Object3D();
    this.parent.add(this.particleGroup);

    this.simplex = new FastSimplexNoise();
    this.color = new THREE.Color();

    this.texture = this.generateTexture();
    this.size = 0.25;
    this.base = 12;
    this.count = this.base * this.base * this.base;
    this.geometry = new THREE.BufferGeometry();
    this.parts = [];

    this.positions = new Float32Array(this.count * 3);
    this.colors = new Float32Array(this.count * 4);
    this.sizes = new Float32Array(this.count);

    this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 4));
    this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    for(let i = 0; i < this.count; i++) {
      let size = this.calc.rand(0.02, 0.05);
      this.parts.push({
        offset: 0,
        position: new THREE.Vector3(
          this.calc.rand(-this.size / 2, this.size / 2) + this.hero.mesh.position.x,
          this.calc.rand(-this.size / 2, this.size / 2) + this.hero.mesh.position.y,
          this.calc.rand(-this.size / 2, this.size / 2) + this.hero.mesh.position.z
        ),
        baseSize: size,
        size: size,
        r: 1,
        g: 1,
        b: 1,
        a: 0,
        life: 2,
        decay: this.calc.rand(0.06, 0.09),
        delay: this.calc.randInt(0, 240),
        firstRun: true
      });
    }

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        texture: {
          type: 't',
          value: this.texture
        }
      },
      vertexShader: `
        attribute float size;
        attribute vec4 color;
        varying vec4 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / length(mvPosition.xyz));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D texture;
        varying vec4 vColor;
        void main(void) {
          vec4 newColor = vColor * texture2D(texture, gl_PointCoord);
          gl_FragColor = newColor;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.frustumCulled = false;
    this.particleGroup.add(this.mesh);

    this.updateParticleAttributes(true, true, true);
    this.reset();
  }

  reset() {
  }

  generateTexture() {
    let c = document.createElement('canvas');
    let ctx = c.getContext('2d');
    let size = 32;
    c.width = size;
    c.height = size;

    let gradient = ctx.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.4);
    gradient.addColorStop(0, 'hsla(0, 0%, 100%, 1)');
    gradient.addColorStop(1, 'hsla(0, 0%, 100%, 0)');

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    let texture = new THREE.Texture(c);
    texture.needsUpdate = true;

    return texture;
  }

  updateParticleAttributes(color, position, size) {
    let i = this.count;
    while(i--) {
      let part = this.parts[i];
      if(color) {
        this.colors[i * 4 + 0] = part.r;
        this.colors[i * 4 + 1] = part.g;
        this.colors[i * 4 + 2] = part.b;
        this.colors[i * 4 + 3] = part.a;
      }
      if(position) {
        this.positions[i * 3 + 0] = part.position.x;
        this.positions[i * 3 + 1] = part.position.y;
        this.positions[i * 3 + 2] = part.position.z;
      }
      if(size) {
        this.sizes[i] = part.size;
      }
    }

    if(color) {
      this.geometry.attributes.color.needsUpdate = true;
    }
    if(position) {
      this.geometry.attributes.position.needsUpdate = true;
    }
    if(size) {
      this.geometry.attributes.size.needsUpdate = true;
    }
  }

  replay() {
    this.reset();
  }

  update() {
    let i = this.count;

    let noiseScale = 2;
    let noiseTime = Date.now() * 0.0004;
    let noiseVelocity = 0.03;

    while(i--) {
      let part = this.parts[i];

      part.delay--;
      if(part.delay <= 0) {

        let xScaled = part.position.x * noiseScale;
        let yScaled = part.position.y * noiseScale;
        let zScaled = part.position.z * noiseScale;

        let noise1 = this.simplex.raw4D(
          xScaled,
          yScaled,
          zScaled,
          noiseTime
        ) * 0.5 + 0.5;
        let noise2 = this.simplex.raw4D(
          xScaled + 100,
          yScaled + 100,
          zScaled + 100,
          50 + noiseTime
        ) * 0.5 + 0.5;
        let noise3 = this.simplex.raw4D(
          xScaled + 200,
          yScaled + 200,
          zScaled + 200,
          100 + noiseTime
        ) * 0.5 + 0.5;

        part.position.x += Math.sin(noise1 * Math.PI * 2) * noiseVelocity;
        part.position.y += Math.sin(noise2 * Math.PI * 2) * noiseVelocity;
        part.position.z += Math.sin(noise3 * Math.PI * 2) * noiseVelocity;

        if(part.life > 0 ) {
          part.life -= part.decay * 1;
        }

        if(part.life <= 0 || part.firstRun) {
          part.life = 2;
          let newAngle = this.calc.rand(Math.PI * 2);
          let newMag = this.calc.rand(-this.size / 2, this.size / 2);
          part.position.x = Math.cos(newAngle) * newMag + this.hero.mesh.position.x;
          part.position.y = this.calc.rand(-this.size / 2, this.size / 2) + this.hero.mesh.position.y;
          part.position.z = Math.sin(newAngle) * newMag + this.hero.mesh.position.z;

          let lightness = Math.round(this.calc.rand(10, 50));
          this.color.set(`hsl(${this.hue}, 85%, ${lightness}%)`);

          part.r = this.color.r;
          part.g = this.color.g;
          part.b = this.color.b;

          part.firstRun = false;
        }

        part.a = part.life > 1 ? 2 - part.life : part.life;
      }
    }

    this.updateParticleAttributes(true, true, true);
  }

  destroy() {
    this.geometry.dispose();
    this.material.dispose();
    this.parent.remove(this.particleGroup);
    this.mesh = null;
    this.particles.length = null;
  }

}

module.exports = ParticleSystem;
