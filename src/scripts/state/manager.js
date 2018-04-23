const env = require('../env.js');
const InstructionsState = require('./instructions.js');
const LoseState = require('./lose.js');
const MenuState = require('./menu.js');
const PlayState = require('./play.js');
const WinState = require('./win.js');

class StateManager {

  constructor(game) {
    this.env = env;
    this.game = game;
    this.states = {
      instructions: new InstructionsState(this.game, 'instructions'),
      lose: new LoseState(this.game, 'lose'),
      menu: new MenuState(this.game, 'menu'),
      play: new PlayState(this.game, 'play'),
      win: new WinState(this.game, 'win')
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
