const Eventful = require('./utils/eventful');
const StorageManager = require('./utils/storage');

module.exports = {
  eventful: new Eventful(),
  storage: new StorageManager('lost-without-you')
};
