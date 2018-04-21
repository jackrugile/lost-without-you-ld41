const env = require('../env.js');

require('three/examples/js/controls/OrbitControls.js');

class World {

  constructor(init) {
    this.env = env;

    this.game = init.game;

    this.build();
  }

  build() {
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
      antialias: true
      //alpha: true
    });
    // if(this.shadows_enabled) {
    //   this.renderer.shadowMap.enabled = true;
    //   this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // }
    this.game.dom.container.appendChild(this.renderer.domElement);
  }

  setupCameras() {
    this.fov = 60;
    this.camera = new THREE.PerspectiveCamera(this.fov, 0, 1, 1000);
    this.camera.position.set(-10, 5, 0);
    // this.camera_position_vec = new THREE.Vector3();
    // this.camera_target_vec = new THREE.Vector3();
    // this.camera_look_at_vec = new THREE.Vector3();

    this.orbit = new THREE.OrbitControls(this.camera, this.game.dom.container);
    this.orbit.enableDamping = true;
    this.orbit.dampingFactor = 0.2;
    this.orbit.enableKeys = false;
  }

  setupGrid() {
    this.gridHelper = new THREE.GridHelper(100, 20, 0xffffff, 0x666666);
    this.gridHelper.material.transparent = true;
    this.scene.add(this.gridHelper);
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
