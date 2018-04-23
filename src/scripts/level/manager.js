const env = require('../env.js');
const Level1 = require('./level1.js');
const Level2 = require('./level2.js');
const Level3 = require('./level3.js');
const Level4 = require('./level4.js');

class LevelManager {

  constructor(game) {
    this.env = env;
    this.game = game;

    this.levelNames = [
      'level1',
      'level2',
      'level3',
      'level4'
    ];

    this.levels = {
      level1: new Level1(this.game, 'level1'),
      level2: new Level2(this.game, 'level2'),
      level3: new Level3(this.game, 'level3'),
      level4: new Level4(this.game, 'level4')
    };
  }

  set(level) {
    if(this.current) {
      this.current.destroy();
    }
    this.build(level);
  }

  build(level) {
    this.current = this.levels[level];
    this.current.build();
  }

}

module.exports = LevelManager;
