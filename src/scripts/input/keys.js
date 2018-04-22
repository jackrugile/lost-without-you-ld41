const env = require('../env.js');

class Keys {

  constructor(game) {
    this.env = env;
    this.game = game;

    this.keyWatch = {
      up: [ 87, 38 ], // w, up
      down: [ 83, 40 ], // s, down
      left: [ 65, 37 ], // a, left
      right: [ 68, 39 ] // d, right
    };

    this.observe();
  }

  observe() {
    window.addEventListener('keydown', (e) => this.onKeydown(e));
    window.addEventListener('keyup', (e) => this.onKeyup(e));
  }

  onKeydown(e) {
    let key = e.which;
    if(this.keyWatch.up.indexOf(key) > -1) {
      this.env.eventful.trigger('dir-pressed', { dir: 'up' });
    }
    if(this.keyWatch.down.indexOf(key) > -1) {
      this.env.eventful.trigger('dir-pressed', { dir: 'down' });
    }
    if(this.keyWatch.left.indexOf(key) > -1) {
      this.env.eventful.trigger('dir-pressed', { dir: 'left' });
    }
    if(this.keyWatch.right.indexOf(key) > -1) {
      this.env.eventful.trigger('dir-pressed', { dir: 'right' });
    }
  }

  onKeyup(e) {
    let key = e.which;
    if(this.keyWatch.up.indexOf(key) > -1) {
      this.env.eventful.trigger('dir-released', { dir: 'up' });
    }
    if(this.keyWatch.down.indexOf(key) > -1) {
      this.env.eventful.trigger('dir-released', { dir: 'down' });
    }
    if(this.keyWatch.left.indexOf(key) > -1) {
      this.env.eventful.trigger('dir-released', { dir: 'left' });
    }
    if(this.keyWatch.right.indexOf(key) > -1) {
      this.env.eventful.trigger('dir-released', { dir: 'right' });
    }
  }

}

module.exports = Keys;
