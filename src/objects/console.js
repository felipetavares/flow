function Console () {
  DefaultObject.call(this);

  this.id = 'Objects.Console';

  this.disabled = true;

  this.z = 0.5;

  this.move = function () {
  }

  this.access = function (character, user) {
    console.log('access');

    user.setDirty(this, 'disabled');

    this.disabled = !this.disabled;

    this.activateConnected(this.disabled?'disable':'enable', character, user);
  }

  this.tile = function () {
    return 'console:'+(this.disabled?'disabled':'enabled');
  }
}

module.exports = {
  'Console': Console
}

var Vec = require('../vec');
var DefaultObject = require('./default.js');
