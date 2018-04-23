const env = require('../env.js');

class StorageManager {

  constructor(namespace) {
    this.env = env;

    Storage.prototype.setObject = function(key, value) {
      this.setItem(key, JSON.stringify(value));
    };

    Storage.prototype.getObject = function(key) {
      let value = this.getItem(key);
      return value && JSON.parse(value);
    };

    Storage.prototype.removeObject = function(key) {
      this.removeItem(key);
    };

    this.namespace = namespace;
    this.obj = localStorage.getObject(this.namespace) || {};
  }

  get(key) {
    return this.obj[key];
  }

  set(key, val) {
    this.obj[key] = val;
    this.sync();
  }

  sync() {
    localStorage.setObject(this.namespace, this.obj);
  }

  reset() {
    this.obj = {};
    this.sync();
  }

}

module.exports = StorageManager;
