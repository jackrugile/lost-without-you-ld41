const env = require('../env.js');

require('three/examples/js/controls/OrbitControls.js');
require('three/examples/js/postprocessing/EffectComposer');
require('three/examples/js/postprocessing/ShaderPass');
require('three/examples/js/postprocessing/FilmPass.js');
require('three/examples/js/postprocessing/RenderPass');
require('three/examples/js/postprocessing/MaskPass');
require('three/examples/js/shaders/CopyShader');
require('three/examples/js/shaders/FilmShader.js');
require('three/examples/js/shaders/ConvolutionShader');
require('three/examples/js/shaders/LuminosityHighPassShader');
require('three/examples/js/shaders/RGBShiftShader');
require('three/examples/js/postprocessing/UnrealBloomPass');

class World {

  constructor(init) {
    this.env = env;

    this.game = init.game;

    this.observe();
    this.setupScene();
    this.setupLights();
    this.setupRenderer();
    this.setupCameras();
    this.setupComposer();
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
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.game.dom.container.appendChild(this.renderer.domElement);
  }

  setupCameras() {
    this.fov = 75;
    this.camera = new THREE.PerspectiveCamera(this.fov, 0, 0.1, 1000);
    this.camera.position.set(-5, 5, 5);
    this.cameraCurrent = new THREE.Vector3();
    this.cameraTarget = new THREE.Vector3();
    this.cameraLookAtCurrent = new THREE.Vector3();
    this.cameraLookAtTarget = new THREE.Vector3();

    // this.orbit = new THREE.OrbitControls(this.camera, this.game.dom.container);
    // this.orbit.enableDamping = true;
    // this.orbit.dampingFactor = 0.2;
    // this.orbit.enableKeys = false;
  }

  setupComposer() {
    this.composer = new THREE.EffectComposer(this.renderer);

    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.renderPass.renderToScreen = false;
    //this.renderPass.clear = false;
    //this.renderPass.clearDepth = true;
    this.composer.addPass(this.renderPass);

    this.rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader);
    this.rgbPass.uniforms['amount'].value = 0;
    this.rgbPass.uniforms['angle'].value = 0;
    this.rgbPass.renderToScreen = false;
    this.composer.addPass(this.rgbPass);

    // this.bloomPass = new THREE.UnrealBloomPass(
    //   new THREE.Vector2(window.innerWidth, window.innerHeight), // resolution
    //   0.75, // strength
    //   0.5, // radius
    //   0.75 //threshold
    // );
    // this.bloomPass.renderToScreen = false;
    // this.composer.addPass(this.bloomPass);

    // noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale
    this.filmPass = new THREE.FilmPass(0.15, 0.5, 2048, false);
    this.filmPass.renderToScreen = true;
    this.composer.addPass(this.filmPass);
  }

  setupGrid() {
    // this.gridHelper = new THREE.GridHelper(100, 100, 0xffffff, 0x666666);
    // this.gridHelper.material.transparent = true;
    // this.gridHelper.material.opacity = 0.2;
    // this.scene.add(this.gridHelper);
  }

  update() {
    //this.orbit.update();
    if(this.game.activeHero && this.game.stateManager.current === 'play') {
      this.cameraTarget.copy(this.game.activeHero.mesh.position);
      this.cameraTarget.y = 5;
      this.cameraTarget.z += 0;

      this.cameraLookAtTarget.copy(this.game.activeHero.mesh.position);

      this.cameraCurrent.lerp(this.cameraTarget, 0.1);
      this.cameraLookAtCurrent.lerp(this.cameraLookAtTarget, 0.1);

      this.camera.position.copy(this.cameraCurrent);
      this.camera.lookAt(this.cameraLookAtCurrent);
    }

    this.rgbPass.uniforms['amount'].value = 0.0006 + Math.sin(Date.now() * 0.003) * 0.0006;
    this.rgbPass.uniforms['angle'].value -= 0.05;
    //this.bloomPass.strength = 0.5 + Math.sin(Date.now() * 0.003) * 0.5;
    //this.bloomPass.radius = 1 + Math.sin(Date.now() * 0.003) * 1;
    //this.bloomPass.radius = 0.5 - Math.sin(Date.now() * 0.003) * 0.25;
  }

  render() {
    //this.renderer.render(this.scene, this.camera);
    this.composer.render(0.00001);
  }

  onGameResize(e) {
    this.camera.aspect = e.aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(e.dpr);
    this.renderer.setSize(e.resolution.x, e.resolution.y);
    this.composer.setSize(e.resolution.x * e.dpr, e.resolution.y * e.dpr);
  }

  onGameAnimate() {
    this.update();
    this.render();
  }

}

module.exports = World;
