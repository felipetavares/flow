function Console () {
  this.id = 'Objects.Console';

  this.disabled = true;

  this.pos = new Vec.Vec2();

  this.connected = new Array();

  this.connect = function (to, actionsMap) {
    this.connected.push({
      uniqueId: to,
      action: actionsMap
    });
  }

  this.activateConnected = function (action) {
    // Enable all connected objects
    for (var c in this.connected) {
      var o = this.map.objects[this.connected[c].uniqueId];
      o[this.connected[c].action[action]]();
    }
  }

  this.move = function () {
  }
  this.enable = function () {
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
