const env = require('../env.js');
const PlayState = require('./play.js');

class StateManager {

  constructor(game) {
    this.env = env;
    this.game = game;
    this.states = {
      play: new PlayState(this.game, 'play')
    };
  }

  set(state) {
    if(this.current) {
      this.states[this.current].deactivate();
    }
    this.current = state;
    this.states[this.current].activate();
  }

}

module.exports = StateManager;
