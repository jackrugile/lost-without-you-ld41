const env = require('./env.js');
const Calc = require('./utils/calc');
const Ease = require('./utils/ease');
const Keys = require('./input/keys');
const LevelManager = require('./level/manager');
const StateManager = require('./state/manager');
const Time = require('./core/time');
const World = require('./core/world');

require('howler');

class Game {

  constructor() {
    this.build();
  }

  build() {
    this.env = env;
    this.calc = new Calc();
    this.ease = new Ease();

    this.debug = location.hash.indexOf('debug') > -1;
    this.resolution = {};

    this.setupDOM();
    this.setupStorage();
    this.setupTime();
    this.setupWorld();
    this.setupStates();
    this.setupFireflies();
    this.setupLevels();
    this.setupInputs();
    this.setupSounds();
    this.onResize();
    this.start();
    this.observe();
  }

  setupDOM() {
    this.dom = {};
    this.dom.container = document.querySelector('.container');
    this.dom.scaler = document.querySelector('.scaler');
  }

  setupStorage() {
    if(!this.env.storage.get('level1')) {
      this.env.storage.set('level1', {
        name: 'level1',
        index: 0,
        available: true,
        beaten: false,
        bestTime: null,
        timesPlayed: 0
      });
    }

    if(!this.env.storage.get('level2')) {
      this.env.storage.set('level2', {
        name: 'level2',
        index: 1,
        available: false,
        beaten: false,
        bestTime: null,
        timesPlayed: 0
      });
    }

    if(!this.env.storage.get('level3')) {
      this.env.storage.set('level3', {
        name: 'level3',
        index: 2,
        available: false,
        beaten: false,
        bestTime: null,
        timesPlayed: 0
      });
    }

    if(!this.env.storage.get('level4')) {
      this.env.storage.set('level4', {
        name: 'level4',
        index: 3,
        available: false,
        beaten: false,
        bestTime: null,
        timesPlayed: 0
      });
    }
  }

  setupTime() {
    this.time = new Time();
  }

  setupWorld() {
    this.world = new World({ game: this });
  }

  setupStates() {
    this.stateManager = new StateManager(this);
    //this.stateManager.set('play');
    this.stateManager.set('menu');
  }

  setupFireflies() {
    this.fireflyGeometry = new THREE.SphereBufferGeometry(0.01, 0.01, 72, 72);
    this.fireflyMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let size = 512;
    canvas.width = size;
    canvas.height = size;
    let glow_gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    let steps = 20;
    for(let i = 0; i < steps; i++) {
      let p = i / (steps - 1);
      let a = this.calc.map(this.ease.outExpo(p, 0, 1, 1), 0, 1, 1, 0);
      glow_gradient.addColorStop(p, `hsla(60, 100%, 40%, ${a})`);
    }
    ctx.fillStyle = glow_gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    this.fireflyGlowMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    this.fireflies = [];
  }

  setupLevels() {
    this.wallGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    this.wallMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      specular: 0x666666,
      shininess: 20
    });

    this.levelManager = new LevelManager(this);
  }

  setupInputs() {
    this.keys = new Keys();
    this.dir = {
      up: false,
      down: false,
      left: false,
      right: false
    };
  }

  setupSounds() {
    this.sounds = {
      fireflyCollect: new Howl({
        src: ['./sounds/firefly-collect.mp3'],
        volume: 1,
        rate: 1.5
      }),
      button: new Howl({
        src: ['./sounds/click.mp3'],
        volume: 0.9,
        rate: 2
      }),
      levelIntro: new Howl({
        src: ['./sounds/intro.mp3'],
        volume: 1
      }),
      death: new Howl({
        src: ['./sounds/death.mp3'],
        volume: 0.15
      }),
      unite: new Howl({
        src: ['./sounds/unite.mp3'],
        volume: 0.1
      }),
      zoey: new Howl({
        src: ['./sounds/zoey.mp3'],
        volume: 1
      }),
      mary: new Howl({
        src: ['./sounds/mary.mp3'],
        volume: 0.2
      }),
      switch: new Howl({
        src: ['./sounds/switch.mp3'],
        volume: 0.4
      }),
      music: new Howl({
        src: ['./sounds/music.mp3'],
        volume: 0.3,
        pool: 1,
        loop: true
      })
    };
  }

  playSound(sound, config = null) {
    if(!this.muted) {
      if(config && config.volume) {
        sound.volume(config.volume);
      }
      if(config && config.rate) {
        sound.rate(config.rate);
      }
      sound.play();
    }
  }

  observe() {
    window.addEventListener('resize', () => this.onResize());

    this.env.eventful.on('dir-pressed', (e) => this.onDirPressed(e));
    this.env.eventful.on('dir-released', (e) => this.onDirReleased(e));
  }

  onResize() {
    let ratioWin = window.innerWidth / window.innerHeight;
    let ratioGame = 16 / 9;

    if(ratioWin > ratioGame) {
      this.resolution.x = window.innerHeight * ratioGame;
      this.resolution.y = window.innerHeight;
    } else {
      this.resolution.x = window.innerWidth;
      this.resolution.y = window.innerWidth / ratioGame;
    }

    this.aspect = this.resolution.x / this.resolution.y;
    //this.dpr = window.devicePixelRatio > 1 ? 2 : 1;
    this.dpr = 1;
    if(window.devicePixelRatio > 1) {
      document.body.classList.add('retina');
    } else {
      document.body.classList.remove('retina');
    }

    this.dom.container.style.width = `${this.resolution.x}px`;
    this.dom.container.style.height = `${this.resolution.y}px`;

    this.dom.scaler.style.transform = `scale(${this.resolution.y / 1080})`;

    this.domOffset = {
      x: Math.round(this.dom.container.offsetLeft),
      y: Math.round(this.dom.container.offsetTop)
    };

    this.env.eventful.trigger('game-resize', {
      resolution: this.resolution,
      aspect: this.aspect,
      dpr: this.dpr,
      domOffset: this.domOffset
    });
  }

  onDirPressed(e) {
    this.dir[e.dir] = true;
  }

  onDirReleased(e) {
    this.dir[e.dir] = false;
  }

  start() {
    this.raf = this.animate();
  }

  stop() {
    window.cancelAnimationFrame(this.raf);
  }

  update() {
  }

  animate() {
    this.update();
    this.env.eventful.trigger('game-animate');
    this.raf = window.requestAnimationFrame(() => this.animate());
  }

}

module.exports = new Game();
