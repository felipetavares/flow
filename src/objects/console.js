function Console () {
  DefaultObject.call(this);

  this.id = 'Objects.Console';

  this.disabled = true;

  this.move = function () {
  }

  this.access = function () {
    this.disabled = false;

    this.activateConnected('enable');
  }
  this.disable = function () {
    this.disabled = true;

    this.activateConnected('disable');
  }

  this.tile = function () {
    return 'console:'+this.disabled?'disabled':'enabled';
  }
}

module.exports = {
  'Console': Console
}

var Vec = require('../vec/lib.js');
var DefaultObject = require('./default.js');
