const env = require('../env.js');
const Calc = require('../utils/calc');
const Ease = require('../utils/ease');
const ParticleSystem = require('./particle-system');

class Hero {

  constructor(game, name, origin) {
    this.env = env;
    this.calc = new Calc();
    this.ease = new Ease();
    this.game = game;
    this.name = name;
    this.origin = origin;

    this.isActive = false;

    this.hue = this.name === 'a' ? 130 : 210;

    this.life = 1;
    this.decay = 0.00175;
    //this.decay = 0;

    this.acceleration = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.accelerationGain = 0.01;
    this.velocityMax = 0.3;
    this.velocityFriction = 0.85;

    this.lightPositionCurrent = new THREE.Vector3();
    this.lightPositionTarget = new THREE.Vector3();
    this.lightDistanceBase = 5;
    this.lightDistanceCurrent = 5;
    this.lightDistanceTarget = 5;
    this.light1Intensity = 0.75;
    this.light2Intensity = 0.25;

    this.observe();
    this.setupMesh();
    this.setupLights();
    this.setupCollisions();
    this.spawnGhost();
    this.setupParticleSystem();
  }

  observe() {
    this.env.eventful.on('game-animate', (e) => this.update(e));
  }

  setupMesh() {
    this.width = 0.3;
    this.height = 0.3;
    this.depth = 0.3;
    this.geometry = new THREE.BoxBufferGeometry(this.width, this.height, this.depth);
    this.material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(`hsl(${this.hue}, 80%, 50%)`),
      specular: new THREE.Color(`hsl(${this.hue}, 80%, 75%)`),
      shininess: 100
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.origin);
    this.mesh.position.y += this.height / 2;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.bbox = new THREE.Box3();
    this.game.world.scene.add(this.mesh);

    this.lifeGeometryBack = new THREE.PlaneBufferGeometry(0.3, 0.015);
    this.lifeGeometryBack.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    this.lifeMaterialBack = new THREE.MeshBasicMaterial({
      color: new THREE.Color('hsl(0, 0%, 0%)'),
      transparent: true,
      opacity: 0.25,
      depthTest: false
    });
    this.lifeMeshBack = new THREE.Mesh(this.lifeGeometryBack, this.lifeMaterialBack);
    this.game.world.scene.add(this.lifeMeshBack);

