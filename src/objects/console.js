function Console () {
  this.id = 'Objects.Console';

  this.disabled = true;

  this.pos = new Vec.Vec2();

  this.move = function () {
  }
  this.enable = function () {
    this.disabled = false;
  }
  this.disable = function () {
    this.disabled = true;
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
