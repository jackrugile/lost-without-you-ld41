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
    this.fov = 75;
    this.camera = new THREE.PerspectiveCamera(this.fov, 0, 0.1, 1000);
    this.cameraCurrent = new THREE.Vector3();
    this.cameraTarget = new THREE.Vector3();
    this.cameraLookAtCurrent = new THREE.Vector3();
    this.cameraLookAtTarget = new THREE.Vector3();

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
    if(this.game.heroA) {
      this.cameraTarget.copy(this.game.heroA.mesh.position);
      this.cameraTarget.y = 10;
      this.cameraTarget.z += 0;

      this.cameraLookAtTarget.copy(this.game.heroA.mesh.position);

      this.cameraCurrent.lerp(this.cameraTarget, 0.1);
      this.cameraLookAtCurrent.lerp(this.cameraLookAtTarget, 0.1);

      this.camera.position.copy(this.cameraCurrent);
      this.camera.lookAt(this.cameraLookAtCurrent);
    }
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
