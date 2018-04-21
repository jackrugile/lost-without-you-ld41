const env = require('../env.js');

require('three/examples/js/controls/OrbitControls.js');

class World {

  constructor(init) {
    this.env = env;

    this.game = init.game;

    this.observe();
    this.setupScene();
    this.setupLights();
    this.setupRenderer();
    this.setupCameras();
    this.setupGrid();
  }

  observe() {
    this.env.eventful.on('game-resize', (e) => this.onGameResize(e));
    this.env.eventful.on('game-animate', () => this.onGameAnimate());
  }

  setupScene() {
    this.scene = new THREE.Scene();
  }

  setupLights() {
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      precision: 'highp'
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.game.dom.container.appendChild(this.renderer.domElement);
  }

  setupCameras() {
    this.fov = 50;
    this.camera = new THREE.PerspectiveCamera(this.fov, 0, 0.1, 1000);
    this.camera.position.set(-5, 2.5, 5);

    this.orbit = new THREE.OrbitControls(this.camera, this.game.dom.container);
    this.orbit.enableDamping = true;
    this.orbit.dampingFactor = 0.2;
    this.orbit.enableKeys = false;
  }

  setupGrid() {
    // this.gridHelper = new THREE.GridHelper(100, 100, 0xffffff, 0x666666);
    // this.gridHelper.material.transparent = true;
    // this.gridHelper.material.opacity = 0.2;
    // this.scene.add(this.gridHelper);
  }

  update() {
    this.orbit.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onGameResize(e) {
    this.camera.aspect = e.aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(e.dpr);
    this.renderer.setSize(e.resolution.x, e.resolution.y);
  }

  onGameAnimate() {
    this.update();
    this.render();
  }

}

module.exports = World;