    this.lifeGeometry = new THREE.PlaneBufferGeometry(0.3, 0.015);
    this.lifeGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    this.lifeMaterial = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(`hsl(${this.hue}, 80%, 50%)`),
      transparent: true,
      opacity: 0.45,
      depthTest: false
    });
    this.lifeMeshScaleCurrent = 1;
    this.lifeMeshScaleTarget = 1;
    this.lifeMesh = new THREE.Mesh(this.lifeGeometry, this.lifeMaterial);
    this.game.world.scene.add(this.lifeMesh);
  }

  setupLights() {
    this.light1 = new THREE.PointLight(new THREE.Color(`hsl(${this.hue}, 75%, 50%)`), this.light1Intensity, this.lightDistanceBase, 2);
    this.light1.castShadow = false;
    this.mesh.add(this.light1);

    this.light2 = new THREE.PointLight(new THREE.Color(`hsl(${this.hue}, 75%, 50%)`), this.light2Intensity, this.lightDistanceBase, 2);
    this.light2.castShadow = true;
    this.light2.shadow.mapSize.width = window.devicePixelRatio > 1 ? 128 : 512;
    this.light2.shadow.mapSize.height = window.devicePixelRatio > 1 ? 128 : 512;
    this.mesh.add(this.light2);
  }

  setupCollisions() {
    this.colliding = {
      up: false,
      down: false,
      left: false,
      right: false
    };
  }

  move() {
    this.colliding.up = false;
    this.colliding.down = false;
    this.colliding.left = false;
    this.colliding.right = false;

    if(this.isActive && this.game.isPlaying && !this.game.isEnding) {
      if(this.game.dir.left && !this.colliding.left) {
        this.acceleration.x = -this.accelerationGain;
      } else if(this.game.dir.right && !this.colliding.right) {
        this.acceleration.x = this.accelerationGain;
      } else {
        this.acceleration.x = 0;
      }
    } else {
      this.acceleration.x = 0;
    }

    if(!this.game.isEnding) {
      this.velocity.x += this.acceleration.x * this.game.time.dtn;
      this.velocity.x *= this.velocityFriction;
      this.velocity.x = this.calc.clamp(this.velocity.x, -this.velocityMax, this.velocityMax);
      this.mesh.position.x += this.velocity.x;
      this.mesh.bbox.setFromObject(this.mesh);
    }

    let walls = this.game.levelManager.current.walls;
    for(let i = 0, len = walls.length; i < len; i++) {
      let wall = walls[i];
      if(this.mesh.bbox.intersectsBox(wall.bbox)) {
        if(this.mesh.bbox.min.x < wall.bbox.max.x && this.mesh.position.x > wall.position.x && this.velocity.x < 0) {
          this.colliding.left = true;
          this.velocity.x = 0;
          this.mesh.position.x -= this.mesh.bbox.min.x - wall.bbox.max.x - 0.00000001;
        }
        if(this.mesh.bbox.max.x > wall.bbox.min.x && this.mesh.position.x < wall.position.x && this.velocity.x > 0) {
          this.colliding.right = true;
          this.velocity.x = 0;
          this.mesh.position.x -= this.mesh.bbox.max.x - wall.bbox.min.x + 0.00000001;
        }
      }
    }

    if(this.isActive && this.game.isPlaying && !this.game.isEnding) {
      if(this.game.dir.up && !this.colliding.up) {
        this.acceleration.z = -this.accelerationGain;
      } else if(this.game.dir.down && !this.colliding.down) {
        this.acceleration.z = this.accelerationGain;
      } else {
        this.acceleration.z = 0;
      }
    } else {
      this.acceleration.x = 0;
    }

    if(!this.game.isEnding) {
      this.velocity.z += this.acceleration.z * this.game.time.dtn;
      this.velocity.z *= this.velocityFriction;
      this.velocity.z = this.calc.clamp(this.velocity.z, -this.velocityMax, this.velocityMax);
      this.mesh.position.z += this.velocity.z;
      this.mesh.bbox.setFromObject(this.mesh);
    }

    for(let i = 0, len = walls.length; i < len; i++) {
      let wall = walls[i];
      if(this.mesh.bbox.intersectsBox(wall.bbox)) {
        if(this.mesh.bbox.min.z < wall.bbox.max.z && this.mesh.position.z > wall.position.z && this.velocity.z < 0) {
          this.colliding.up = true;
          this.velocity.z = 0;
          this.mesh.position.z -= this.mesh.bbox.min.z - wall.bbox.max.z - 0.00000001;
        }
        if(this.mesh.bbox.max.z > wall.bbox.min.z && this.mesh.position.z < wall.position.z && this.velocity.z > 0) {
          this.colliding.down = true;
          this.velocity.z = 0;
          this.mesh.position.z -= this.mesh.bbox.max.z - wall.bbox.min.z + 0.00000001;
        }
      }
    }
  }

  updateLights() {
    this.lightAngle = Math.atan2(this.velocity.z, this.velocity.x);
    this.lightDistance = Math.sqrt(this.velocity.z * this.velocity.z + this.velocity.x * this.velocity.x) * 10;
    this.lightPositionTarget.x = Math.cos(this.lightAngle) * this.lightDistance;
    this.lightPositionTarget.y = 1.2;
    this.lightPositionTarget.z = Math.sin(this.lightAngle) * this.lightDistance;

    this.lightPositionCurrent.lerp(this.lightPositionTarget, 0.05);

    this.light1.position.copy(this.lightPositionCurrent);
    this.light2.position.copy(this.lightPositionCurrent);
  }

  setActive(active) {
    this.isActive = active;
    if(!active) {
      this.acceleration.x = 0;
      this.acceleration.z = 0;
    }
  }

  collideHeros() {
    if(this.game.heroA && this.game.heroB) {
      let otherHero = this.name === 'a' ? this.game.heroB : this.game.heroA;
      if(this.mesh.bbox.intersectsBox(otherHero.mesh.bbox)) {
        if(!this.game.isEnding) {
          this.game.sounds.unite.play();
          this.game.lastLevelPlayed = this.game.currentLevel;
          this.game.lastLevelTime = this.game.currentState.elapsedTime;
          this.env.eventful.trigger('unite');
        }
      }
    }
  }

  collideFireflies() {
    let fireflies = this.game.fireflies;
    let i = fireflies.length;
    while(i--) {
      let firefly = fireflies[i];
      if(this.mesh.bbox.intersectsBox(firefly.mesh.bbox)) {
        firefly.destroy();
        fireflies.splice(i, 1);
        this.collectFirefly();
      }
    }
  }

  collectFirefly() {
    this.life += 0.2;
    this.life = this.calc.clamp(this.life, 0, 1);
    this.ghostOpacity = 1;
    this.ghostScale = 2;
    if(this.isActive) {
      this.game.sounds.fireflyCollect.rate(this.calc.rand(1.5, 2));
      this.game.sounds.fireflyCollect.play();
      this.env.eventful.trigger('collect-firefly');
    }
  }

  spawnGhost() {
    //this.ghostGeometry = new THREE.BoxBufferGeometry(this.width, this.height, this.depth);
    this.ghostGeometry = new THREE.SphereBufferGeometry(this.width, 32, 32);
    this.ghostMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.ghostMesh = new THREE.Mesh(this.ghostGeometry, this.ghostMaterial);
    this.ghostMesh.position.copy(this.mesh.position);
    //let scale = 1.5;
    //this.ghostMesh.scale.set(scale, scale, scale);
    this.ghostOpacity = 0;
    this.ghostScale = 2;
    this.game.world.scene.add(this.ghostMesh);
  }

  setupParticleSystem() {
    this.particleSystem = new ParticleSystem(this.game, this.game.world.scene, this, this.hue);
  }

  updateLightLife() {
    if(this.isActive && this.game.isPlaying && !this.game.isEnding) {
      if(this.life > 0) {
        this.life -= this.decay;
        this.lightDistanceTarget = 0 + this.lightDistanceBase * this.life;
        this.lightDistanceCurrent += (this.lightDistanceTarget - this.lightDistanceCurrent) * 0.2;
        this.light1.distance = this.lightDistanceCurrent;
        this.light2.distance = this.lightDistanceCurrent;
      } else {
        this.game.sounds.death.play();
        this.light1.distance = 0;
        this.light2.distance = 0;
        this.game.lastLevelPlayed = this.game.currentLevel;
        this.game.lastLevelTime = this.game.currentState.elapsedTime;
        this.game.stateManager.set('lose');
        this.game.sounds.music.fade(0.3, 0, 1500);
      }
    }
    this.lifeMeshBack.position.copy(this.mesh.position);
    this.lifeMeshBack.position.y += this.height / 2;
    this.lifeMeshBack.position.z -= 0.23;
    this.lifeMesh.position.copy(this.mesh.position);
    this.lifeMesh.position.y += this.height / 2;
    this.lifeMesh.position.z -= 0.23;
    this.lifeMeshScaleTarget = 0.000001 + this.life;
    this.lifeMeshScaleCurrent += (this.lifeMeshScaleTarget - this.lifeMeshScaleCurrent) * 0.2;
    this.lifeMesh.position.x -= (0.3 - 0.3 * this.lifeMeshScaleCurrent) / 2;
    this.lifeMesh.scale.set(this.lifeMeshScaleCurrent, 1, 1);
  }

  destroy() {
    this.game.world.scene.remove(this.light1);
    this.light1 = null;

    this.game.world.scene.remove(this.light2);
    this.light2 = null;

    this.game.world.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
    this.mesh = null;

    this.game.world.scene.remove(this.lifeMesh);
    this.lifeGeometry.dispose();
    this.lifeMaterial.dispose();
    this.lifeMesh = null;

    this.game.world.scene.remove(this.lifeMeshBack);
    this.lifeGeometryBack.dispose();
    this.lifeMaterialBack.dispose();
    this.lifeMeshBack = null;

    this.particleSystem.destroy();
  }

  update() {
    if(this.game.stateManager.current != 'play' || !this.mesh) {
      return;
    }

    this.move();
    this.updateLights();
    this.collideHeros();
    this.collideFireflies();
    this.updateLightLife();

    this.particleSystem.update();
    //this.particleSystem.particleGroup.position.copy(this.mesh.position);

    this.ghostMesh.position.copy(this.mesh.position);

    if(this.ghostOpacity > 0) {
      this.ghostOpacity -= 0.015;
    }
    let eased = this.ease.inExpo(this.ghostOpacity, 0, 1, 1);
    this.ghostMaterial.opacity = eased;

    let newScale = 1 + eased * 0.5;
    this.ghostMesh.scale.set(newScale, newScale, newScale);
  }

}

module.exports = Hero;
