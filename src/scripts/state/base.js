const env = require('../env.js');

class BaseState {

  constructor(game, name) {
    this.env = env;
    this.game = game;
    this.name = name;
    this.observe();
  }

  observe() {
    this.env.eventful.on('game-animate', (e) => this.update(e));
  }

  activate() {
    this.env.eventful.trigger(`${this.name}-state-activate`);
    console.log(`${this.name} state activated`);
  }

  deactivate() {
    this.env.eventful.trigger(`${this.name}-state-deactivate`);
    console.log(`${this.name} state deactivated`);
  }

  update() {
  }

}

module.exports = BaseState;
