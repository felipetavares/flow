function Console () {
  DefaultObject.call(this);

  this.id = 'Objects.Console';

  this.disabled = true;

  this.move = function () {
  }

  this.access = function (character, user) {
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

var Vec = require('../vec/lib.js');
var DefaultObject = require('./default.js');
