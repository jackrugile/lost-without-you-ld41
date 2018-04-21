const env = require('../env.js');

class Time {

  constructor(game) {
    this.env = env;
    this.game = game;

    this.timescale = 1;
    this.clock = new THREE.Clock();
    this.dts = this.clock.getDelta() * this.timescale;
    this.dtms = this.dts * 1000;
    this.dtn = this.dtms / (1000 / 60);
    this.em = 0;

    this.observe();
  }

  observe() {
    this.env.eventful.on('game-animate', (e) => this.update(e));
  }

  update() {
    this.dts = this.clock.getDelta();
    this.dts *= this.timescale;
    this.dtm = this.dts * 1000;
    this.dtn = this.dtm / (1000 / 60);
    this.em += this.dtm;
  }

}

module.exports = Time;
